import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const navigateToApply = () => {
    navigate('/apply');
  }

  const navigateToAllApplications = () => {
    navigate('/all-applications');
  }

  if (!user) {
    return null;
  }

  if (user.role === 1) {
    // Recruiter view
    return (
      <div>
        <h1>Recruiter Dashboard</h1>
        {user && <p>Welcome, {user.name}!</p>}
        <button onClick={navigateToAllApplications} className ="dashboard-button"> View All Applications </button>
      </div>
    );
  } else if (user.role === 2) {
    // Applicant view
    return (
      <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={navigateToApply} className="dashboard-button" >Apply Now</button>
    </div>
    );
  }

  // Default return
  return <navigate to="/login" />;
};

export default Dashboard;
