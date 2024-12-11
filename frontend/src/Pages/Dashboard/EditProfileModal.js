import React, { useState, useRef, useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import CameraAltIcon from '@mui/icons-material/CameraAltOutlined';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { ReactComponent as NotificationIcon } from '../../assets/icons/icon-notification-fill.svg';

import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';
import Button from 'Components/Button';
import { useUsersMutation } from 'services/mutations';
import SimpleModal from 'Components/SimpleModal';
import FormInput from 'Components/FormInput';
import LightTooltip from 'StyledComponents/LightTooltip';
import { ReactComponent as InfoIcon } from 'assets/icons/icon-info.svg';
import useForm from 'hooks/Form';
import validator from 'utils/validation';
import { formatDateTime, formatPhoneNumber } from 'utils/helper';
import { useAppContext } from 'context/AppContext';
import { localStorageKeys } from 'utils/config';

const EditProfileModal = ({ open, onClose, refetchUser, userData }) => {
  const addCommentRef = useRef();
  const hiddenFileInput = useRef();
  const [beErrors, setBeErrors] = useState({});
  const [netId, setNetId] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const updateUser = useUsersMutation.useUpdateUserMutation();
  const {setUserData}= useAppContext();

  const stateSchema = useMemo(
    () => ({
      first_name: {
        value: userData?.first_name || '',
        error: '',
      },
      last_name: {
        value: userData?.last_name || '',
        error: '',
      },
      email: {
        value: userData?.email || '',
        error: '',
      },
      phone_number: {
        value: userData?.phone_number || '',
        error: '',
      },
    }),
    [userData]
  );

  const validationSchema = {
    first_name: {
      required: true,
    },
    last_name: {
      required: true,
    },
    email: {
      required: true,
      validator: validator.email,
    },
    phone_number: {
      required: true,
      validator: validator.checkLength("please input 10 digit number",12),
    },
  };
  const { state, handleOnChange, disable, setState } = useForm(
    stateSchema,
    validationSchema
  );

  useEffect(() => {
    setState(stateSchema);
  }, [stateSchema, setState]);

  const handleInputChange = field => event => {
    setBeErrors({ ...beErrors, [field]: '' });
    if(field==='phone_number')
    handleOnChange(field, formatPhoneNumber(event?.target?.value));
  else{
    handleOnChange(field, event?.target?.value);
  }
  };

  const handleFileUpload = event => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded?.size > 2097152) {
      setBeErrors({
        ...beErrors,
        profile_image: 'Profile image file size must be within 5MB.',
      });
    }
    setProfileImage(fileUploaded);
  };

  const handleNetIdChange = event => {
    setBeErrors({ ...beErrors, net_id: '' });
    setNetId(event?.target?.value);
    if (event?.target?.value !== userData?.net_id) {
      setBeErrors({
        ...beErrors,
        net_id: 'NetID does not match. Please provide valid NetID.',
      });
    }
  };

  const handleFileUploadClick = event => {
    hiddenFileInput.current.click();
  };

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      const payload = {
        ...Object.keys(state)?.reduce((acc, field) => {
          return state?.[field]?.value === userData?.[field]
            ? acc
            : { ...acc, [field]: state?.[field]?.value };
        }, {}),
        ...(profileImage ? { profile_image: profileImage } : null),
      };
       const updatedData = await updateUser.mutateAsync({
        id: userData?.id,
        ...payload,
      });
      localStorage.setItem(
        localStorageKeys.user,
        JSON.stringify({
          ...updatedData?.data,
        })
      );
      setUserData(updatedData?.data);
      toast.success('Successfully updated profile information.',{
        hideProgressBar: true,
      });
      refetchUser?.();
      onClose();
    } catch (e) {
      const errors = e?.response?.data?.errors;
      setBeErrors({
        ...errors,
      });
      toast.error(
        'An error occurred while updating the profile information. Please try again later.',{
          hideProgressBar: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleModal open={open} onClose={onClose}>
      <Grid
        sx={{
          backgroundColor: '#F5F5F5',
          borderRadius: '2rem',
        }}
      >
        <Grid container ref={addCommentRef}>
          <Grid
            container
            item
            xs="12"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              borderBottom: '2px solid #C9C9C9',
              paddingTop: '2rem',
              margin: '0 2rem',
            }}
          >
            <Grid item xs>
              <Typography
                variant="h2"
                component="span"
                sx={{
                  color: '#383C49',
                  fontSize: '2rem',
                  fontWeight: '400',
                }}
                data-testid="edit-profile-modal-title"
              >
                Edit Profile
              </Typography>
              <Typography
                variant="subtitle"
                component="span"
                sx={{
                  color: '#707070',
                  fontSize: '1rem',
                  fontWeight: '400',
                  marginLeft: '2rem',
                  display: 'inline-flex',
                  gap: '1rem',
                  fontStyle: 'italic',
                }}
                data-testid="edit-profile-modal-created-last-updated"
              >
                {Boolean(userData?.date_joined) && (
                  <>
                    <span>
                      Created:{' '}
                      {formatDateTime(userData?.date_joined, 'MM-DD-YYYY')}
                    </span>
                    <span>|</span>
                  </>
                )}
                {Boolean(userData?.modified_at) && (
                  <span>
                    Last updated:{' '}
                    {formatDateTime(
                      userData?.modified_at,
                      'MM-DD-YYYY HH:mm A'
                    )}
                  </span>
                )}
              </Typography>
            </Grid>
            <Grid item>
              <CloseIcon
                onClick={onClose}
                style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
                data-testid="edit-profile-modal-close-icon"
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs="12"
            alignItems="stretch"
            sx={{ margin: '2rem' }}
            spacing={2}
          >
            <Grid
              container
              item
              xs={3}
              alignItems="center"
              spacing={2}
              sx={{ paddingRight: '2rem', position: 'relative' }}
            >
              <Avatar
                sx={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 1,
                  background:
                    profileImage || userData?.profile_image
                      ? 'transparent'
                      : '#000000',
                  border:
                    profileImage || userData?.profile_image
                      ? '1px solid #000000'
                      : '',
                }}
              >
                {profileImage || userData?.profile_image ? (
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : userData?.profile_image
                    }
                    alt="profile-pic"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <PersonIcon
                    sx={{ width: '100%', height: '100%', color: '#F5F5F5' }}
                  />
                )}
              </Avatar>
              <Avatar
                sx={{
                  position: 'absolute',
                  bottom: '12%',
                  right: '13%',
                  zIndex: '2',
                  background: '#FFFFFF',
                }}
                onClick={handleFileUploadClick}
              >
                <input
                  type="file"
                  onChange={handleFileUpload}
                  ref={hiddenFileInput}
                  style={{ display: 'none' }}
                  accept="image/png,image/gif,image/jpeg"
                />
                <CameraAltIcon sx={{ color: '#000000',cursor:'pointer' }} />
              </Avatar>
              <div
                style={{
                  position: 'absolute',
                  height: '22%',
                  width: '100%',
                  bottom: '-2px',
                  background: '#F5F5F5',
                  zIndex: '1',
                }}
              ></div>
              {beErrors?.profile_image && (
                <div
                  data-testid={`edit-profile-modal-profile-image-error`}
                  style={{ color: '#d32f2f' }}
                >
                  {beErrors?.profile_image}
                </div>
              )}
            </Grid>
            <Grid container item xs={9} alignItems="center" spacing={2}>
              <Grid container item xs={12} alignItems="center" spacing={2}>
                <Grid item xs={6}>
                  <FormInput
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    value={state.first_name.value}
                    error={state.first_name.error || beErrors?.first_name}
                    onChange={handleInputChange('first_name')}
                    testId="edit-profile-modal-first-name"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInput
                    label="Last Name"
                    type="text"
                    placeholder="Last Name"
                    value={state.last_name.value}
                    error={state.last_name.error || beErrors?.last_name}
                    onChange={handleInputChange('last_name')}
                    testId="edit-profile-modal-last-name"
                    required
                  />
                </Grid>
              </Grid>
              <Grid container item xs="12" alignItems="center" spacing={2}>
                <Grid item xs={6}>
                  <FormInput
                    label="Email"
                    type="text"
                    placeholder="Email"
                    value={state.email.value}
                    error={state.email.error || beErrors?.email}
                    onChange={handleInputChange('email')}
                    testId="edit-profile-modal-email"
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInput
                    label="Phone"
                    type="text"
                    placeholder="Phone"
                    value={state.phone_number.value}
                    error={state.phone_number.error || beErrors?.phone_number}
                    onChange={handleInputChange('phone_number')}
                    testId="edit-profile-modal-phone"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item xs="12" alignItems="center" spacing={2}>
                <FormControl sx={{ width: '100%' }}>
                  <FormLabel
                    sx={{
                      color: '#383C49',
                      fontSize: '1rem',
                      fontWeight: '400',
                      transform: 'scale(1)',
                      marginBottom: '3px',
                    }}
                  >
                    Unit # : Subject #
                    <span
                      style={{
                        marginLeft: '0.5rem',
                      }}
                    >
                      <LightTooltip
                        placement="right-start"
                        arrow
                        sx={{
                          '.MuiTooltip-tooltip': { maxWidth: 'unset' },
                        }}
                        title={
                          <Typography
                            component="span"
                            nowrap
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              flexDirection: 'column',
                              width: 'max-content',
                            }}
                          >
                            Mouse over the unit and subject numbers to see
                            school and unit names.
                          </Typography>
                        }
                        data-testid="edit-profile-modal-school-unit-tooltip"
                      >
                        <InfoIcon
                          className="info-icon"
                          data-testid="courses-search-tooltip-trigger"
                          style={{ width: '1rem', height: '1rem' }}
                        />
                      </LightTooltip>
                    </span>
                  </FormLabel>
                  <Box
                    sx={{
                      border: '1px solid #C9C9C9',
                      borderRadius: '0.625rem',
                      height: '2.25rem',
                      fontSize: '1rem',
                      padding: '0.5rem 0.75rem',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {userData?.assigned_departments?.map(department => (
                      <>
                        <LightTooltip
                          placement="bottom-start"
                          arrow
                          sx={{
                            '.MuiTooltip-tooltip': { maxWidth: 'unset' },
                          }}
                          title={
                            <Typography
                              component="span"
                              nowrap
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                                width: 'max-content',
                              }}
                            >
                              {department?.offering_unit_descr}&nbsp;:&nbsp;
                              {department?.subj_descr}
                            </Typography>
                          }
                          data-testid="edit-profile-modal-school-unit-name-tooltip"
                        >
                          {department?.offering_unit_cd}:{department?.subj_cd}
                        </LightTooltip>

                        <Typography
                          component="span"
                          sx={{
                            position: 'relative',

                            ':not(:last-of-type)': {
                              marginLeft: '0.5rem',
                              paddingLeft: '1rem',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                backgroundColor: '#333333',
                                borderRadius: '50%',
                                height: '0.5rem',
                                width: '0.5rem',
                                left: '0',
                                display: 'inline-block',
                                transform: 'translate(0, -50%)',
                              },
                            },
                          }}
                        ></Typography>
                      </>
                    ))}
                  </Box>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box
            direction="row"
            justifyContent="left"
            alignItems="center"
            mb={2}
            sx={{
              backgroundColor: '#FFE357',
              padding: '2rem',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',

              svg: {
                path: {
                  fill: '#333333',
                },
              },
            }}
          >
            <NotificationIcon
              style={{
                width: '3.5rem',
                height: '3.5rem',
              }}
            />
            <Typography
              sx={{
                color: '#333333',
                fontSize: '2.25rem',
              }}
            >
              Are you ABSOLUTELY sure?
            </Typography>
            <div>
              <Typography
                sx={{
                  color: '#333333',
                  fontSize: '1.5rem',
                }}
              >
                Type your <strong>NetID</strong> below to process the update.
              </Typography>
              <Typography
                sx={{
                  color: '#333333',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                }}
              >
                Modifying your profile will reflect updated information relevant
                to the course sessions.
              </Typography>
            </div>
          </Box>
          <Grid item xs="12" alignItems="stretch" sx={{ margin: '2rem' }}>
            <FormInput
              type="text"
              placeholder="NetID"
              value={netId}
              error={beErrors?.net_id}
              onChange={handleNetIdChange}
              testId="edit-profile-modal-net-id"
              required
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={3}
            sx={{
              padding: '0 2rem 2rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
            }}
          >
            <Grid item xs={6}>
              <Button
                className="black-outlined-btn full-width"
                label="Cancel"
                onClick={onClose}
                loading={loading}
                testId="edit-profile-modal-cancel-btn"
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                className="red-btn full-width"
                label="Update"
                onClick={handleEditProfile}
                loading={loading}
                disabled={
                  (disable && !profileImage) || !netId || beErrors?.net_id
                }
                testId="edit-profile-modal-update-btn"
              />
              {(disable && !profileImage) || !netId || beErrors?.net_id}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SimpleModal>
  );
};

export default EditProfileModal;
