import CircularProgress from '@mui/material/CircularProgress';

const LoadingAnimation = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress style={{ color: '#D90E28', width: '35px', height: '35px' }} />
    </div>
  );
};

export default LoadingAnimation;
