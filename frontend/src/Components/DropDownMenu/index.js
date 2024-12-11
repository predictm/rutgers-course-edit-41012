import React, { useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import { NavLink } from 'react-router-dom';

const DropDownMenu = ({
  itemList,
  menuTitle,
  anchorRef,
  onClose,
  onClick,
  open,
  testId,
}) => {
  const handleClose = event => {
    if (anchorRef && anchorRef?.contains(event.target)) {
      return;
    }

    onClose();
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.focus();
    }

    prevOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Popper
      open={open}
      anchorEl={anchorRef}
      role={undefined}
      placement="right-start"
      sx={{ zIndex: 10 }}
      transition
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'right-start' ? 'right top' : 'right bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                onKeyDown={handleListKeyDown}
                data-testid={testId}
              >
                {menuTitle && (
                  <MenuItem
                    sx={{
                      color: '#707070',
                      letterSpacing: '2.4px',
                      fontSize: '1.5rem',
                    }}
                  >
                    {menuTitle}
                  </MenuItem>
                )}
                {menuTitle && <Divider my="0.5" />}
                {itemList?.map(item => {
                  return (
                    <NavLink
                      to={item.path}
                      end
                      style={{ textDecoration: 'none' }}
                      key={item?.key}
                      data-testid={`${testId}-${item?.key}`}
                      onClick={onClick(item)}
                    >
                      {({ isActive }) => (
                        <MenuItem
                          key={`${item?.key}-menu-item`}
                          data-testid={`${item?.key}-menu-item`}
                          selected={isActive}
                          sx={{ color: '#666666', fontSize: '1.125rem' }}
                        >
                          {item?.name}
                        </MenuItem>
                      )}
                    </NavLink>
                  );
                })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default DropDownMenu;
