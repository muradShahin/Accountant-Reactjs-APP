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
import { useTranslation } from 'react-i18next';

interface TransactionListProps {
    limit?: number;
}

interface Filters {
    startDate: string;
    endDate: string;
    type: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ limit }) => {
    const { t } = useTranslation();
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
                        label={t('common.startDate')}
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label={t('common.endDate')}
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>{t('common.type')}</InputLabel>
                        <Select
                            name="type"
                            value={filters.type}
                            label={t('common.type')}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">{t('common.all')}</MenuItem>
                            <MenuItem value="HR">{t('transactions.HR')}</MenuItem>
                            <MenuItem value="purchase">{t('transactions.purchase')}</MenuItem>
                            <MenuItem value="sales">{t('transactions.sales')}</MenuItem>
                            <MenuItem value="other_income">{t('transactions.other_income')}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('common.date')}</TableCell>
                            <TableCell>{t('common.type')}</TableCell>
                            <TableCell>{t('common.description')}</TableCell>
                            <TableCell>{t('common.details')}</TableCell>
                            <TableCell align="right">{t('common.amount')}</TableCell>
                            {!limit && <TableCell>{t('common.actions')}</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionList.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{t(`transactions.${transaction.transaction_type}`)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    {transaction.transaction_type === 'HR' && transaction.employee_name
                                        ? `${t('common.employee')}: ${transaction.employee_name}`
                                        : transaction.company_name || '-'}
                                </TableCell>
                                <TableCell 
                                    align="right" 
                                    sx={{ 
                                        color: (transaction.transaction_type === 'HR' || transaction.transaction_type === 'purchase') 
                                            ? 'error.main' 
                                            : 'success.main'
                                    }}
                                >
                                    {(transaction.transaction_type === 'HR' || transaction.transaction_type === 'purchase') ? '-' : '+'}
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
                                    {t('common.noTransactionsFound')}
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