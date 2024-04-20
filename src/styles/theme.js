// themes.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiCheckbox: {
      defaultProps: {
        color: 'default', // Varsayılan rengi belirlemek için
      },
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#D90E28', // Seçildiğindeki rengi belirlemek için
          },
        },
      },
    },
  },

  
  
});

export default theme;
