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
    Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Receipt as TransactionIcon,
    People as HRIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Transactions', icon: <TransactionIcon />, path: '/transactions' },
        { text: 'HR Management', icon: <HRIcon />, path: '/hr' }
    ];

    const getPageTitle = () => {
        const currentPath = location.pathname;
        const menuItem = menuItems.find(item => item.path === currentPath);
        return menuItem ? menuItem.text : 'Smart Accountant';
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {getPageTitle()}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setDrawerOpen(false)}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem 
                                button 
                                key={item.text}
                                onClick={() => navigate(item.path)}
                                selected={location.pathname === item.path}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
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
                    bgcolor: 'background.default'
                }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default AuthLayout;