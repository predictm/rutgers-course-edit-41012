import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SimpleModal from 'Components/SimpleModal';
import ProfileView from 'Pages/DepartmentProfile/ProfileView';
import { useHomeContext } from 'Pages/Home/context/HomeContext';
import { ReactComponent as CloseIcon } from 'assets/icons/icon-close.svg';

const DepartmentEditModal = ({
  open,
  onClose,
  refetchDepartment,
  departmentInfo,
}) => {
  const { rolesData } = useHomeContext();

  const userRoles =
    rolesData?.map(role => ({
      value: role.id,
      label: role.name,
    })) || [];

  return (
    <SimpleModal open={open} onClose={onClose}>
      <div style={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: '2px solid #C9C9C9' }}
        >
          <Grid item>
            <Typography
              variant="h4"
              sx={{ color: '#383C49', fontSize: '2rem', fontWeight: '400' }}
              data-testid="edit-department-title"
            >
              Edit Department - {departmentInfo?.department?.subj_descr}
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon
              onClick={onClose}
              style={{ width: '5rem', height: '5rem', cursor: 'pointer' }}
              data-testid="close-edit-department-modal"
            />
          </Grid>
        </Grid>
      </div>
      <Grid container px={2} my={2}>
        <ProfileView
          departmentInfo={departmentInfo?.department}
          unitInfo={departmentInfo?.offering_unit}
          userRoles={userRoles}
          refetchDepartment={refetchDepartment}
          onCancel={onClose}
          fromUpdateDepartment={true}
          testId="edit-department-modal"
        />
      </Grid>
    </SimpleModal>
  );
};

export default DepartmentEditModal;
