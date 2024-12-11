import { useAppContext } from 'context/AppContext';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useContactMutations,
  useDepartmentMutations,
} from 'services/mutations';
import { useContactQueries, useDepartmentQueries } from 'services/queries';
import { userTokenExists } from 'utils/common';
import { routeUrls } from 'utils/constant';

const homeContext = createContext({});

export const HomeContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = useAppContext();
  const departmentMutation =
    useDepartmentMutations.useUpdateDepartmentMutation();
  const contactMutation = useContactMutations.useCreateContactMutation();
  const toggleContactActive =
    useContactMutations.useToggleContactActiveMutation();
  const { data: rolesResponse } = useContactQueries.useContactRolesQuery({
    enabled: isUserLoggedIn,
  });
  const rolesData = rolesResponse?.data?.results;

  const {
    data: departmentResponse,
    isFetchingDepartment,
    refetch: refetchDepartment,
  } = useDepartmentQueries.useDepartmentQuery({
    enabled: false,
  });
  const departmentData = departmentResponse?.data?.results;

  useEffect(() => {
    if (!userTokenExists()) {
      navigate(routeUrls.login, { replace: true });
    }
  }, [navigate]);

  return (
    <homeContext.Provider
      value={{
        rolesData,
        departmentData,
        isFetchingDepartment,
        refetchDepartment,
        departmentMutation,
        contactMutation,
        toggleContactActive,
      }}
    >
      {children}
    </homeContext.Provider>
  );
};

export const useHomeContext = () => {
  const {
    rolesData,
    departmentData,
    isFetchingDepartment,
    refetchDepartment,
    departmentMutation,
    contactMutation,
    toggleContactActive,
  } = useContext(homeContext);

  return {
    rolesData,
    departmentData,
    isFetchingDepartment,
    refetchDepartment,
    departmentMutation,
    contactMutation,
    toggleContactActive,
  };
};
