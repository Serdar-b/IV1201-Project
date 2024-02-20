import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const navigateToApply = () => {
    navigate('/');
  }

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={navigateToApply} className="dashboard-button" >Apply Now</button>
    </div>
  );
};

export default Dashboard;
