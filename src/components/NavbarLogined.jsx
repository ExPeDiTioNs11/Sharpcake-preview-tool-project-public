import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import SvgIcon from '@mui/material/SvgIcon';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AssistantPhotoRoundedIcon from '@mui/icons-material/AssistantPhotoRounded';
import './../styles/custom-fonts.css';
import red_button from '../styles/red_button';
import transparent_button_whiteText from '../styles/transparent_button_whiteText';
import AccountMenu from './AccountMenu';
import logo from '../assets/images/logo.png';

function CompanyIcon(props) {
  return (
    <SvgIcon {...props}>
      <ApartmentRoundedIcon />
    </SvgIcon>
  );
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const AutoComplete = ({ searchTerm, brandNames }) => {
  const [showResults, setShowResults] = React.useState(true);

  const handleItemClick = () => {
    setShowResults(false);
  };

  const filteredBrandNames = brandNames.filter((brand) => {
    const companyName = brand?.subData?.companyName || '';
    const campaignName = brand?.subData?.campaignName || '';

    return (
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        backgroundColor: '#f8f8f8',
        border: '1px solid #ccc',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
      }}
      onMouseLeave={() => setShowResults(false)}
    >
      {showResults &&
        filteredBrandNames.map((brand) => (
          <Link
            key={brand.subData._id}
            to={`/campaign-detail/${brand.subData._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={handleItemClick}
          >
            <div
              style={{
                padding: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              {brand.subData.companyName}
              {brand.label === 'B' ? (
                <CompanyIcon
                  style={{
                    verticalAlign: 'middle',
                    width: '20px',
                    color: '#D90E28',
                    float: 'right',
                  }}
                />
              ) : (
                brand?.subData?.campaignName && ` ${brand.subData.campaignName}`
              )}
              {brand.label === 'C' && (
                <AssistantPhotoRoundedIcon
                  style={{
                    verticalAlign: 'middle',
                    width: '20px',
                    color: '#D90E28',
                    float: 'right',
                  }}
                />
              )}
              <span style={{ float: 'left' }}> ➡</span>
            </div>
          </Link>
        ))}
    </div>
  );
};


export default function SearchAppBar() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [brandNames, setBrandNames] = React.useState([]);
  const [showResults, setShowResults] = React.useState(true);

  const handleBlur = () => {
    setShowResults(false);
  }

  React.useEffect(() => {
    const settings = {
      "url": "https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/get-searched-data",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
      },
    };

    fetch(settings.url, settings)
      .then(response => response.json())
      .then(data => {
        setBrandNames(data.searchedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  React.useEffect(() => {
    const brandLogoPath = localStorage.getItem('brandLogoPath');
    const brandLogoElement = document.getElementById('brandLogoElement');

    if (brandLogoPath) {
      brandLogoElement.innerHTML = `<img src="${brandLogoPath}" style="width: 60px; height: 40px;" />`;
    } else {
      brandLogoElement.innerHTML = ``;
    }
  }, [localStorage.getItem('brandLogoPath')]);

  const permissions = localStorage.getItem('permissions');
  const shouldShowButton = permissions === '2';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <a href="/home"><img src={logo} alt="Logo" style={{ width: '200px', marginRight: '10px', marginTop: '10px' }} /></a>
            <span id='brandLogoElement' style={{ fontSize: '125%', marginLeft: '50px', fontWeight: 'bold' }}>
              {/* company logo buraya basılıyor */}
            </span>
          </Typography>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
            {showResults && searchTerm && <AutoComplete searchTerm={searchTerm} brandNames={brandNames} />}
          </Search>
          <Button
            to="/create-project"
            variant="contained"
            sx={{
              ...red_button,
              '&:hover': {
                backgroundColor: 'green',
              },
              ml: 2
            }}
          >
            <Link to="/create-preview" style={{ textDecoration: 'none', color: 'white' }}>Create Preview</Link>
          </Button>
          <Button
            variant="contained"
            sx={{
              ...transparent_button_whiteText,
              '&:hover': {
                backgroundColor: '#D90E28',
                border: '1px solid #D90E28',
              },
              ml: 2,
            }}
          >
            <Link to="/brand-center" style={{ textDecoration: 'none', color: 'white' }}>Brand Center</Link>
          </Button>
          {shouldShowButton && (
            <Button
              variant="contained"
              sx={{
                ...transparent_button_whiteText,
                '&:hover': {
                  backgroundColor: '#D90E28',
                  border: '1px solid #D90E28',
                },
                ml: 2,
              }}
            >
              <Link to="/staff-manage" style={{ textDecoration: 'none', color: 'white' }}>Staff Manage</Link>
            </Button>
          )}
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
