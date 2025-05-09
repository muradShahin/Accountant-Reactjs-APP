import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { format } from 'date-fns';
import { employees } from '../../services/api';
import { SelectChangeEvent } from '@mui/material/Select';

interface EmployeeAttendanceProps {
    employeeId: number;
}

interface Attendance {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'half-day';
    check_in: string;
    check_out: string;
    overtime_hours: number;
    overtime_rate: number;
    notes: string;
}

const EmployeeAttendance = ({ employeeId }: EmployeeAttendanceProps) => {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        status: 'present' as 'present' | 'absent' | 'half-day',
        check_in: '',
        check_out: '',
        overtime_hours: '',
        overtime_rate: '',
        notes: ''
    });

    const loadAttendance = async () => {
        try {
            const response = await employees.getAttendance(employeeId);
            setAttendance(response.data);
        } catch (error) {
            console.error('Error loading attendance:', error);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [employeeId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await employees.recordAttendance(employeeId, {
                ...formData,
                status: formData.status,
                overtime_hours: parseFloat(formData.overtime_hours) || 0,
                overtime_rate: parseFloat(formData.overtime_rate) || 0
            });
            setShowAddDialog(false);
            loadAttendance();
        } catch (error) {
            console.error('Error recording attendance:', error);
        }
    };

    const calculateOvertimePay = (hours: number, rate: number) => {
        return hours * rate;
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Attendance Records</Typography>
                <Button
                    variant="contained"
                    onClick={() => setShowAddDialog(true)}
                >
                    Record Attendance
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Overtime Hours</TableCell>
                            <TableCell>Overtime Pay</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendance.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>
                                    {format(new Date(record.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{record.status}</TableCell>
                                <TableCell>{record.check_in}</TableCell>
                                <TableCell>{record.check_out}</TableCell>
                                <TableCell>{record.overtime_hours || 0}</TableCell>
                                <TableCell>
                                    ${calculateOvertimePay(record.overtime_hours || 0, record.overtime_rate || 0).toFixed(2)}
                                </TableCell>
                                <TableCell>{record.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Attendance Dialog */}
            <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Record Attendance</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        label="Status"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="present">Present</MenuItem>
                                        <MenuItem value="absent">Absent</MenuItem>
                                        <MenuItem value="half-day">Half Day</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Check In Time"
                                    name="check_in"
                                    type="time"
                                    value={formData.check_in}
                                    onChange={handleChange}
                                    required={formData.status !== 'absent'}
                                    disabled={formData.status === 'absent'}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Check Out Time"
                                    name="check_out"
                                    type="time"
                                    value={formData.check_out}
                                    onChange={handleChange}
                                    required={formData.status !== 'absent'}
                                    disabled={formData.status === 'absent'}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Overtime Hours"
                                    name="overtime_hours"
                                    type="number"
                                    value={formData.overtime_hours}
                                    onChange={handleChange}
                                    disabled={formData.status === 'absent'}
                                    inputProps={{ step: "0.5" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Overtime Rate"
                                    name="overtime_rate"
                                    type="number"
                                    value={formData.overtime_rate}
                                    onChange={handleChange}
                                    disabled={formData.status === 'absent'}
                                    inputProps={{ step: "0.01" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    name="notes"
                                    multiline
                                    rows={2}
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">Record Attendance</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default EmployeeAttendance;