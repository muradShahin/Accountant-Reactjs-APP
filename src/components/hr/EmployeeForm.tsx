import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { employees } from '../../services/api';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onEmployeeAdded: () => Promise<void>;
}

interface EmployeeFormData {
    name: string;
    email: string;
    position: string;
    base_salary: string;
    hire_date: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onEmployeeAdded }) => {
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: '',
        email: '',
        position: '',
        base_salary: '',
        hire_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await employees.create({
                name: formData.name,
                email: formData.email,
                position: formData.position,
                base_salary: parseFloat(formData.base_salary),
                hire_date: formData.hire_date
            });
            setFormData({
                name: '',
                email: '',
                position: '',
                base_salary: '',
                hire_date: new Date().toISOString().split('T')[0]
            });
            await onEmployeeAdded();
            onClose();
        } catch (error) {
            console.error('Failed to create employee:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="position"
                        label="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="base_salary"
                        label="Base Salary"
                        name="base_salary"
                        type="number"
                        value={formData.base_salary}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="hire_date"
                        label="Hire Date"
                        name="hire_date"
                        type="date"
                        value={formData.hire_date}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Add Employee
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeForm;