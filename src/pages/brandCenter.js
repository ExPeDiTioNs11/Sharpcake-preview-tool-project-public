import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tabs,
    Tab
} from '@mui/material';
import NavbarLogined from '../components/NavbarLogined';
import { Delete, Archive } from '@mui/icons-material';
import black_button from '../styles/black_button';
import red_button from '../styles/red_button';
import './../styles/custom-fonts.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../disableConsole'

function BrandCenter() {
    localStorage.removeItem('brandLogoPath');
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [authorizedFullname, setAuthorizedFullname] = useState('');
    const [authorizedEmail, setAuthorizedEmail] = useState('');
    const [authorizedPhoneNumber, setAuthorizedPhoneNumber] = useState('');
    const [logo, setLogo] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteCompanyId, setDeleteCompanyId] = useState(null);
    const [archivedCompanies, setArchivedCompanies] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        const settings = {
            url: "https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/get-notArchive-customers",
            method: "GET",
            timeout: 0,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        };

        axios(settings)
            .then(response => {
                console.log(response.data.customers);
                setCompanies(response.data.customers);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        const archivedSettings = {
            url: "https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/get-archive",
            method: "GET",
            timeout: 0,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        };

        axios(archivedSettings)
            .then(response => {
                console.log(response.data);
                setArchivedCompanies(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching archived companies:', error);
            });
    }, []);

    const handleOpenDialog = (companyId) => {
        setDeleteCompanyId(companyId);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setDeleteCompanyId(null);
        setOpenDialog(false);
    }

    const handleDeleteCompany = () => {

        const accessToken = localStorage.getItem('accessToken');
        const settings = {
            url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/delete-customer/${deleteCompanyId}`,
            method: "DELETE",
            timeout: 0,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        };

        axios(settings)
            .then(response => {
                console.log(response);
                setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== deleteCompanyId));
                handleCloseDialog();
            })
            .catch(error => {
                console.error('Error deleting company:', error);
                handleCloseDialog();
            });

    }

    const handleArchiveCompany = (companyId) => {
        const accessToken = localStorage.getItem('accessToken');

        const settings = {
            url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/add-archive/${companyId}`,
            method: "PUT",
            timeout: 0,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        };

        axios(settings)
            .then(response => {
                console.log(response);
                console.log(`Şirket ID'si ${companyId} olan şirket arşivlendi.`);

                toast.success("Company archived.");
            })
            .catch(error => {
                console.error('Error archiving company:', error);
            });
    }

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    if (image.width !== 60 || image.height !== 40) {
                       // alert("Logo must be 60x40 pixels.");
                        toast.warning('Logo must be 60x40 pixels.')
                        // Gerekirse işlemi iptal edebilirsiniz.
                        setLogo(null);
                        return;
                    }
                    setLogo(reader.result);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCompany = async () => {

        try {
            // Adım 1: Logo Upload
            setLoading(true);
            const logoFormData = new FormData();
            logoFormData.append("file", fileInputRef.current.files[0]);

            const logoUploadSettings = {
                method: "POST",
                url: "https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/aws-uploadsystem-companyLogo",
                data: logoFormData,
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
            };

            const logoUploadResponse = await axios(logoUploadSettings);
            const imgPath = logoUploadResponse.data.file_url;

            // Adım 2: Create Customer
            const customerData = {
                fullname: authorizedFullname,
                phoneNumber: authorizedPhoneNumber,
                email: authorizedEmail,
                companyName: companyName,
                imgPath: imgPath,
            };

            const accessToken = localStorage.getItem('accessToken');

            const createCustomerSettings = {
                method: "POST",
                url: "https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/create-customer",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                data: JSON.stringify(customerData)
            };

            const createCustomerResponse = await axios(createCustomerSettings);

            console.log(createCustomerResponse.data);

            if (createCustomerResponse.data) {
                toast.success('Company added successfully!');
                setTimeout(() => {
                    window.location = "/create-preview"
                }, 2000);
            }
            else {
                toast.error('Adding company failed!');
            }
            // Brand Saved mesajını göster
            setLoading(false);
            // window.location.href = "/home";

        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    }

    const handleLogoDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogo(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleLogoDragOver = (event) => {
        event.preventDefault();
    }

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <div>
            <NavbarLogined />
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Add a new brand</Typography>
                                <TextField
                                    fullWidth
                                    label="Brand Name"
                                    variant="outlined"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <br />
                                <br />

                                {/* <TextField
                                    fullWidth
                                    label="Authorized fullname"
                                    variant="outlined"
                                    value={authorizedFullname}
                                    onChange={(e) => setAuthorizedFullname(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                /> */}

                              
                                <TextField
                                    fullWidth
                                    label="Authorized Email"
                                    variant="outlined"
                                    value={authorizedEmail}
                                    onChange={(e) => setAuthorizedEmail(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <br />
                                <br />
                                 
                                {/* <TextField
                                    fullWidth
                                    label="Authorized Phone Number"
                                    variant="outlined"
                                    value={authorizedPhoneNumber}
                                    onChange={(e) => setAuthorizedPhoneNumber(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                        startAdornment: '+90',
                                        inputProps: { maxLength: 13 }, // +90 dahil toplam 13 karakter sınırlaması
                                    }}
                                /> */}

                                <label htmlFor="logo-upload">
                                    <Button
                                        sx={{
                                            ...black_button,
                                            '&:hover': {
                                                backgroundColor: '#D90E28',
                                            },
                                            textTransform: 'none',
                                            mt: 2
                                        }}
                                        variant="contained"
                                        component="span"
                                    >
                                        Upload Brand Logo (60x40)
                                    </Button>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleLogoChange}
                                        ref={fileInputRef}
                                    />
                                </label>
                                <div
                                    onDrop={handleLogoDrop}
                                    onDragOver={handleLogoDragOver}
                                    style={{
                                        border: '2px dashed #cccccc',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        marginTop: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Drag & Drop
                                </div>
                                {logo && <Avatar src={logo} alt="Logo" sx={{ width: 56, height: 56, mt: 2 }} />}
                                <Button
                                    sx={{
                                        ...red_button,
                                        '&:hover': {
                                            backgroundColor: 'green',
                                        },
                                        textTransform: 'none',
                                        mt: 2
                                    }}
                                    variant="contained"
                                    onClick={handleAddCompany}
                                    disabled={loading} // 'loading' durumu true ise buton tıklanamaz
                                >
                                    {loading ? 'Loading...' : 'Save Brand'} {/* Yükleme sırasında 'Loading...', aksi halde 'Save Brand' göster */}
                                </Button>
                                <ToastContainer />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Brands</Typography>
                                <Tabs
                                    value={currentTab}
                                    onChange={handleChangeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                >
                                    <Tab label="Active Brands" />
                                    <Tab label="Archived Brands" />
                                </Tabs>
                                {currentTab === 0 && (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Brand Name</TableCell>
                                                    <TableCell>Transactions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {companies.map(company => (
                                                    <TableRow key={company.id}>
                                                        <TableCell>
                                                            <Avatar src={company.imgPath} alt="Logo" sx={{ width: 56, height: 56 }} />
                                                            <b> {company.companyName} </b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                startIcon={<Delete />}
                                                                onClick={() => handleOpenDialog(company._id)}
                                                                sx={{ ...red_button, '&:hover': { color: 'black' }, textTransform: 'none' }}
                                                            >
                                                                Delete
                                                            </Button>
                                                            {!company.archived && (
                                                                <Button
                                                                    sx={{ textTransform: 'none' }}
                                                                    startIcon={<Archive />}
                                                                    onClick={() => handleArchiveCompany(company._id)}
                                                                >
                                                                    Archive
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                                {currentTab === 1 && (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Brand Name</TableCell>
                                                    <TableCell>Transactions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {archivedCompanies.map(company => (
                                                    <TableRow key={company.id}>
                                                        <TableCell>
                                                            <Avatar src={company.imgPath} alt="Logo" sx={{ width: 56, height: 56 }} />
                                                            <b> {company.companyName} </b>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                startIcon={<Delete />}
                                                                onClick={() => handleOpenDialog(company._id)}
                                                                sx={{ ...red_button, '&:hover': { color: 'black' }, textTransform: 'none' }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this company?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDeleteCompany} variant="contained" sx={red_button}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BrandCenter;
