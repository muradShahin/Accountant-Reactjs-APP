import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton
} from '@mui/material';
import { format } from 'date-fns';
import { transactions, Transaction } from '../../services/api';
import DeleteIcon from '@mui/icons-material/Delete';

interface TransactionListProps {
    limit?: number;
}

interface Filters {
    startDate: string;
    endDate: string;
    type: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ limit }) => {
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({
        startDate: '',
        endDate: '',
        type: ''
    });

    const fetchTransactions = async () => {
        try {
            const data = await transactions.getAll(filters);
            setTransactionList(limit ? data.slice(0, limit) : data);
            setError(null);
        } catch (err) {
            setError('Failed to load transactions');
            console.error('Error fetching transactions:', err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters, limit]);

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id: number) => {
        try {
            await transactions.delete(id);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box>
            {!limit && (
                <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={filters.type}
                            label="Type"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="HR">HR</MenuItem>
                            <MenuItem value="purchase">Purchase</MenuItem>
                            <MenuItem value="sales">Sales</MenuItem>
                            <MenuItem value="other_income">Other Income</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            {!limit && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionList.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    {transaction.type === 'HR' && transaction.employee_name
                                        ? `Employee: ${transaction.employee_name}`
                                        : transaction.company_name || '-'}
                                </TableCell>
                                <TableCell 
                                    align="right" 
                                    sx={{ 
                                        color: (transaction.type === 'HR' || transaction.type === 'purchase') 
                                            ? 'error.main' 
                                            : 'success.main'
                                    }}
                                >
                                    {(transaction.type === 'HR' || transaction.type === 'purchase') ? '-' : '+'}
                                    ${transaction.amount}
                                </TableCell>
                                {!limit && (
                                    <TableCell>
                                        <IconButton
                                            onClick={() => transaction.id && handleDelete(transaction.id)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {transactionList.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TransactionList;