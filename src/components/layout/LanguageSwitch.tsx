import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LanguageSwitch: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    try {
      await i18n.changeLanguage(newLang);
      document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      // Force a re-render by triggering a window resize event
      window.dispatchEvent(new Event('resize'));
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <Tooltip title={i18n.language === 'ar' ? t('common.switchToEnglish') : t('common.switchToArabic')}>
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
