import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component for displaying a not authorized message.
 * It informs the user that they do not have the necessary permissions to access a certain page or feature.
 * Utilizes the i18next library for internationalization to support multiple languages.
 *
 * @returns {React.ReactElement} Renders a message indicating that the user is not authorized.
 */
const NotAuthorized = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t("not_authorized.title")}</h1>
            <p>{t("not_authorized.message")}</p>
        </div>
    );
};

export default NotAuthorized;
