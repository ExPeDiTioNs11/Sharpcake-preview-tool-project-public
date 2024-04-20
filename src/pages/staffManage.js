import React, { useState, useEffect } from 'react';
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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import NavbarLogined from '../components/NavbarLogined';
import { Delete, Edit } from '@mui/icons-material';
import red_button from '../styles/red_button';
import RoleSelect from '../components/staffPermissionSelect';
import './../styles/custom-fonts.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import black_button from '../styles/black_button'
import './../disableConsole'

function StaffManage() {
    localStorage.removeItem('brandLogoPath');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPermission, setSelectedPermission] = useState('');
    const [staff, setStaff] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteEmployeeID, setDeleteEmployeeID] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // update text
    const [nameUpdate, setNameUpdate] = useState('');
    const [surnameUpdate, setSurnameUpdate] = useState('');
    const [emailUpdate, setEmailUpdate] = useState('');
    const [phoneNumberUpdate, setPhoneNumberUpdate] = useState('');
    const [selectedRoleUpdate, setSelectedRoleUpdate] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        const fetchData = async () => {
            try {
                const response = await axios.get("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStaff(response.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleStaffPermissionChange = (staff) => {
        setSelectedPermission(staff);
    };

    const handleOpenDialog = (employeeID) => {
        setDeleteEmployeeID(employeeID);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setDeleteEmployeeID(null);
        setOpenDialog(false);
    };

    const returnDashboard = async () => {
        window.location.href = "/home"
    }

    const handleDeleteEmployee = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/delete-user/${deleteEmployeeID}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setStaff((prevEmployee) => prevEmployee.filter((employee) => employee._id !== deleteEmployeeID));
            handleCloseDialog();
        } catch (error) {
            console.error('Error deleting employee:', error);
            handleCloseDialog();
        }
    };

    const handleAddStaff = async () => {

        let permissionValue;
        if (selectedPermission === "Personel" || selectedPermission === "personel") {
            permissionValue = 1
        }
        else if (selectedPermission === "Admin" || selectedPermission === "admin"){
            permissionValue = 2
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post(
                'https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/register',
                {
                    name,
                    surname,
                    email,
                    permissions: permissionValue,
                    phoneNumber,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Yeni eklenen çalışanı listeye eklemek için güncelleme yapabilirsiniz.
            setStaff((prevStaff) => [...prevStaff, response.data]);
            // Daha sonra input değerlerini sıfırlayabilirsiniz.
            setName('');
            setSurname('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setSelectedPermission('');
            window.location.href = "/home"
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const generatePassword = () => {
        const randomPassword = Math.random().toString(36).slice(-8);
        setPassword(randomPassword);
    };


    // phone number format ve rakam sınırlandırması
    const handleChange = (e) => {
        // Telefon numarasının uzunluğunu kontrol ediyoruz
        if (e.target.value.length <= 10) {
            // Eğer uzunluk 11 karakter veya daha azsa, sadece girilen değeri ayarlıyoruz
            setPhoneNumber(e.target.value);
        } else if (e.target.value.startsWith('+90')) {
            // Eğer girilen değer "+90" ile başlıyorsa, başındaki "+90"ı kaldırıyoruz ve sadece 11 sonraki karakteri alıyoruz
            setPhoneNumber(e.target.value.slice(3, 14));
        } else {
            // Eğer girilen değer "+90" ile başlamıyorsa, maksimum 11 karakter alıyoruz
            setPhoneNumber(e.target.value.slice(0, 10));
        }

        let formattedNumber = e.target.value.replace(/\D/g, ''); // Sadece sayıları alıyoruz, diğer karakterleri kaldırıyoruz

        // İlk 3 karakteri alıyoruz
        let firstBlock = formattedNumber.slice(0, 3);
        // Sonraki 3 karakteri alıyoruz
        let secondBlock = formattedNumber.slice(3, 6);
        // Son 4 karakteri alıyoruz
        let thirdBlock = formattedNumber.slice(6, 10);
    
        // Telefon numarasını formatlıyoruz
        let formattedPhoneNumber = `${firstBlock} ${secondBlock} ${thirdBlock}`;
        
        // Ayırdığımız telefon numarasını state'e atıyoruz
        setPhoneNumber(formattedPhoneNumber);
    };

    // update worker
    const handleOpenUpdateModal = async (employee) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/get-by-id/${employee._id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();


            setNameUpdate(data.user.name);
            setSurnameUpdate(data.user.surname);
            setEmailUpdate(data.user.email);
            setPhoneNumberUpdate(data.user.phoneNumber);
            setSelectedRoleUpdate(data.user.permissions);
            sessionStorage.setItem('selectedEmployee', data.user._id)

            if (data.user.permissions === 1) {
                setSelectedRoleUpdate('personel');
            } else if (data.user.permissions === 2) {
                setSelectedRoleUpdate('admin');
            }

            setUpdateModalOpen(true);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };


    const handleCloseUpdateModal = () => {
        setSelectedEmployee(null);
        setUpdateModalOpen(false);
    };

    const handleUpdateEmployee = async () => {
        try {
            setSelectedRoleUpdate(selectedPermission)
            const accessToken = localStorage.getItem('accessToken');
            const selectedEmployeeSession = sessionStorage.getItem('selectedEmployee')

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Authorization", "Bearer " + accessToken);

            var urlencoded = new URLSearchParams();
            urlencoded.append("name", nameUpdate);
            urlencoded.append("surname", surnameUpdate);
            urlencoded.append("email", emailUpdate);
            urlencoded.append("phoneNumber", phoneNumberUpdate);
            urlencoded.append("permissions", selectedRoleUpdate);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/users/user-update/" + selectedEmployeeSession, requestOptions)
                .then(response => response.json())
                .then(result => {
                    window.location.reload();

                })
                .catch(error => console.log('error', error));


            // Yeni eklenen çalışanı listeye eklemek için güncelleme yapabilirsiniz.

            // Daha sonra input değerlerini sıfırlayabilirsiniz.
            setNameUpdate('');
            setSurnameUpdate('');
            setEmailUpdate('');
            setPhoneNumberUpdate('');
            setSelectedPermission('');
            handleCloseUpdateModal();
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };



    return (
        <div>
            <NavbarLogined />
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {selectedEmployee ? 'Update Employee' : 'Add a New Employee'}
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Employee Name"
                                    variant="outlined"
                                    value={name}
                                    type='text'
                                    onChange={(e) => setName(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <br />
                                <br />

                                <TextField
                                    fullWidth
                                    label="Employee Surname"
                                    variant="outlined"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />

                                <br />
                                <br />
                                <TextField
                                    fullWidth
                                    label="Employee Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <br />
                                <br />
                                <TextField
                                    fullWidth
                                    label="Employee Phone Number"
                                    variant="outlined"
                                    value={phoneNumber}
                                    onChange={handleChange}
                                    InputProps={{
                                        sx: {
                                            fontWeight: 'bold',
                                        },
                                        startAdornment: '+90',
                                        inputProps: { maxLength: 13 }, // +90 dahil toplam 13 karakter sınırlaması
                                    }}
                                />

                                <br />
                                <br />
                                {/* Diğer inputlar */}
                                {!selectedEmployee && (
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        variant="outlined"
                                        type="password"
                                        value={password}
                                        InputProps={{
                                            sx: {
                                                fontWeight: 'bold',
                                            },
                                        }}
                                        disabled
                                    />
                                )}
                                {!selectedEmployee && (
                                    <Button
                                        sx={{
                                            ...red_button,
                                            '&:hover': {
                                                backgroundColor: 'green',
                                            },
                                            textTransform: 'none',
                                            mt: 2,
                                        }}
                                        variant="contained"
                                        onClick={generatePassword}
                                        disabled={loading}
                                    >
                                        Generate Password
                                    </Button>
                                )}
                                <br />
                                <br />
                                {/* role select input */}
                                <RoleSelect onRoleChange={handleStaffPermissionChange} />
                                <Button
                                    sx={{
                                        ...red_button,
                                        '&:hover': {
                                            backgroundColor: 'green',
                                        },
                                        textTransform: 'none',
                                        mt: 2,
                                    }}
                                    variant="contained"
                                    onClick={selectedEmployee ? handleUpdateEmployee : handleAddStaff}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : selectedEmployee ? 'Update Employee' : 'Save Employee'}
                                </Button>

                                <Button
                                    sx={{
                                        ...black_button,
                                        '&:hover': {
                                            backgroundColor: 'green',
                                        },
                                        textTransform: 'none',
                                        mt: 2,
                                        ml: 2,
                                    }}
                                    variant="contained"
                                    onClick={returnDashboard}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Exit and Return to Dashboard'}
                                </Button>
                                <ToastContainer />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Staff
                                </Typography>
                                {/* Tablo */}
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Employee Fullname</TableCell>
                                                <TableCell>Employee Operations</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {staff.map((employee) => (
                                                <TableRow key={employee._id}>
                                                    <TableCell>
                                                        <b> {employee.name} </b>
                                                        <b> {employee.surname}</b>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            startIcon={<Delete />}
                                                            onClick={() => handleOpenDialog(employee._id)}
                                                            sx={{ ...red_button, '&:hover': { color: 'black' }, textTransform: 'none' }}
                                                        >
                                                            Delete
                                                        </Button>

                                                        <Button
                                                            startIcon={<Edit />}
                                                            onClick={() => handleOpenUpdateModal(employee)}
                                                            sx={{ ...black_button, '&:hover': { color: 'black' }, textTransform: 'none', ml: 2 }}
                                                        >
                                                            Update
                                                        </Button>

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            {/* Silme onayı için Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this employee?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDeleteEmployee} variant="contained" sx={red_button}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Update Modal */}
            <Dialog open={updateModalOpen} onClose={handleCloseUpdateModal}>
                <DialogTitle>Update Employee</DialogTitle>
                <DialogContent>
                    <br />
                    <TextField
                        fullWidth
                        label="Employee Name"
                        variant="outlined"
                        value={nameUpdate}
                        onChange={(e) => setNameUpdate(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        fullWidth
                        label="Employee Surname"
                        variant="outlined"
                        value={surnameUpdate}
                        onChange={(e) => setSurnameUpdate(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        fullWidth
                        label="Employee Email"
                        variant="outlined"
                        value={emailUpdate}
                        onChange={(e) => setEmailUpdate(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <br />
                    <br />
                    <TextField
                        fullWidth
                        label="Employee Phone Number"
                        variant="outlined"
                        value={phoneNumberUpdate}
                        onChange={(e) => setPhoneNumberUpdate(e.target.value)}
                        InputProps={{
                            sx: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <br />
                    <br />
                    <RoleSelect onRoleChange={handleStaffPermissionChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateModal}>Cancel</Button>
                    <Button onClick={handleUpdateEmployee} variant="contained" sx={red_button}>
                        Update Employee
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StaffManage;
