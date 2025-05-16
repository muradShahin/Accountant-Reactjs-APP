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
    IconButton,
    Pagination,
    Stack
} from '@mui/material';
import { format } from 'date-fns';
import { transactions, Transaction, PaginationInfo } from '../../services/api';
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
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [filters, setFilters] = useState<Filters>({
        startDate: '',
        endDate: '',
        type: ''
    });

    const fetchTransactions = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await transactions.getAll({
                page,
                limit: pagination.pageSize,
                ...filters
            });
            setTransactionList(response.data);
            setPagination(response.pagination);
            setError(null);
        } catch (err) {
            setError('Failed to load transactions');
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        fetchTransactions(page);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name as string]: value
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
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    type="date"
                    name="startDate"
                    label={t('common.startDate')}
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="date"
                    name="endDate"
                    label={t('common.endDate')}
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>{t('common.type')}</InputLabel>
                    <Select
                        name="type"
                        value={filters.type}
                        label={t('common.type')}
                        onChange={handleFilterChange as (event: SelectChangeEvent<string>) => void}
                    >
                        <MenuItem value="">{t('common.all')}</MenuItem>
                        <MenuItem value="salary">{t('transactions.HR')}</MenuItem>
                        <MenuItem value="purchase">{t('transactions.purchase')}</MenuItem>
                        <MenuItem value="sales">{t('transactions.sales')}</MenuItem>
                        <MenuItem value="deduction">{t('transactions.deduction')}</MenuItem>
                        <MenuItem value="income">{t('transactions.income')}</MenuItem>
                        <MenuItem value="expense">{t('transactions.expense')}</MenuItem>
                        <MenuItem value="other_income">{t('transactions.other_income')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('common.date')}</TableCell>
                            <TableCell>{t('common.type')}</TableCell>
                            <TableCell>{t('common.description')}</TableCell>
                            <TableCell>{t('common.amount')}</TableCell>
                            <TableCell>{t('common.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionList.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{format(new Date(transaction.date), 'yyyy-MM-dd')}</TableCell>
                                <TableCell>{t(`transactions.${transaction.transaction_type}`)}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => handleDelete(transaction.id!)}
                                        color="error"
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Stack spacing={2}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        disabled={loading}
                    />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        {t('common.total')}: {pagination.totalRecords} {t('common.transactions')}
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
};

export default TransactionList;