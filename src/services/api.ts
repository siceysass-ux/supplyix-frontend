import axios from 'axios';
import { Product, Order } from '../../components/dashboard/types';
import { User } from '../../components/admin/types';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Products
export const getProducts = async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
};

export const createProduct = async (product: Product) => {
    const response = await api.post<Product>('/products', product);
    return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    await api.delete(`/products/${id}`);
};

// Orders
export const getOrders = async () => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
};

export const createOrder = async (order: Order) => {
    const response = await api.post<Order>('/orders', order);
    return response.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
};

export const updateTrackingInfo = async (id: string, shippingCarrier: string, trackingNumber: string) => {
    const response = await api.put<Order>(`/orders/${id}/tracking`, { shippingCarrier, trackingNumber });
    return response.data;
};

// Users
export const getUsers = async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

export const updateUserStatus = async (id: string, status: string) => {
    const response = await api.put<User>(`/users/${id}/status`, { status });
    return response.data;
};

export const updateSubscription = async (id: string, subscriptionEndDate: string) => {
    const response = await api.put<User>(`/users/${id}/subscription`, { subscriptionEndDate });
    return response.data;
};

// Auth
export const login = async (email: string, password: string) => {
    const response = await api.post<User>('/auth/login', { email, password });
    return response.data;
};

export const register = async (user: Partial<User>) => {
    const response = await api.post<User>('/auth/register', user);
    return response.data;
};

export default api;
