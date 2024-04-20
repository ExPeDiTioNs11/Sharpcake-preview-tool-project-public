import React, { useState } from 'react';
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

export default function RoleSelect(props) {
  const theme = useTheme();
  const [personName, setPersonName] = useState('');
  const roles = ['Personel', 'Admin'];

  const handleChange = (event) => {
    const { value } = event.target;
    setPersonName(value);

    // Seçilen rolü ana bileşene iletiyoruz
    props.onRoleChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300, borderColor: 'black' }}>
        <InputLabel
          id="demo-multiple-chip-label"
          sx={{ fontWeight: 'bold', color: 'black' }}
        >
          Role
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
          {roles.map((role) => (
            <MenuItem
              key={role}
              value={role}
              style={getStyles(role, personName, theme)}
            >
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
