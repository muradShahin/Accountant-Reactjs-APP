import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import { employees } from '../../services/api';
import EmployeeTransactions from './EmployeeTransactions';
import EmployeeAttendance from './EmployeeAttendance';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

interface Employee {
    id: number;
    name: string;
    email: string;
    hire_date: string;
    base_salary: number;
    position: string;
}

interface EmployeeListProps {
    employeeData: Employee[];
    onEmployeeUpdated: () => void;
}

const EmployeeList = ({ employeeData, onEmployeeUpdated }: EmployeeListProps) => {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [balanceInfo, setBalanceInfo] = useState<any>(null);

    const handleEmployeeClick = async (employee: Employee) => {
        setSelectedEmployee(employee);
        try {
            const response = await employees.getBalance(employee.id);
            setBalanceInfo(response.data);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setSelectedEmployee(null);
        setTabValue(0);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Employees
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Hire Date</TableCell>
                            <TableCell>Base Salary</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeData.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>
                                    {format(new Date(employee.hire_date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>${employee.base_salary.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleEmployeeClick(employee)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Employee Details Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                {selectedEmployee && (
                    <>
                        <DialogTitle>
                            Employee Details - {selectedEmployee.name}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={handleTabChange}>
                                    <Tab label="Overview" />
                                    <Tab label="Transactions" />
                                    <Tab label="Attendance" />
                                </Tabs>
                            </Box>

                            <TabPanel value={tabValue} index={0}>
                                <Typography variant="h6" gutterBottom>
                                    Employee Information
                                </Typography>
                                <Typography>Position: {selectedEmployee.position}</Typography>
                                <Typography>Email: {selectedEmployee.email}</Typography>
                                <Typography>
                                    Hire Date: {format(new Date(selectedEmployee.hire_date), 'MMMM dd, yyyy')}
                                </Typography>
                                <Typography>Base Salary: ${selectedEmployee.base_salary.toFixed(2)}</Typography>

                                {balanceInfo && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Current Balance
                                        </Typography>
                                        <Typography>
                                            Transaction Balance: ${balanceInfo.transaction_balance.toFixed(2)}
                                        </Typography>
                                        <Typography>
                                            Current Balance: ${balanceInfo.current_balance.toFixed(2)}
                                        </Typography>
                                    </Box>
                                )}
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <EmployeeTransactions
                                    employeeId={selectedEmployee.id}
                                    onTransactionAdded={onEmployeeUpdated}
                                />
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <EmployeeAttendance
                                    employeeId={selectedEmployee.id}
                                />
                            </TabPanel>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default EmployeeList;