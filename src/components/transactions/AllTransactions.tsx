import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TransactionList from './TransactionList';
import { useTranslation } from 'react-i18next';

const AllTransactions: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography  variant="h4" component="h1" gutterBottom>
                {t('common.allTransactions')}
            </Typography>
            <Box sx={{ mt: 3 }}>
                <TransactionList />
            </Box>
        </Container>
    );
};



export default AllTransactions;