import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { balance } from '../../services/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TransactionsDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [companyBalance, setCompanyBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchBalance = async () => {
        try {
            const data = await balance.get();
            setCompanyBalance(data.balance);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleTransactionAdded = () => {
        fetchBalance();
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    {t('common.transactions')}
                </Typography>
                <Button
                    component={Link}
                    to="/transactions/all"
                    variant="outlined"
                    color="primary"
                >
                    {t('common.viewAllTransactions')}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            {t('common.companyBalance')}
                        </Typography>
                        <Typography component="p" variant="h4" sx={{ flexGrow: 1 }}>
                            {loading ? t('common.loading') : `$${companyBalance}`}
                        </Typography>
                        <Button
                            component={Link}
                            to="/balance"
                            size="small"
                            color="primary"
                        >
                            {t('common.manageBalance')}
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            {t('common.addTransaction')}
                        </Typography>
                        <TransactionForm onTransactionAdded={handleTransactionAdded} />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            {t('common.recentTransactions')}
                        </Typography>
                        <TransactionList limit={10} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TransactionsDashboard;