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
    InputLabel,
    TablePagination
} from '@mui/material';
import { format } from 'date-fns';
import { employees, PaginationInfo, EmployeeTransaction } from '../../services/api';
import { SelectChangeEvent } from '@mui/material/Select';

interface EmployeeTransactionsProps {
    employeeId: number;
    onTransactionAdded: () => void;
}

const EmployeeTransactions = ({ employeeId, onTransactionAdded }: EmployeeTransactionsProps) => {
    const [transactions, setTransactions] = useState<EmployeeTransaction[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'salary' as 'salary' | 'bonus' | 'deduction' | 'advance',
        amount: '',
        description: ''
    });

    const loadTransactions = async (page: number = 1, limit: number = 10) => {
        try {
            const response = await employees.getTransactions(employeeId, { page, limit });
            if (response.data && Array.isArray(response.data)) {
                setTransactions(response.data);
                setPagination(response.pagination);
            } else {
                console.error('Unexpected API response format');
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            setTransactions([]);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, [employeeId]);

    const handlePageChange = (
        _event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        loadTransactions(newPage + 1, pagination.pageSize);
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newLimit = parseInt(event.target.value, 10);
        loadTransactions(1, newLimit);
    };

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
            loadTransactions(pagination.currentPage, pagination.pageSize);
            onTransactionAdded();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                type: 'salary',
                amount: '',
                description: ''
            });
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
                        {transactions && transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>{transaction.transaction_type}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell align="right" sx={{
                                        color: transaction.transaction_type === 'deduction' || transaction.transaction_type === 'salary'  ? 'error.main' : 'success.main'
                                    }}>
                                        {transaction.transaction_type === 'deduction' || transaction.transaction_type === 'salary'? '-' : '+'}${transaction.amount}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={pagination.totalRecords}
                    page={pagination.currentPage - 1}
                    onPageChange={handlePageChange}
                    rowsPerPage={pagination.pageSize}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
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