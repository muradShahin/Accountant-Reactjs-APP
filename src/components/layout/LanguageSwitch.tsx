import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Tooltip title={i18n.language === 'ar' ? 'English' : 'العربية'}>
      <IconButton 
        color="inherit" 
        onClick={toggleLanguage}
        sx={{ ml: 1 }}
      >
        <Language />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSwitch;
