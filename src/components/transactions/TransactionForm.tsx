import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { transactions } from '../../services/api';

interface TransactionFormProps {
    onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await transactions.create({
                amount: parseFloat(formData.amount),
                type: formData.type as 'income' | 'expense',
                description: formData.description,
                date: formData.date
            });
            setFormData({
                amount: '',
                type: 'expense',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            onTransactionAdded();
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    label="Type"
                    onChange={handleChange}
                >
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                </Select>
            </FormControl>
            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="date"
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Add Transaction
            </Button>
        </Box>
    );
};

export default TransactionForm;