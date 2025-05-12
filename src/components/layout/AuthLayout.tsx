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
    Tooltip,
    useTheme
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
    const theme = useTheme();
    const isRTL = theme.direction === 'rtl';

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
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    width: '100%',
                    ...(isRTL ? { right: 0 } : { left: 0 })
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ 
                            ...(isRTL ? { ml: 2 } : { mr: 2 }),
                            ...(isRTL ? { marginRight: 'auto' } : { marginLeft: 0 })
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            textAlign: isRTL ? 'right' : 'left',
                            marginRight: isRTL ? 2 : 0,
                            marginLeft: isRTL ? 0 : 2
                        }}
                    >
                        {getPageTitle()}
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }}>
                        <Tooltip title={currentLanguage === 'ar' ? t('common.switchToEnglish') : t('common.switchToArabic')}>
                            <IconButton color="inherit" onClick={toggleLanguage}>
                                <LanguageIcon />
                            </IconButton>
                        </Tooltip>
                        <Button 
                            color="inherit" 
                            onClick={handleLogout} 
                            startIcon={!isRTL ? <LogoutIcon /> : undefined}
                            endIcon={isRTL ? <LogoutIcon /> : undefined}
                        >
                            {t('common.logout')}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor={isRTL ? 'right' : 'left'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        width: 250,
                        ...(isRTL ? { right: 0 } : { left: 0 })
                    }
                }}
            >
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {menuItems.map((item) => (
                            <ListItem 
                                key={item.text}
                                onClick={() => {
                                    navigate(item.path);
                                    setDrawerOpen(false);
                                }}
                                selected={location.pathname === item.path}
                                sx={{
                                    flexDirection: isRTL ? 'row-reverse' : 'row',
                                    paddingRight: isRTL ? 2 : 3,
                                    paddingLeft: isRTL ? 3 : 2
                                }}
                            >
                                <ListItemIcon sx={{
                                    minWidth: 40,
                                    ...(isRTL && {
                                        marginLeft: '8px',
                                        marginRight: '-4px'
                                    })
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    sx={{
                                        textAlign: isRTL ? 'right' : 'left',
                                        margin: 0
                                    }}
                                />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem 
                            onClick={handleLogout}
                            sx={{
                                flexDirection: isRTL ? 'row-reverse' : 'row',
                                paddingRight: isRTL ? 2 : 3,
                                paddingLeft: isRTL ? 3 : 2
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                ...(isRTL && {
                                    marginLeft: '8px',
                                    marginRight: '-4px'
                                })
                            }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary={t('common.logout')}
                                sx={{
                                    textAlign: isRTL ? 'right' : 'left',
                                    margin: 0
                                }}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    mt: 8,
                    ...(isRTL ? { marginRight: 0 } : { marginLeft: 0 })
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AuthLayout;