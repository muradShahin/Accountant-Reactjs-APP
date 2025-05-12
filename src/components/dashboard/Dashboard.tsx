import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {t("dashboard.welcome")}
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
                            {t('common.transactions')}
                        </Typography>
                        <Typography color="text.secondary" align="center">
                            {t("dashboard.transactions.description")}
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
                            {t("navigation.hrManagement")}
                        </Typography>
                        <Typography color="text.secondary" align="center">
                            {t("dashboard.hrManagement.description")}
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