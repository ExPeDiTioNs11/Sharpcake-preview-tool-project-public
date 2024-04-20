import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Container, Grid, Accordion, AccordionSummary, AccordionDetails, CircularProgress } from '@mui/material';
import NavbarLogined from '../components/NavbarLogined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './../disableConsole'

const MyAccount = () => {
  localStorage.removeItem('brandLogoPath');
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhonenumber] = useState('');

  // change password
  const [password, setPassword] = useState('');
  const [rePassword, setRepassword] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');

    var settings = {
      "url": `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/get-by-id/${userId}`,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${accessToken}`
      },
    };

    fetch(settings.url, {
      method: settings.method,
      headers: {
        'Authorization': settings.headers.Authorization
      }
    })
      .then(response => response.json())
      .then(data => {
        setUserData(data.user);
        setLoading(false); // Veri yüklendi, loading'i kapat
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSaveProfile = () => {
    setLoading(true); // İşlem başladığında loading'i etkinleştir

    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');

    const updatedData = {};

    if (name) updatedData.name = name;
    if (surname) updatedData.surname = surname
    if (email) updatedData.email = email;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;

    if (Object.keys(updatedData).length === 0) {
      console.log("Hiçbir veri güncellenmedi.");
      setLoading(false); // İşlem tamamlandığında loading'i devre dışı bırak
      return;
    }

    var settings = {
      url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/user-update/${userId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${accessToken}`
      },
      data: updatedData
    };

    fetch(settings.url, {
      method: settings.method,
      headers: settings.headers,
      body: new URLSearchParams(updatedData).toString()
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setLoading(false); // İşlem tamamlandığında loading'i devre dışı bırak
        window.location.reload(); // Sayfayı yeniden yükle
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false); // Hata oluştuğunda loading'i devre dışı bırak
      });
  }

  const handleSavePassword = () => {
    setLoading(true); // İşlem başladığında loading'i etkinleştir

    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('user_id');
    const updatedData = {};
    if (password === rePassword) {
      updatedData.password = password
      var settings = {
        url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/update-password/${userId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${accessToken}`
        },
          data: updatedData
      };

      fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        body: new URLSearchParams(updatedData).toString()
      })
        .then(response => response.json())
        .then(data => {
          console.log("backend mesajı : " + data.message);
          setLoading(false); // İşlem tamamlandığında loading'i devre dışı bırak
        })
        .catch(error => {
          console.error('Error: Şifre değiştirme hatası :', error);
          setLoading(false); // Hata oluştuğunda loading'i devre dışı bırak
        });
    }
    else {
         alert("Şifreler uyuşmuyor, lütfen kontrol ediniz.")
    }
  }

  function FirstLetters({ name, surname }) {
    // Adı ve soyadı boşluklardan ayırıp parçalıyoruz
    const nameParts = name.split(' ');
    const surnameParts = surname.split(' ');
  
    // Her bir kısmın ilk harfini alıyoruz ve büyük harfe çeviriyoruz
    const firstLetters = nameParts.map(part => part.charAt(0).toUpperCase());
    const lastLetters = surnameParts.map(part => part.charAt(0).toUpperCase());
  
    // İlk harfleri birleştiriyoruz
    const initials = firstLetters.join('') + lastLetters.join('');
  
    return (
      <Avatar sx={{ width: 150, height: 150 }}>
        {initials}
      </Avatar>
    );
  }

  return (
    <div>
      <NavbarLogined />

      <Container sx={{ mt: 8 }}>
        {loading ? (
          <Grid container justifyContent="center" sx={{ height: '70vh' }}>
            <CircularProgress sx={{ color: '#D90E28', width: '100px', height: '100px' }} />
          </Grid>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8} align="center">
              <Avatar src={userData.imgPath} sx={{ width: 150, height: 150 }}>
                <FirstLetters name={userData.name} surname={userData.surname} />
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2 }}>
                {userData.name} {userData.surname}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Phone Number: {userData.phoneNumber}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                E-mail adress: {userData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Accordion sx={{ width: '100%', mt: 2 }}>
                <AccordionSummary sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#D90E28' } }}>
                  <Typography variant="h6">Edit Profile</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <br />
                  <form>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={userData.name || ''}
                        value={name}
                        InputProps={{
                          sx: {
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextField
                        fullWidth
                        label="Surname"
                        variant="outlined"
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder={userData.surname || ''}
                        value={surname}
                        InputProps={{
                          sx: {
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        onChange={(e) => setPhonenumber(e.target.value)}
                        placeholder={userData.phoneNumber || ''}
                        value={phoneNumber}
                        InputProps={{
                          sx: {
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={userData.email !== null ? userData.email : ''}
                        value={email}
                        InputProps={{
                          sx: {
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </div>

                    <Button
                      sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#D90E28' }, fontWeight: 'bold' }}
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress color="inherit" size={24} /> : "Save Profile"}
                    </Button>
                  </form>
                </AccordionDetails>
              </Accordion>
              <Accordion sx={{ width: '100%', mt: 2 }}>
                <AccordionSummary sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#D90E28' } }}>
                  <Typography variant="h6">Change Password</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <br />
                    <form>
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          fullWidth
                          label="New password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            sx: {
                              fontWeight: 'bold',
                            },
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          fullWidth
                          label="Re-password"
                          type="password"
                          value={rePassword}
                          onChange={(e) => setRepassword(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            sx: {
                              fontWeight: 'bold',
                            },
                          }}
                        />
                      </div>

                      <Button
                        sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#D90E28' }, fontWeight: 'bold' }}
                        variant="contained"
                        onClick={handleSavePassword}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress color="inherit" size={24} /> : "Change password"}
                      </Button>
                    </form>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
}

export default MyAccount;
