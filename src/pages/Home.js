import React from 'react';
import NavbarLogined from '../components/NavbarLogined';
import EnhancedTable from './../components/all_table';
import FavoritesEnhancedTable from './../components/favorites_table';
// import MultipleSelectChip from './../components/select_options';
// import BasicDatePicker from './../components/date_picker';
import Container from '@mui/material/Container';
import './../styles/custom-fonts.css';
import './../disableConsole'
const Home = () => {
  
  localStorage.removeItem('brandLogoPath');
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    return (
      <div>
        <NavbarLogined />
        <Container maxWidth="md" sx={{marginTop: "50px"}}>
          {/* <div>
            <h2>Filter</h2>
            <div className='headArea'>
              <MultipleSelectChip />
              <BasicDatePicker />
            </div>
          </div> */}
          <FavoritesEnhancedTable />
          <br />
          <br />
          <EnhancedTable />
        </Container>
      </div>
    );
  }
  else {
      window.location.href = "/"
  }


};

export default Home;

