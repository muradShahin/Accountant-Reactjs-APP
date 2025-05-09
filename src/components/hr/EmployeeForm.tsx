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
    position: string;
    salary: string;
    joiningDate: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onEmployeeAdded }) => {
    const [formData, setFormData] = useState<EmployeeFormData>({
        name: '',
        position: '',
        salary: '',
        joiningDate: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await employees.create({
                name: formData.name,
                position: formData.position,
                salary: parseFloat(formData.salary),
                joiningDate: formData.joiningDate
            });
            setFormData({
                name: '',
                position: '',
                salary: '',
                joiningDate: ''
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
                        id="salary"
                        label="Salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="joiningDate"
                        label="Joining Date"
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
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