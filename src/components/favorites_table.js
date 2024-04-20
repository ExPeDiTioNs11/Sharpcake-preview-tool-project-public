import React, { useState, useEffect } from 'react';
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
// import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import discardFavorite from './../assets/images/favorite.png';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
    _id
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
    id: 'brand',
    numeric: true,
    disablePadding: false,
    label: 'BRAND',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'CREATED DATE',
  }
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
          Favorites
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">

        </Tooltip>
      )}
      {/* <TextField
        label="Search campaign name"
        variant="standard"
        value={searchTerm} // Bu kısım ekleniyor
        onChange={onSearch} // Bu kısım ekleniyor
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

function FavoritesEnhancedTable() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Yeni eklenen state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/get-favorite/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.data.data.campaignName === "favorites are empty") {
          setLoading(false);
        }
        const formattedData = response.data.data.map((campaign) => createData(
          campaign.campaignName,
          campaign.brand_id,
          new Date(campaign.createdAt).toLocaleDateString('tr-TR'),
          campaign._id
        ));
        
        setRows(formattedData);
        setLoading(false); // Veri yüklendikten sonra loading durumunu false yap
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
      const newSelected = visibleRows.map((row) => row._id);
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
    //window.location.href = `/campaign-detail/${_id}`;
  };

  const handleCampaignNameClick = (event, _id) => {
    // Campaign name'e tıklandığında, ilgili kampanyanın detay sayfasına yönlendir
    window.location.href = `/campaign-detail/${_id}`;
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

    const visibleRows = React.useMemo(() => {
      return stableSort(rows, getComparator(order, orderBy)).filter((row) => {
        const campaignName = row.campaignName ? row.campaignName.toLowerCase() : '';
        const brandId = row.brand_id ? row.brand_id.toLowerCase() : '';
        const campaignNameMatch = campaignName.includes(searchTerm);
        const brandMatch = brandId.includes(searchTerm);
        return campaignNameMatch || brandMatch;
      }).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
    }, [order, orderBy, page, rowsPerPage, rows, searchTerm]);
  

  const filteredRows = visibleRows.filter(row =>
    row.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeFromFavorites = (campaign_id) => {
    const accessToken = localStorage.getItem('accessToken');

    const settings = {
      url: `https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/campaign/exract-favorite/${campaign_id}`,
      method: 'PUT',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios(settings)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error removing from favorites:', error);
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, bgcolor: '#F9F9F9' }}>
         
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
              '& tbody tr': {
                borderBottom: 'none',
              },
              '& tbody td': {
                borderBottom: 'none',
              }
            }}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center">
                    <CircularProgress sx={{ color: '#D90E28' }} />
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, index) => {
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
                      <TableCell padding="checkbox" sx={{
                        borderBottom: 'none',
                      }}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{
                          borderBottom: 'none',
                          cursor: 'pointer', // Burada campaignName'e tıklanabilirlik özelliği ekliyoruz
                        }}
                       
                      >
                        <IconButton onClick={() => removeFromFavorites(row._id)}>
                        <img src={discardFavorite} alt="Favorite" style={{width: '20px', height:'20px'}} /> 
                        </IconButton>
                        <Link style={{color: 'black', textDecoration: 'none'}} to={`/campaign-detail/${row._id}`}>
                        {row.campaignName}  <ArrowForwardIcon style={{fontSize: 17, color: '#414141', verticalAlign: 'middle' }} />
                        </Link>
                      </TableCell>
                      <TableCell align="right">{row.brand_id}</TableCell>
                      <TableCell align="right">{row.createdAt}</TableCell>
                      <TableCell align="right">
                        
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    // height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={headCells.length + 1} />
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
  );
}

export default FavoritesEnhancedTable;
