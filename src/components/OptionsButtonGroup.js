import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { AdsClick, YouTube, ViewCarousel } from '@mui/icons-material';

function OptionsButtonGroup() {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (index) => {
    setSelectedButton(index);
  };

  const buttons = [
    { text: 'Upload Banner', icon: <AdsClick /> },
    { text: 'Upload Video', icon: <YouTube /> },
    { text: 'Upload Storyboard', icon: <ViewCarousel /> },
  ];

  return (
    <div className="button-group">
      {buttons.map((button, index) => (
        <Button
          className='optionButtons'
          key={index}
          onClick={() => handleButtonClick(index)}
          variant={selectedButton === index ? 'outlined' : 'contained'}
          style={{ backgroundColor: selectedButton === index ? 'red' : 'transparent' }}
        >
          {button.icon}
          {button.text}
        </Button>
      ))}
    </div>
  );
}

export default OptionsButtonGroup;
