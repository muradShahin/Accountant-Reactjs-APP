import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TransactionList from './TransactionList';

const AllTransactions: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                All Transactions
            </Typography>
            <Box sx={{ mt: 3 }}>
                <TransactionList />
            </Box>
        </Container>
    );
};

export default AllTransactions;