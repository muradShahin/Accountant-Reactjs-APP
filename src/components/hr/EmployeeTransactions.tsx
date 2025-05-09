import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { format } from 'date-fns';
import { employees } from '../../services/api';
import { SelectChangeEvent } from '@mui/material/Select';

interface EmployeeTransactionsProps {
    employeeId: number;
    onTransactionAdded: () => void;
}

interface Transaction {
    id: number;
    date: string;
    type: 'salary' | 'bonus' | 'deduction' | 'advance';
    amount: number;
    description: string;
}

const EmployeeTransactions = ({ employeeId, onTransactionAdded }: EmployeeTransactionsProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'salary' as 'salary' | 'bonus' | 'deduction' | 'advance',
        amount: '',
        description: ''
    });

    const loadTransactions = async () => {
        try {
            const response = await employees.getTransactions(employeeId);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [employeeId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await employees.addTransaction(employeeId, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            setShowAddDialog(false);
            loadTransactions();
            onTransactionAdded();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Employee Transactions</Typography>
                <Button
                    variant="contained"
                    onClick={() => setShowAddDialog(true)}
                >
                    Add Transaction
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell align="right" sx={{
                                    color: transaction.type === 'deduction' ? 'error.main' : 'success.main'
                                }}>
                                    {transaction.type === 'deduction' ? '-' : '+'}${transaction.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Transaction Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={formData.type}
                                        label="Type"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="salary">Salary</MenuItem>
                                        <MenuItem value="bonus">Bonus</MenuItem>
                                        <MenuItem value="deduction">Deduction</MenuItem>
                                        <MenuItem value="advance">Advance</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    inputProps={{ step: "0.01" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={2}
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Add Transaction</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default EmployeeTransactions;