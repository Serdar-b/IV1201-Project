import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
};

export default Dashboard;
