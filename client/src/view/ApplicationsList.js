// ApplicationsList.js
import React, { useState } from 'react';
import './ApplicationsList.css';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const ApplicationsList = ({
  applications,
  error,
  competences,
  onSearchTermChange,
  onCompetenceChange,
  onUpdateStatus
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);

  const applicationsPerPage = 10;

  // Calculate the current applications to display
  const indexOfLastApplication = (currentPage + 1) * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

  // Calculate total pages
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  // Change page handler
  const paginate = (direction) => {
    setCurrentPage(prevPage => Math.max(0, Math.min(prevPage + direction, totalPages - 1)));
  };

  const handleStatusChange = (status, person_id) => {
    onUpdateStatus(status.value, person_id)
  };
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '5px' };
      case 'rejected':
        return { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' };
      case 'unhandled':
        return { backgroundColor: 'darkgrey', color: 'white', padding: '5px', borderRadius: '5px' };
      default:
        return {};
    }
  };

  const translateCompetences = (competencesString) => {
    if (!competencesString || competencesString === "none") {   
      return t("database.no_competences");
    }
  
    const competencesArray = competencesString.split(', ');
  
    const translatedCompetences = competencesArray.map(competence => {
      const parts = competence.split(' (');
      const competenceName = parts[0];
      let years = parts[1];
  
      if (years) {
        years = years.slice(0, -6);
        const translatedYears = t('database.years');
        years = `${years} ${translatedYears})`;
      }
  
      const translatedName = t(`database.${competenceName}`);
      return `${translatedName} (${years}`;
    });
  
    return translatedCompetences.join(', ');
  };
  
  const translateAvailability = (availabilityString) => {
    const periodsArray = availabilityString.split('; ');
  
    const translatedPeriods = periodsArray.map(period => {
      return period.replace(' to ', ` ${t('database.to')} `);
    });
  
    return translatedPeriods.join('; ');
  };

  return (
    <div className="applications-list">
      <h2>{t('applications_list.all_applications')}</h2>
      <input
        type="text"
        placeholder={t('applications_list.search_by_name')}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="search-input"
      />
      <Select
        isMulti
        name="competences"
        options={competences.map(comp => ({ value: comp.name, label: comp.name }))}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={onCompetenceChange}
      />

      {error && <div>An error occurred: {error}</div>}

      <div className="applications-container">
        {currentApplications.length > 0 ? (
          currentApplications.map((app) => (
            <div className="application-card" key={app.person_id}>
              <div><strong>{t('applications_list.applicant')}:</strong> {app.name} {app.surname}</div>
              <div>  <strong>{t('applications_list.competences')}:</strong> {translateCompetences(app.competences_with_experience)}</div>
              <div><strong>{t('applications_list.availability')}:</strong> {translateAvailability(app.availability_periods)}</div>
              <div style={getStatusStyle(app.status)}>
                <strong>{t('applications_list.status')}:</strong> {app.status ?  t(`database.${app.status}`) : t('database.unknown')}
              </div>
              <Select
                name="status"
                options={[
                  { value: 'unhandled', label: t(`database.unhandled`) },
                  { value: 'accepted', label: t(`database.accepted`) },
                  { value: 'rejected', label: t(`database.rejected`) }
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) => handleStatusChange(selectedOption, app.person_id, app.competence_id)}
                value={app.status ? { value: app.status, label: t(`database.${app.status}`) } : null}
              />
            </div>
          ))
        ) : (
          <div>{t('applications_list.no_applications_found')}</div>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => paginate(-1)} disabled={currentPage <= 0}>{t('applications_list.left')}</button>
        <span>{t("applications_list.page")} {currentPage + 1} {t("applications_list.of")} {totalPages}</span>
        <button onClick={() => paginate(1)} disabled={currentPage >= totalPages - 1}>{t('applications_list.right')}</button>
      </div>
    </div>
  );
};

export default ApplicationsList;
