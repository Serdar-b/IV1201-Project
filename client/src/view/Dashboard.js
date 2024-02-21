import React from 'react';
import { useNavigate } from 'react-router-dom';


/**
 * Component for displaying the user dashboard.
 * @returns {React.ReactElement} The dashboard component.
 */

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  //Navigates to the apply page
  const navigateToApply = () => {
    navigate('/apply');
  }

  const navigateToAllApplications = () => {
    navigate('/applications');
  }

  if (!user) {
    return null;
  }

  if (user.role === 1) {
    // Recruiter view
    return (
      <div>
        <h1>Recruiter Dashboard</h1>
        {<p>Welcome, {user.name}!</p>}
        <button onClick={navigateToAllApplications} className ="dashboard-button"> View All Applications </button>
      </div>
    );
  } else if (user.role === 2) {
    // Applicant view
    return (
      <div>
      <h1>Dashboard</h1>
      {<p>Welcome, {user.name}!</p>}
      <button onClick={navigateToApply} className="dashboard-button" >Apply Now</button>
    </div>
    );
  }

  // Default return
  return <navigate to="/login" />;
};

export default Dashboard;
