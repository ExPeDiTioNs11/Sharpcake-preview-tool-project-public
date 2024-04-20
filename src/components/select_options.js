import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, personName, theme) => ({
  fontWeight:
    personName.indexOf(name) === -1
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
});

export default function MultipleSelectChip(props) {
  const theme = useTheme();
  const [personName, setPersonName] = useState('');
  const [names, setNames] = useState([]);
  const [brands, setBrands] = useState([]);


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      fetch('https://sharpcakepreviewproject-b590a1ae7543.herokuapp.com/api/customers/get-brand-names', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log("Brand names:", data.brandNames.map(brandNames => brandNames.companyName));
          setBrands(data.brandNames);
          setNames(data.brandNames.map(brandNames => brandNames.companyName) || []);
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setPersonName(value);

    // Seçilen kategoriyi ana bileşene iletiyoruz
    props.onCategoriesChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, borderColor: 'black' }}>
        <InputLabel
          id="demo-multiple-chip-label"
          sx={{ fontWeight: 'bold', color: 'black' }}
        >
          BRAND
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected && <Chip key={selected} label={selected} />}
            </Box>
          )}
          MenuProps={MenuProps}
          sx={{ borderColor: 'black' }}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>

      </FormControl>
    </div>
  );
}
