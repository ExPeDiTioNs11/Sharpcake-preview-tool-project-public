import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from './../assets/images/unfavorite.png';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UpdateCampaignModal from './UpdateCampaignModal';
import UpdateIcon from '@mui/icons-material/Update';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function createData(campaignName, brand_id, createdAt, _id) {
  return {
    campaignName,
    brand_id,
    createdAt,
    _id,
  };
}

const headCells = [
  {
    id: 'campaignName',
    numeric: false,
    disablePadding: true,
    label: 'CAMPAIGN NAME',
  },
  {
    id: 'brand_id',
    numeric: true,
    disablePadding: false,
    label: 'BRAND',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'CREATED DATE',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'ACTIONS',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };



  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all campaigns',
            }}
            sx={{
              borderBottom: 'none',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              borderBottom: 'none',
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, searchTerm, onSearch } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          All campaigns
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">

        </Tooltip>
      ) : (
        <Tooltip title="Filter list">

        </Tooltip>
      )}
      {/* 
<TextField
        label="Search campaign or brand"
        variant="standard"
        value={searchTerm}
        onChange={onSearch}
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: '0',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
          },
        }}
      /> */}

    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default function FavoritesEnhancedTable() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Başlangıçta başarılı olarak ayarla
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/get-notFavorite-campaign', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const formattedData = response.data.data.map((campaign) => createData(
          campaign.campaignName,
          campaign.brand_id,
          new Date(campaign.createdAt).toLocaleDateString('tr-TR'),
          campaign._id
        ));
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).filter(row =>
        row.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.brand_id.toLowerCase().includes(searchTerm.toLowerCase()) // Eklenen satır
      ).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows, searchTerm],
  );

  const handleDeleteClick = (campaign_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");

    if (confirmDelete) {
      const accessToken = localStorage.getItem('accessToken');

      axios.delete(`https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/delete-campaign/${campaign_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          console.log(response);

          // Silinen kampanyayı state'ten kaldır
          setRows(prevRows => prevRows.filter(row => row._id !== campaign_id));
        })
        .catch(error => {
          console.error('Error deleting campaign:', error);
        });
    }
  };

  const handleAddToFavorites = (campaign_id) => {
    const accessToken = localStorage.getItem('accessToken');

    const settings = {
      url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/add-favorite/${campaign_id}`,
      method: 'PUT',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios(settings)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error adding to favorites:', error);
      });
  };

  const handleUpdateCampaign = (campaignId, newCampaignName) => {
    if (newCampaignName == '' || newCampaignName == ' ' || newCampaignName == null) {
      setSnackbarSeverity('warning'); // Uyarı durumu için sarı arka plan
      setSnackbarMessage('Campaign name cannot be left blank!');
      setSnackbarOpen(true);
    }
    else{
      const accessToken = localStorage.getItem('accessToken');
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", "Bearer " + accessToken);
  
      const urlencoded = new URLSearchParams();
      urlencoded.append("campaignName", newCampaignName);
  
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
      };
  
      fetch("https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/update-campaign/" + campaignId, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success = true) {
            setSnackbarSeverity('success'); // Başarılı durum için yeşil arka plan
            setSnackbarMessage('Campaign successfully updated!');
            setSnackbarOpen(true);
            setTimeout(() => {
              window.location.reload();
            }, 3000); // 3 saniye gecikme
          }
          else{
            setSnackbarSeverity('error'); // Başarısız durum için kırmızı arka plan
            setSnackbarMessage('Update error');
            setSnackbarOpen(true);
          }
           
        })
        .catch((error) => {
          console.error(error);
          setSnackbarSeverity('error'); // Başarısız durum için kırmızı arka plan
          setSnackbarMessage('An error occurred while updating campaign');
          setSnackbarOpen(true);
        });
    }
    
    
     
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);
  return (
    <div>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // 6 saniye sonra otomatik olarak kapanacak
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Sağ üst köşede görünecek
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, bgcolor: '#F9F9F9' }}>
        <EnhancedTableToolbar numSelected={selected.length} searchTerm={searchTerm} onSearch={(e) => setSearchTerm(e.target.value)} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750, '& tbody tr': { borderBottom: 'none', }, '& tbody td': { borderBottom: 'none', } }}
            aria-labelledby="tableTitle"
          // size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" sx={{ borderBottom: 'none', }}>
                      <Checkbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId, }} />
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{ borderBottom: 'none', }}
                    >
                      <IconButton onClick={() => handleAddToFavorites(row._id)}>
                        <img src={StarIcon} alt="Favorite" style={{ width: '20px', height: '20px' }} />
                      </IconButton>
                      <Link style={{ color: 'black', textDecoration: 'none' }} to={`/campaign-detail/${row._id}`}>
                        {row.campaignName}  <ArrowForwardIcon style={{ fontSize: 17, color: '#414141', verticalAlign: 'middle' }} />
                      </Link>
                    </TableCell>
                    <TableCell align="right">{row.brand_id}</TableCell>
                    <TableCell align="right">{row.createdAt}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteClick(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton>
                        <UpdateCampaignModal campaignId={row._id} campaignName={row.campaignName} onUpdate={handleUpdateCampaign} />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    // height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
    
    </div>
  );
 
   
}
