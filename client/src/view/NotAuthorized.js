import React from 'react';
import { useTranslation } from 'react-i18next';

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
