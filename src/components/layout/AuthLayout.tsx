import React from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Receipt as TransactionIcon,
    People as HRIcon,
    Logout as LogoutIcon,
    Language as LanguageIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
    children: React.ReactNode;
    toggleLanguage: () => void;
    currentLanguage: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, toggleLanguage, currentLanguage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
        { text: t('navigation.transactions'), icon: <TransactionIcon />, path: '/transactions' },
        { text: t('navigation.hrManagement'), icon: <HRIcon />, path: '/hr-dashboard' }
    ];

    const getPageTitle = () => {
        const currentPath = location.pathname;
        const menuItem = menuItems.find(item => item.path === currentPath);
        return menuItem ? menuItem.text : t('common.smartAccountant');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>
                    <Tooltip title={currentLanguage === 'ar' ? t('common.switchToEnglish') : t('common.switchToArabic')}>
                        <IconButton color="inherit" onClick={toggleLanguage}>
                            <LanguageIcon />
                        </IconButton>
                    </Tooltip>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        {t('common.logout')}
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.text}
                                onClick={() => {
                                    navigate(item.path);
                                    setDrawerOpen(false);
                                }}
                                selected={location.pathname === item.path}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={t('common.logout')} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {children}
            </Box>
        </Box>
    );
};

export default AuthLayout;