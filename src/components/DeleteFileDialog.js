import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import red_button from '../styles/red_button';

export default function FileDeleteDialog({ open, handleClose, handleDelete }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Are you sure you want to delete the file?</DialogTitle>
      <DialogContent>
       If the deletion process continues, the file will be permanently deleted.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button sx={{...red_button, '&:hover': { backgroundColor: 'red', border: 'none' }}} onClick={handleDelete} variant="contained" color="primary">
          I am sure!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
