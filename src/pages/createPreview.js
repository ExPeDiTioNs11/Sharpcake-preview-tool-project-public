import React, { useState } from 'react';
import NavbarLogined from '../components/NavbarLogined';
import MultipleSelectChip from '../components/select_options';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import black_button from '../styles/black_button';
import { Link } from 'react-router-dom'; 
import { Create, Cancel } from '@mui/icons-material';
import './../disableConsole'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  localStorage.removeItem('brandLogoPath');
  const accessToken = localStorage.getItem('accessToken');
  const [campaignName, setCampaignName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState('');
 
 
 
  const [loading, setLoading] = useState(false);

  const handleCategoriesChange = (categories) => {
    setSelectedCategories(categories);
  };

  // işlem başarılı mesajı
  const handleSuccess = () => {
    toast.success('Addition successful!');
    const createdCampaignId = sessionStorage.getItem('createdCampaignId')
    // 2 saniye sonra sayfa geçişi
  
    setTimeout(() => {
      window.location.href = `/campaign-detail/${createdCampaignId}`;
    }, 2000);
  };

  // işlem başarısız mesajı
  const handleError = () => {
    toast.warning('Campaign name cannot be empty!');
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const brand_id = selectedCategories;

    setLoading(true);

    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        brand_id: brand_id,
        campaignName: campaignName
      }),
    };

    try {
      const response = await fetch('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/create-campaign', settings);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        sessionStorage.setItem('createdCampaignId', data.campaign._id)
        handleSuccess();
        setCampaignName('');
        setSelectedCategories();
      } else {
        handleError();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setLoading(false);
    }
  };

   

  if (accessToken) {
    return (
      <div>
        <NavbarLogined />
        <Container maxWidth="md">
          <div className="container">
            <form onSubmit={handleCreateCampaign}>
              <div className="create-preview-form-yatay">
                <div>
                  <MultipleSelectChip onCategoriesChange={handleCategoriesChange} />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <TextField
                    label="Campaign Name"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      sx: {
                        fontWeight: 'bold'
                      },
                    }}
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
              </div>
              <br />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  ...black_button,
                  '&:hover': {
                    backgroundColor: '#D90E28',
                  },
                  ml: 2,
                }}
                disabled={loading}
              >
                {loading && <div className="loader"></div>}
                <Create style={{ fontSize: '20px', marginRight: '5px' }} />
                Create
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...black_button,
                  '&:hover': {
                    backgroundColor: 'gray',
                  },
                  ml: 2,
                }}
              >
                <Cancel style={{ fontSize: '20px' }} />
                <Link to="/home" style={{ textDecoration: 'none', color: 'white' }}>Cancel</Link>
              </Button>
            </form>
          </div>
        </Container>
        <ToastContainer />
      </div>
    );
  } else {
    window.location.href = '/';
    return null;
  }
};

export default CreateProject;
