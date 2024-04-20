import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import black_button from '../styles/black_button';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import './../disableConsole';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [emailValue, setEmailValue] = useState('');
  const [loading, setLoading] = useState(false); // Yükleme durumu için state

  const resetPassword = () => {
    setLoading(true); // İşlem başladığında yükleme durumunu true yap
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", emailValue);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/forgot-password", requestOptions)
      .then((response) => {
        
        if (response.ok) {
          toast.success("Your password has been reset. Please check your email.");
          setTimeout(() => {
            window.location = "/"
        }, 4000); // saniye sonra login ekranına yönlendir.
        } else {
          throw new Error('Failed to reset password');
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while resetting your password. Please try again.");
      })
      .finally(() => {
        setLoading(false); // İşlem tamamlandığında yükleme durumunu false yap
      });
  }

  return (
    <div>
      <Navbar />
      <div className="center-content">
        <h2>Forgot Password</h2>
        <TextField
          label="E-mail address"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmailValue(e.target.value)}
          InputProps={{
            sx: {
              fontWeight: 'bold',
              width: '590px'
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            ...black_button,
            '&:hover': {
              backgroundColor: '#D90E28',
              width: '590px'
            },
          }}
          fullWidth
          onClick={resetPassword}
          disabled={loading} // Yükleme durumunda butonu devre dışı bırak
        >
          {loading ? 'Loading...' : 'Send Password'} {/* Yükleme durumuna göre buton metnini değiştir */}
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
