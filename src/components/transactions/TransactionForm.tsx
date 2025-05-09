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
import { transactions, employees, Transaction } from '../../services/api';

interface TransactionFormProps {
    onTransactionAdded: () => void;
}

interface Employee {
    id: number;
    name: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
        amount: 0,
        type: 'HR',
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
                type: 'HR',
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
                label="Date"
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
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="purchase">Purchase</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                    <MenuItem value="other_income">Other Income</MenuItem>
                </Select>
            </FormControl>

            {formData.type === 'HR' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel id="employee-label">Employee</InputLabel>
                    <Select
                        labelId="employee-label"
                        id="employee_id"
                        name="employee_id"
                        value={formData.employee_id?.toString() || ''}
                        label="Employee"
                        onChange={handleChange}
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
                    label="Company Name (Optional)"
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
                label="Description"
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
                Add Transaction
            </Button>
        </Box>
    );
};

export default TransactionForm;