import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h3" gutterBottom>
                    Welcome to Smart Accountant
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Manage your business finances efficiently
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ mr: 2 }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;