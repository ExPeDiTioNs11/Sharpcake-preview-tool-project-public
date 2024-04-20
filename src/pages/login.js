import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import black_button from '../styles/black_button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import './../disableConsole'

const Login = ({ setUserIsAuthenticated }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [buttonText, setButtonText] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Sayfa yüklendiğinde hatırla seçeneğini kontrol et
    useEffect(() => {
        const storedEmail = localStorage.getItem('rememberedEmail');
        const storedPassword = localStorage.getItem('rememberedPassword');
        if (storedEmail && storedPassword) {
            const login = async () => {
                try {
                    const response = await axios.post('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/login', {
                        email: storedEmail,
                        password: storedPassword,
                    });



                    if (response.data.success === true) {
                        if (rememberMe) {
                            // Eğer "Remember Me" işareti işaretli ise, e-postayı localStorage'e kaydet
                            localStorage.setItem('rememberedEmail', email);
                            localStorage.setItem('rememberedPassword', password);


                        } else {
                            // Değilse, localStorage'deki e-postayı temizle
                            localStorage.removeItem('rememberedEmail');
                            localStorage.removeItem('rememberedPassword');
                        }

                        localStorage.setItem('accessToken', response.data.user.token);
                        localStorage.setItem('user_id', response.data.user._id);
                        localStorage.setItem('user_fullname', response.data.user.name, " ", response.data.user.surname);
                        localStorage.setItem('permissions', response.data.user.permissions);
                        window.location.href = '/home'; // /home sayfasına yönlendir
                    } else {
                        setButtonText('Re-Login');
                        setLoginError(true);

                    }
                } catch (error) {
                    setButtonText('Re-Login');
                    setLoginError(true);

                }

                setLoading(false);
                setRememberMe(true);
            }

            login();
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setLoginError(false);
        setButtonText('Login');

        try {
            const response = await axios.post('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/login', {
                email: email,
                password: password,
            });

            if (response.data.success === true) {
                if (rememberMe) {
                    // Eğer "Remember Me" işareti işaretli ise, e-postayı localStorage'e kaydet
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', password);


                } else {
                    // Değilse, localStorage'deki e-postayı temizle
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }

                localStorage.setItem('accessToken', response.data.user.token);
                localStorage.setItem('user_id', response.data.user._id);
                localStorage.setItem('user_imgPath', response.data.user.imgPath);
                localStorage.setItem('permissions', response.data.user.permissions);
                window.location.href = '/home'; // /home sayfasına yönlendir
            } else {
                setButtonText('Re-Login');
                setLoginError(true);
            }
        } catch (error) {
            setButtonText('Re-Login');
            setLoginError(true);
        }

        setLoading(false);
    };

    return (
        <div>
            <Navbar />
            <div className="center-content">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="E-mail address"
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                                width: '350px'
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                                width: '350px'
                            },
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginRight: '40%' }}>
                        <FormControlLabel
                            control={<Checkbox sx={{ color: 'black' }} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                            label="Remember Me"
                        />
                        <Link to="/forgot-password" style={{ color: 'black' }}>Forgot Password?</Link>
                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            ...black_button,
                            width: '350px',
                            '&:hover': {
                                backgroundColor: '#D90E28',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : buttonText}
                    </Button>
                </form>
                {loginError && <p style={{ color: 'red' }}>Login failed. Please check your credentials.</p>}
            </div>
        </div>
    );
};

export default Login;
