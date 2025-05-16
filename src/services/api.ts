import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface Employee {
    id: number;
    name: string;
    email: string;
    hire_date: string;
    base_salary: number;
    position: string;
}

export interface Transaction {
    id?: number;
    type?: 'salary' | 'purchase' | 'sales' | 'other_income';
    transaction_type: 'salary' | 'purchase' | 'sales' | 'other_income' | 'deduction';
    amount: number;
    date: string;
    description: string;
    company_name?: string;
    employee_id?: number;
    employee_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AttendanceRecord {
    id?: number;
    employeeId?: number;
    date: string;
    status: 'present' | 'absent' | 'half-day';
    overtime_hours: number;
    overtime_rate: number;
}

export interface EmployeeTransaction {
    id?: number;
    employeeId?: number;
    amount: number;
    type: 'salary' | 'bonus' | 'deduction' | 'advance';
    description: string;
    date: string;
}

export interface BalanceInfo {
    base_salary: number;
    transaction_balance: number;
    current_balance: number;
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
}

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    }
};

export const employees = {
    getAll: async () => {
        const response = await api.get('/employees');
        return response.data;
    },
    create: async (employee: { name: string; email: string; hire_date: string; base_salary: number; position: string; }) => {
        const response = await api.post('/employees', employee);
        return response.data;
    },
    update: async (id: number, employee: Partial<Employee>) => {
        const response = await api.put(`/employees/${id}`, employee);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    },
    getAttendance: async (employeeId: number) => {
        const response = await api.get(`/employees/${employeeId}/attendance`);
        return response.data;
    },
    recordAttendance: async (employeeId: number, attendance: Omit<AttendanceRecord, 'id' | 'employeeId'>) => {
        const response = await api.post(`/employees/${employeeId}/attendance`, attendance);
        return response.data;
    },
    getTransactions: async (employeeId: number, params?: { page?: number; limit?: number; }) => {
        const queryParams = new URLSearchParams();
        queryParams.append('employee_id', employeeId.toString());
        
        // Add pagination parameters
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        
        const response = await api.get<PaginatedResponse<EmployeeTransaction>>(`/transactions?${queryParams.toString()}`);
        return response.data;
    },
    addTransaction: async (employeeId: number, transaction: Omit<EmployeeTransaction, 'id' | 'employeeId'>) => {
        const response = await api.post(`/employees/${employeeId}/transactions`, transaction);
        return response.data;
    },
    getBalance: async (employeeId: number) => {
        const response = await api.get(`/employees/${employeeId}/balance`);
        return response.data;
    }
};

export const transactions = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        type?: string;
    }) => {
        const queryParams = new URLSearchParams();
        
        // Add pagination parameters
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', (params.limit || 10).toString());
        
        // Add filters
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.type) queryParams.append('transaction_type', params.type);
        
        const response = await api.get<PaginatedResponse<Transaction>>(`/transactions?${queryParams.toString()}`);
        return response.data;
    },
    create: async (transaction: Omit<Transaction, 'id'>) => {
        const transformedTransaction = {
            ...transaction,
            transaction_type: transaction.type || transaction.transaction_type
        };
        const response = await api.post('/transactions', transformedTransaction);
        return response.data;
    },
    update: async (id: number, transaction: Partial<Transaction>) => {
        const response = await api.put(`/transactions/${id}`, transaction);
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    }
};

export const balance = {
    get: async () => {
        const response = await api.get('/balance');
        return response.data;
    },
    update: async (amount: number) => {
        const response = await api.post('/balance', { amount });
        return response.data;
    }
};