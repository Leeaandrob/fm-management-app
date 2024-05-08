import PropTypes from 'prop-types';
import { useState } from 'react';

import {
  Popover,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip,
  Stack
} from '@mui/material';

import Label from 'ui-component/Label';
import TableSwitch from 'ui-component/Switch';
import { renderQuota, renderNumber } from 'utils/common';
import { IconDotsVertical, IconEdit, IconTrash, IconUser, IconBrandWechat, IconBrandGithub, IconMail } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

function renderRole(role) {
  switch (role) {
    case 1:
      return <Label color="default">Regular User</Label>;
    case 10:
      return <Label color="orange">Administrator</Label>;
    case 100:
      return <Label color="success">Super Administrator</Label>;
    default:
      return <Label color="error">Unknown Identity</Label>;
  }
}

export default function UsersTableRow({ item, manageUser, handleOpenModal, setModalUserId }) {
  const theme = useTheme();
  const [open, setOpen] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [statusSwitch, setStatusSwitch] = useState(item.status);

  const handleDeleteOpen = () => {
    handleCloseMenu();
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleStatus = async () => {
    const switchValue = statusSwitch === 1 ? 2 : 1;
    const { success } = await manageUser(item.username, 'status', switchValue);
    if (success) {
      setStatusSwitch(switchValue);
    }
  };

  const handleDelete = async () => {
    handleCloseMenu();
    await manageUser(item.username, 'delete', '');
  };

  return (
    <>
      <TableRow tabIndex={item.id}>
        <TableCell>{item.id}</TableCell>

        <TableCell>{item.username}</TableCell>

        <TableCell>
          <Label>{item.group}</Label></TableCell>

        <TableCell>
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <Tooltip title={'Remaining Quota'} placement="top">
              <Label color={'primary'} variant="outlined">
                {' '}
                {renderQuota(item.quota)}{' '}
              </Label>
            </Tooltip>
            <Tooltip title={'Used Quota'} placement="top">
              <Label color={'primary'} variant="outlined">
                {' '}
                {renderQuota(item.used_quota)}{' '}
              </Label>
            </Tooltip>
            <Tooltip title={'Request Count'} placement="top">
              <Label color={'primary'} variant="outlined">
                {' '}
                {renderNumber(item.request_count)}{' '}
              </Label>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>{renderRole(item.role)}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <Tooltip title={item.wechat_id ? item.wechat_id : 'Not Bound'} placement="top">
              <IconBrandWechat color={item.wechat_id ? theme.palette.success.dark : theme.palette.grey[400]} />
            </Tooltip>
            <Tooltip title={item.github_id ? item.github_id : 'Not Bound'} placement="top">
              <IconBrandGithub color={item.github_id ? theme.palette.grey[900] : theme.palette.grey[400]} />
            </Tooltip>
            <Tooltip title={item.email ? item.email : 'Not Bound'} placement="top">
              <IconMail color={item.email ? theme.palette.grey[900] : theme.palette.grey[400]} />
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell>
          {' '}
          <TableSwitch id={`switch-${item.id}`} checked={statusSwitch === 1} onChange={handleStatus} />
        </TableCell>
        <TableCell>
          <IconButton onClick={handleOpenMenu} sx={{ color: 'rgb(99, 115, 129)' }}>
            <IconDotsVertical />
          </IconButton><TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 }
        }}
      >
        {item.role !== 100 && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              manageUser(item.username, 'role', item.role === 1 ? true : false);
            }}
          >
            <IconUser style={{ marginRight: '16px' }} />
            {item.role === 1 ? 'Set as administrator' : 'Cancel administrator'}
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            handleOpenModal();
            setModalUserId(item.id);
          }}
        >
          <IconEdit style={{ marginRight: '16px' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
          <IconTrash style={{ marginRight: '16px' }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete user {item.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Close</Button>
          <Button onClick={handleDelete} sx={{ color: 'error.main' }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UsersTableRow.propTypes = {
  item: PropTypes.object,
  manageUser: PropTypes.func,
  handleOpenModal: PropTypes.func,
  setModalUserId: PropTypes.func
};