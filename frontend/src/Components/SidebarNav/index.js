import React from 'react';
import List from '@mui/material/List';

import { sideBarNavMenu } from '../../utils/constant';
import SidebarNavItem from './SidebarNavItem';
import { useAppContext } from 'context/AppContext';

const SidebarNav = () => {
  const { userData } = useAppContext();

  return (
    <>
      <List style={{ paddingTop:'0'}}>
        {sideBarNavMenu
          ?.filter(item =>
            item?.allowedUserTypes?.includes(userData?.user_type)
          )
          ?.map(item => {
            return <SidebarNavItem menuItem={item} key={item.key} />;
          })}
      </List>
    </>
  );
};

export default SidebarNav;
