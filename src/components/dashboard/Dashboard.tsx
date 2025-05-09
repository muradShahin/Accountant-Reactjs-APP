import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to Smart Accountant
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                        onClick={() => navigate('/transactions')}
                    >
                        <Typography variant="h5" gutterBottom>
                            Transactions
                        </Typography>
                        <Typography color="text.secondary" align="center">
                            Manage your business transactions, track income and expenses
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/transactions');
                            }}
                        >
                            Go to Transactions
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                        onClick={() => navigate('/hr')}
                    >
                        <Typography variant="h5" gutterBottom>
                            HR Management
                        </Typography>
                        <Typography color="text.secondary" align="center">
                            Manage employees, attendance, and payroll
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/hr');
                            }}
                        >
                            Go to HR
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;