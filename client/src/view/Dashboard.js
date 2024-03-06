import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard component for displaying either the recruiter's or applicant's dashboard based on the user's role.
 * If the user is a recruiter, they will see an option to view all applications.
 * If the user is an applicant, they will have the option to apply for a position.
 * The component also displays a personalized welcome message.
 * 
 * @component
 * @param {Object} user - The current authenticated user's information, including their role and name.
 * @returns {React.ReactElement} A React element that renders the dashboard with relevant options and welcome message. If no user is passed, it renders nothing.
 */
const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const dashboardTitle = user.role === 1 ? t("dashboard.recruiter_title") : t("dashboard.applicant_title");
  const welcomeMessage = t("dashboard.welcome", { name: user.name });

  return (
    <div>
      <h1>{dashboardTitle}</h1>
      <p>{welcomeMessage}</p>
      {user.role === 1 ? (
        <button onClick={navigateToAllApplications} className="dashboard-button">
          {t("dashboard.view_all_applications")}
        </button>
      ) : (
        <button onClick={navigateToApply} className="dashboard-button">
          {t("dashboard.apply_now")}
        </button>
      )}
    </div>
  );
};

export default Dashboard;
