import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import CreatePreview from './pages/createPreview';
import MyAccount from './pages/myAccount';
import BrandCenter from './pages/brandCenter';
import CampaignDetail from './pages/campaignDetail';
import CampaignDetailCustomer from './pages/campaignDetailCustomer';
import StaffManage from './pages/staffManage';
import './styles/App.css';
import './styles/options.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/create-preview" element={<CreatePreview />} />
        <Route path="/brand-center" element={<BrandCenter />} />
        <Route path="/campaign-detail/:id" element={<CampaignDetail />} />
        <Route path="/share-link/:id" element={<CampaignDetailCustomer />} />
        <Route path="/staff-manage/" element={<StaffManage />} />
      </Routes>
    </Router>
  );
}

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

document.addEventListener('keydown', function (event) {
  if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
    event.preventDefault();
  }
});

export default App;
