import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';

import Button from 'Components/Button';
import ContactForm from 'Components/ContactForm';
import DepartmentForm from 'Components/DepartmentForm';
import HorizontalDivider from 'Components/HorizontalDivider';
import { formatDateTime, sortArray } from 'utils/helper';
import { useHomeContext } from 'Pages/Home/context/HomeContext';

import './styles.scss';

const ProfileView = ({
  departmentInfo,
  unitInfo,
  userRoles,
  refetchDepartment,
  fromUpdateDepartment,
  onCancel,
  testId,
}) => {
  const { departmentMutation, contactMutation, toggleContactActive } =
    useHomeContext();
  const [department, setDepartment] = useState(departmentInfo || {});
  const [contacts, setContacts] = useState([]);
  const updatedContacts = useRef([]);
  const updatedDepartment = useRef({});
  const [hasError, setHasError] = useState(true);
  const [loading, setLoading] = useState(false);
  const [beErrors, setBeErrors] = useState(null);

  useEffect(() => {
    updatedContacts.current = [];
    updatedDepartment.current = {};
  }, []);

  useEffect(() => {
    setDepartment(departmentInfo);
  }, [departmentInfo]);

  useEffect(() => {
    let newContacts = [];
    setContacts([
      ...(sortArray(department?.contacts, 'id')?.map((contact, index) => ({
        ...contact,
        contact_id: index,
      })) || []),
      ...newContacts,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const handleAddContactClick = () => {
    setContacts([
      ...contacts,
      { contact_id: contacts?.length + 1, dept: department?.id },
    ]);
  };

  const checkErrorState = () => {
    const hasChanges =
      updatedContacts?.current?.length ||
      Object.keys(updatedDepartment?.current)?.length;
    const hasInValidContact = updatedContacts?.current?.some(
      contact => !contact?.isValid
    );
    const hasInValidDepartment = updatedDepartment?.current?.id
      ? !updatedDepartment?.current?.isValid
      : false;

    setHasError(!hasChanges || hasInValidContact || hasInValidDepartment);
  };

  const handleContactChange = (contactData, isValid) => {
    const contactExist = updatedContacts?.current?.find(info => {
      return (
        (info?.id && info?.id === contactData?.id) ||
        (info?.contact_id && info?.contact_id === contactData?.contact_id)
      );
    });
    const currentContact = contacts?.find(info => {
      return (
        (info?.id && info?.id === contactData?.id) ||
        (info?.contact_id && info?.contact_id === contactData?.contact_id)
      );
    });

    const hasChanges = Object.keys(contactData)?.some(
      field => contactData[field] !== currentContact?.[field]
    );

    if (!currentContact || hasChanges) {
      updatedContacts.current = contactExist
        ? updatedContacts?.current?.map(info => {
            if (
              (info?.id && info?.id === contactData?.id) ||
              (info?.contact_id && info?.contact_id === contactData?.contact_id)
            ) {
              return { ...info, ...contactData, isValid };
            } else {
              return { ...info };
            }
          })
        : [...updatedContacts?.current, { ...contactData, isValid }];
    } else if (!hasChanges && contactExist) {
      updatedContacts.current =
        updatedContacts?.current?.filter(info => {
          return (
            (info?.id && info?.id === contactData?.id) ||
            (info?.contact_id && info?.contact_id === contactData?.contact_id)
          );
        }) || [];
    }
    checkErrorState();
  };

  const handleDepartmentChange = (departmentData, isValid) => {
    const hasChanges = Object.keys(departmentData)?.some(
      field => departmentData[field] !== department[field]
    );

    if (hasChanges) {
      updatedDepartment.current = { ...departmentData, isValid };
    } else {
      updatedDepartment.current = {};
    }
    checkErrorState();
  };

  const handleCancel = () => {
    setContacts([]);
    setDepartment({ ...department });
    onCancel?.();
  };

  const handleUpdate = async () => {
    setLoading(true);
    setBeErrors(null);
    let failed = false;

    if (Object.keys(updatedDepartment?.current)?.length) {
      failed = true;
      try {
        await departmentMutation.mutateAsync(updatedDepartment?.current);
        updatedDepartment.current = {};
        failed = false;
      } catch (e) {
        const errors = e?.response?.data?.data?.errors;
        setBeErrors(prev => ({
          ...prev,
          department: errors,
        }));
        setLoading(false);
        failed = true;
      }
    }

    if (failed) {
      return false;
    }

    if (updatedContacts.current?.length) {
      const mutations = [];
      updatedContacts.current.forEach(async contact => {
        try {
          mutations.push(
            contactMutation.mutateAsync(contact)?.catch(e => {
              const errors = e?.response?.data?.data?.errors;
              setBeErrors(prev => ({
                ...prev,
                contacts: {
                  ...(prev?.contacts || null),
                  [contact?.contact_id]: errors,
                },
              }));
              return e;
            })
          );
        } catch (e) {}
      });

      if (mutations?.length) {
        try {
          await Promise.all(mutations);
          updatedContacts.current = [];
          failed = false;
        } catch (e) {
          failed = true;
          setLoading(false);
        }
      }
    }

    if (!failed) {
      toast.success('Successfully Updated department info.', {
        hideProgressBar: true,
      });
      refetchDepartment?.();
      onCancel?.();
    }

    setLoading(false);
  };

  const toggleActive = async contact => {
    if (contact?.id) {
      setLoading(true);
      try {
        await toggleContactActive.mutateAsync(contact);
        toast.success(
          `Contact is set as ${contact?.is_active ? 'inactive' : 'active'}.`
        );
        refetchDepartment?.();
      } catch (e) {}
      setLoading(false);
    }
  };

  return (
    <div className={fromUpdateDepartment ? '' : 'department-profile-forms'}>
      <Grid
        container
        spacing={2}
        ml={0}
        mt={0}
        className="department-profile-forms__grid"
        sx={{ width: '100%' }}
      >
        <Grid item xs={12}>
          <DepartmentForm
            department={department}
            unitInfo={unitInfo}
            handleDepartmentChange={handleDepartmentChange}
            BeErrors={beErrors?.department}
            hideTitle={fromUpdateDepartment}
            testId={testId}
          />
        </Grid>
        {sortArray(contacts, 'contact_id')?.map((contact, index) => (
          <Fragment key={`contact-divider-${contact?.contact_id}`}>
            <Grid item xs={12} key={`contact-divider-${contact?.contact_id}`}>
              <HorizontalDivider />
            </Grid>
            <Grid item xs={12} key={`contact-${contact?.contact_id}`}>
              <ContactForm
                roles={userRoles}
                contact={contact}
                handleContactChange={handleContactChange}
                toggleActive={toggleActive}
                BeErrors={beErrors?.contacts?.[contact?.contact_id]}
                loading={loading}
                testId={`${testId}-contact-${index}`}
              />
            </Grid>
          </Fragment>
        ))}
        <Grid item xs={4}>
          <Button
            label="Add New Contact"
            className="black-btn full-width"
            onClick={handleAddContactClick}
            testId={`${testId}-btn-add-contact`}
          />
        </Grid>
        <Grid item xs={12}>
          <HorizontalDivider />
        </Grid>
        <Grid item xs={4}>
          <Button
            label="Cancel"
            variant="outlined"
            className="black-outlined-btn full-width"
            onClick={handleCancel}
            testId={`${testId}-btn-cancel`}
          />
        </Grid>
        <Grid item xs={8}>
          <Button
            label="Update"
            className="full-width"
            variant="contained"
            disabled={hasError}
            onClick={handleUpdate}
            loading={loading}
            testId={`${testId}-btn-update-department`}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="caption"
            align="right"
            sx={{ width: '100%', fontStyle: 'italic' }}
            component="div"
            gutterBottom
            data-testid={`${testId}-department-last-modified`}
          >
            {(department?.modified_at ||
              department?.modified_by ||
              department?.created_at) && (
              <>
                Last modified
                {department?.modified_by?.name &&
                  ` by ${department?.modified_by?.name}`}
                {(department?.modified_at || department?.created_at) &&
                  ` on ${formatDateTime(
                    department?.modified_at || department?.created_at,
                    'MM/DD/YYYY'
                  )}`}
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileView;
