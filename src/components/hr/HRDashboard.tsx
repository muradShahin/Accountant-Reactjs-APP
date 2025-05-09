import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { employees } from '../../services/api';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const HRDashboard = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [showAddEmployee, setShowAddEmployee] = useState(false);

    const loadEmployees = async () => {
        try {
            const response = await employees.getAll();
            setEmployeeList(response.data);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h4" component="h1">
                            HR Management
                        </Typography>
                        <Box>
                            <Button 
                                variant="contained" 
                                onClick={() => setShowAddEmployee(true)}
                            >
                                Add Employee
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <EmployeeList 
                            employeeData={employeeList} 
                            onEmployeeUpdated={loadEmployees}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Add Employee Dialog */}
            <EmployeeForm
                open={showAddEmployee}
                onClose={() => setShowAddEmployee(false)}
                onEmployeeAdded={loadEmployees}
            />
        </Container>
    );
};

export default HRDashboard;