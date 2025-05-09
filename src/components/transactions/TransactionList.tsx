import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { transactions, Transaction } from '../../services/api';

const TransactionList: React.FC = () => {
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactions.getAll();
                setTransactionList(data);
                setError(null);
            } catch (err) {
                setError('Failed to load transactions');
                console.error('Error fetching transactions:', err);
            }
        };

        fetchTransactions();
    }, []);

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactionList.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </TableCell>
                            <TableCell align="right" sx={{ 
                                color: transaction.type === 'expense' ? 'error.main' : 'success.main'
                            }}>
                                {transaction.type === 'expense' ? '-' : '+'}$
                                {transaction.amount.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {transactionList.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No transactions found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionList;