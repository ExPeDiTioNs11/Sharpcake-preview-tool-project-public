import React, { useState } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import red_button from '../styles/red_button';
import black_button from '../styles/black_button';
export default function UpdateCampaignModal({ campaignId, campaignName, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdate = () => {
    // İstek için gerekli kodlar buraya gelecek
    onUpdate(campaignId, newCampaignName); // Güncelleme fonksiyonu
    setOpen(false);
  };

  return (
    <div>
      <IconButton style={{color:'gray'}} onClick={handleOpen}>
        <EditIcon style={{fontSize: '25px'}} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="update-campaign-modal-title"
        aria-describedby="update-campaign-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white', // Arka plan rengi beyaz
            boxShadow: 24,
            padding: '30px',
            borderRadius: '10px',
          }}
        >
          <h2 id="update-campaign-modal-title">Edit Campaign</h2>
          <hr />
          <TextField
            label="New Campaign Name"
            value={newCampaignName || campaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            fullWidth
            margin="normal"
          />
           
          <Button variant="contained" onClick={handleUpdate} sx={{
              ...black_button,
              '&:hover': {
                backgroundColor: 'green',
              } 
            }} >
            APPLY
          </Button>
          <Button variant="contained" onClick={handleClose} sx={{
              ...red_button,
              '&:hover': {
                backgroundColor: '#D90E28',
              },
              ml: 2
            }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
