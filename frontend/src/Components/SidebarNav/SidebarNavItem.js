import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';

import DropDownMenu from 'Components/DropDownMenu';
import { useAppContext } from 'context/AppContext';

const CustomListItem = styled(ListItem)({
  '.MuiListItemText-root': {
    opacity: 1,
    fontSize: '1rem',
    color: '#383C49',
    fontWeight: '400',
  },
  '&:hover': {
    borderRight: '3px solid #cc0033',
    '.MuiListItemText-root': {
      opacity: 1,
    },
  },
  '&.Mui-selected': {
    borderRight: '3px solid #cc0033',
  },
  '& .MuiListItemIcon-root': {
    svg: {
      width: '100%',
      height: '100%',
      aspectRatio: 'auto',
    },
  },
});

const SidebarNavItem = ({ menuItem }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const { userData } = useAppContext();

  const handleOpen = e => {
    setAnchorEl(e?.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const handleSubMenuClick = e => {
    e.preventDefault();
  };

  const handleMenuClick = menuItem => e => {
    if (menuItem?.type === 'admin-link') {
      e.preventDefault();
      window.open(menuItem?.path, '_blank');
    }
    onClose();
  };

  return (
    <NavLink
      to={menuItem.path}
      end={menuItem?.subMenu?.length ? false : true}
      style={{ textDecoration: 'none' }}
      key={menuItem?.key}
      onMouseOver={menuItem?.subMenu?.length > 0 ? handleOpen : null}
      onMouseLeave={onClose}
      onClick={
        menuItem?.subMenu?.length
          ? handleSubMenuClick
          : handleMenuClick(menuItem)
      }
      data-testid={menuItem?.key}
    >
      {({ isActive }) => (
        <CustomListItem
          disablePadding
          sx={{ display: 'block' }}
          selected={isActive || Boolean(anchorEl)}
          className={
            isActive || Boolean(anchorEl) ? 'selected-list-menuItem' : ''
          }
        >
          <ListItemButton
            sx={{
              minHeight: 80,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                ...(menuItem?.iconStyle && menuItem?.iconStyle),
              }}
            >
              {isActive ? menuItem?.activeIconSrc : menuItem?.iconSrc}
            </ListItemIcon>
            <ListItemText
              primary={menuItem?.name}
              sx={{ maxHeight: '1.25rem' }}
            />
          </ListItemButton>
          {menuItem?.subMenu?.length > 0 && (
            <DropDownMenu
              anchorRef={anchorEl}
              onClose={onClose}
              onClick={handleMenuClick}
              open={Boolean(anchorEl)}
              itemList={menuItem?.subMenu?.filter(item =>
                item?.allowedUserTypes?.includes(userData?.user_type)
              )}
              menuTitle={menuItem?.name}
            />
          )}
        </CustomListItem>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
