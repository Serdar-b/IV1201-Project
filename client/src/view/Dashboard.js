import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


/**
 * Component for displaying the user dashboard.
 * @returns {React.ReactElement} The dashboard component.
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
