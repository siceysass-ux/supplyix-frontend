/**
 * Data Refetch Utilities
 * Centralized functions to refresh data after CRUD operations
 */

import * as api from './services/api';

export const createRefetchFunctions = (setters: {
    setProducts: React.Dispatch<React.SetStateAction<any[]>>;
    setCategories: React.Dispatch<React.SetStateAction<any[]>>;
    setOrders: React.Dispatch<React.SetStateAction<any[]>>;
    setExtraFees: React.Dispatch<React.SetStateAction<any[]>>;
    setRequests: React.Dispatch<React.SetStateAction<any[]>>;
    setSupportTickets: React.Dispatch<React.SetStateAction<any[]>>;
    setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
    setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}) => {

    const refetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setters.setProducts(data);
            console.log('✅ Products refreshed');
        } catch (error) {
            console.error("Failed to refetch products:", error);
        }
    };

    const refetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setters.setCategories(data);
            console.log('✅ Categories refreshed');
        } catch (error) {
            console.error("Failed to refetch categories:", error);
        }
    };

    const refetchOrders = async () => {
        try {
            const data = await api.getOrders();
            setters.setOrders(data);
            console.log('✅ Orders refreshed');
        } catch (error) {
            console.error("Failed to refetch orders:", error);
        }
    };

    const refetchFees = async () => {
        try {
            const data = await api.getExtraFees();
            setters.setExtraFees(data);
            console.log('✅ Fees refreshed');
        } catch (error) {
            console.error("Failed to refetch fees:", error);
        }
    };

    const refetchRequests = async () => {
        try {
            const data = await api.getRequests();
            setters.setRequests(data);
            console.log('✅ Requests refreshed');
        } catch (error) {
            console.error("Failed to refetch requests:", error);
        }
    };

    const refetchTickets = async () => {
        try {
            const data = await api.getSupportTickets();
            setters.setSupportTickets(data);
            console.log('✅ Support tickets refreshed');
        } catch (error) {
            console.error("Failed to refetch tickets:", error);
        }
    };

    const refetchAnnouncements = async () => {
        try {
            const data = await api.getAnnouncements();
            setters.setAnnouncements(data);
            console.log('✅ Announcements refreshed');
        } catch (error) {
            console.error("Failed to refetch announcements:", error);
        }
    };

    const refetchUsers = async () => {
        try {
            const data = await api.getUsers();
            setters.setUsers(data);
            console.log('✅ Users refreshed');
        } catch (error) {
            console.error("Failed to refetch users:", error);
        }
    };

    return {
        refetchProducts,
        refetchCategories,
        refetchOrders,
        refetchFees,
        refetchRequests,
        refetchTickets,
        refetchAnnouncements,
        refetchUsers,
    };
};
