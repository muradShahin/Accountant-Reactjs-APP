import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import { transactions, employees, Transaction } from '../../services/api';

interface TransactionFormProps {
    onTransactionAdded: () => void;
}

interface Employee {
    id: number;
    name: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
        amount: 0,
        type: 'salary',
        transaction_type: 'salary',
        description: '',
        date: new Date().toISOString().split('T')[0],
        company_name: '',
        employee_id: undefined
    });

    const [employeesList, setEmployeesList] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employees.getAll();
                setEmployeesList(data);
            } catch (error) {
                console.error('Failed to fetch employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await transactions.create({
                ...formData,
                amount: Number(formData.amount)
            });
            setFormData({
                amount: 0,
                type: 'salary',
                transaction_type: 'salary',
                description: '',
                date: new Date().toISOString().split('T')[0],
                company_name: '',
                employee_id: undefined
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
        if (name === 'employee_id') {
            setFormData(prev => ({
                ...prev,
                [name]: value ? Number(value) : undefined
            }));
        } else if (name === 'type') {
            setFormData(prev => ({
                ...prev,
                type: value as Transaction['type'],
                transaction_type: value as Transaction['transaction_type']
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="date"
                label={t('common.date')}
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="amount"
                label={t('common.amount')}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="type-label">{t('common.type')}</InputLabel>
                <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    label={t('common.type')}
                    onChange={handleChange as (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void}
                >
                     <MenuItem value="deduction">{t('transactions.deduction')}</MenuItem>
                    <MenuItem value="income">{t('transactions.income')}</MenuItem>
                    <MenuItem value="expense">{t('transactions.expense')}</MenuItem>
                    <MenuItem value="salary">{t('transactions.salary')}</MenuItem>
                    <MenuItem value="purchase">{t('transactions.purchase')}</MenuItem>
                    <MenuItem value="sales">{t('transactions.sales')}</MenuItem>
                    <MenuItem value="other_income">{t('transactions.other_income')}</MenuItem>
                </Select>
            </FormControl>

            {formData.type === 'salary' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel id="employee-label">{t('common.employee')}</InputLabel>
                    <Select
                        labelId="employee-label"
                        id="employee_id"
                        name="employee_id"
                        value={formData.employee_id?.toString() || ''}
                        label={t('common.employee')}
                        onChange={handleChange as (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void}
                        required
                    >
                        {employeesList.map(employee => (
                            <MenuItem key={employee.id} value={employee.id}>
                                {employee.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {(formData.type === 'purchase' || formData.type === 'sales' || formData.type === 'other_income') && (
                <TextField
                    margin="normal"
                    fullWidth
                    id="company_name"
                    label={`${t('common.companyName')} (${t('common.optional')})`}
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                />
            )}

            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label={t('common.description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                {t('common.addTransaction')}
            </Button>
        </Box>
    );
};

export default TransactionForm;