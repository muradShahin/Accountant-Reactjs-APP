import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import { balance } from '../../services/api';

const BalanceManagement: React.FC = () => {
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [newBalance, setNewBalance] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchBalance = async () => {
        try {
            const data = await balance.get();
            setCurrentBalance(data.balance);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch balance');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const amount = parseFloat(newBalance);
            if (isNaN(amount) || amount < 0) {
                setError('Please enter a valid positive number');
                return;
            }

            await balance.update(amount);
            setSuccess('Balance updated successfully');
            setNewBalance('');
            fetchBalance();
        } catch (error) {
            setError('Failed to update balance');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Balance Management
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Balance
                        </Typography>
                        <Typography variant="h3" color="primary">
                            ${currentBalance}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Update Balance
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="New Balance"
                                type="number"
                                value={newBalance}
                                onChange={(e) => setNewBalance(e.target.value)}
                                margin="normal"
                                required
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Update Balance
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                </Alert>
            )}
        </Container>
    );
};

export default BalanceManagement;