import React from 'react';
import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';

const TransactionsDashboard: React.FC = () => {
    const handleTransactionAdded = () => {
        // Refresh transaction list
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Transactions Management
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Add New Transaction
                        </Typography>
                        <TransactionForm onTransactionAdded={handleTransactionAdded} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Recent Transactions
                        </Typography>
                        <TransactionList />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TransactionsDashboard;