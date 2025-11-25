import axios from 'axios';
import { Product, Order } from '../../components/dashboard/types';
import { User } from '../../components/admin/types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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
    const response = await api.put<Product>(`/products/${encodeURIComponent(id)}`, product);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    await api.delete(`/products/${encodeURIComponent(id)}`);
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
    const response = await api.put<Order>(`/orders/${encodeURIComponent(id)}/status`, { status });
    return response.data;
};

export const updateTrackingInfo = async (id: string, shippingCarrier: string, trackingNumber: string) => {
    const response = await api.put<Order>(`/orders/${encodeURIComponent(id)}/tracking`, { shippingCarrier, trackingNumber });
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

export const forgotPassword = async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
};

export const verifyEmail = async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
};

export const resendVerificationEmail = async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
};

// Profile
export const getRequests = async () => {
    const response = await api.get('/requests');
    return response.data;
};

export const getUserRequests = async (userId: string) => {
    const response = await api.get(`/requests/user/${userId}`);
    return response.data;
};

export const createRequest = async (request: {
    type: string;
    userId: string;
    explanation: string;
    title?: string;
    productName?: string;
    imageUrls?: string[];
    referenceLink?: string;
}) => {
    const response = await api.post('/requests', request);
    return response.data;
};

export const respondToRequest = async (
    id: string,
    response: string,
    status: string,
    result: string
) => {
    const encodedId = encodeURIComponent(id);
    const res = await api.patch(`/requests/${encodedId}/respond`, { response, status, result });
    return res.data;
};

// Extra Fees
export const getExtraFees = async () => {
    const response = await api.get('/extra-fees');
    return response.data;
};

export const getUserExtraFees = async (userId: string) => {
    const response = await api.get(`/extra-fees/user/${userId}`);
    return response.data;
};

export const createExtraFee = async (fee: {
    userId: string;
    item: string;
    description?: string;
    amount: string;
    date: string;
    status?: string;
}) => {
    const response = await api.post('/extra-fees', fee);
    return response.data;
};

export const updateExtraFee = async (id: string, fee: {
    userId: string;
    item: string;
    description?: string;
    amount: string;
    date: string;
    status: string;
}) => {
    const response = await api.put(`/extra-fees/${id}`, fee);
    return response.data;
};

export const deleteExtraFee = async (id: string) => {
    await api.delete(`/extra-fees/${id}`);
};

// Announcements
export const getAnnouncements = async () => {
    const response = await api.get('/announcements');
    return response.data;
};

export const createAnnouncement = async (announcement: {
    title: string;
    content: string;
    type: string;
}) => {
    const response = await api.post('/announcements', announcement);
    return response.data;
};

export const deleteAnnouncement = async (id: string) => {
    await api.delete(`/announcements/${id}`);
};

// Support Tickets
export const getSupportTickets = async () => {
    const response = await api.get('/support-tickets');
    return response.data;
};

export const getUserSupportTickets = async (userId: string) => {
    const response = await api.get(`/support-tickets/user/${userId}`);
    return response.data;
};

export const createSupportTicket = async (ticket: {
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    messages: any[];
}) => {
    const response = await api.post('/support-tickets', ticket);
    return response.data;
};

export const updateSupportTicket = async (id: string, updates: {
    status?: string;
    isReadByAdmin?: boolean;
    isReadByUser?: boolean;
    messages?: any[];
}) => {
    const response = await api.put(`/support-tickets/${id}`, updates);
    return response.data;
};

export const markTicketAsRead = async (id: string, role: 'admin' | 'user') => {
    const response = await api.put(`/support-tickets/${id}/read`, { role });
    return response.data;
};

// Settings - Plans
export const getPlans = async () => {
    const response = await api.get('/settings/plans');
    return response.data;
};

export const updatePlans = async (plans: any[]) => {
    const response = await api.put('/settings/plans', { plans });
    return response.data;
};

// Settings - Event Popup
export const getEventPopup = async () => {
    const response = await api.get('/settings/event-popup');
    return response.data;
};

export const updateEventPopup = async (popup: {
    isActive: boolean;
    imageUrl: string;
    link: string;
}) => {
    const response = await api.put('/settings/event-popup', popup);
    return response.data;
};

// Settings - Influencer Codes
export const getInfluencerCodes = async () => {
    const response = await api.get('/settings/influencer-codes');
    return response.data;
};

export const updateInfluencerCodes = async (codes: any[]) => {
    const response = await api.put('/settings/influencer-codes', { codes });
    return response.data;
};

// Use influencer code (increment usage)
export const useInfluencerCode = async (code: string, amount: number) => {
    const response = await api.post(`/settings/influencer-codes/use/${code}`, { amount });
    return response.data;
};

// Upload image to R2
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Upload multiple images to R2
export const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    const response = await api.post('/upload/images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete image from R2
export const deleteImage = async (url: string) => {
    const response = await api.delete('/upload/image', { data: { url } });
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

// Cart
export const getCart = async (userId: string) => {
    const response = await api.get(`/cart/${userId}`);
    return response.data;
};

export const addToCart = async (userId: string, product: Product, variant: any, quantity: number, destination: string, podFileUrl?: string) => {
    const response = await api.post('/cart/add', { userId, product, variant, quantity, destination, podFileUrl });
    return response.data;
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
    const response = await api.put('/cart/update', { userId, itemId, quantity });
    return response.data;
};

export const removeFromCart = async (itemId: string) => {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
};

export const clearCart = async (userId: string) => {
    const response = await api.post('/cart/clear', { userId });
    return response.data;
};

// Favorites
export const getFavorites = async (userId: string) => {
    const response = await api.get(`/favorites/${userId}`);
    return response.data;
};

export const toggleFavorite = async (userId: string, productId: string) => {
    const response = await api.post('/favorites/toggle', { userId, productId });
    return response.data;
};

export const createCategory = async (category: { name: string; subcategories: { name: string }[] }) => {
    const response = await api.post('/categories', category);
    return response.data;
};

export const updateCategory = async (id: string, category: { name: string; subcategories: { name: string }[] }) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Referral System
export const getUnseenRewards = async (userId: string) => {
    const response = await api.get(`/referral/rewards/${userId}`);
    return response.data;
};

export const markRewardsSeen = async (userId: string) => {
    const response = await api.post(`/referral/rewards/${userId}/mark-seen`);
    return response.data;
};

export const getReferralStats = async (userId: string) => {
    const response = await api.get(`/referral/stats/${userId}`);
    return response.data;
};

// POD File Update
export const updateCartItemPodFile = async (itemId: string, podFileUrl: string | null) => {
    const response = await api.put(`/cart/${itemId}/pod-file`, { podFileUrl });
    return response.data;
};

// User Plan and Auto-Renew
export const updateUserPlan = async (userId: string, plan: string, subscriptionEndDate: string) => {
    const response = await api.put(`/users/${userId}/plan`, { plan, subscriptionEndDate });
    return response.data;
};

export const updateAutoRenew = async (userId: string, autoRenew: boolean) => {
    const response = await api.put(`/users/${userId}/auto-renew`, { autoRenew });
    return response.data;
};

// Favorite Categories
export const getFavoriteCategories = async (userId: string) => {
    const response = await api.get(`/favorite-categories/user/${userId}`);
    return response.data;
};

export const createFavoriteCategory = async (userId: string, name: string, productIds: string[]) => {
    const response = await api.post('/favorite-categories', { userId, name, productIds });
    return response.data;
};

export const updateFavoriteCategory = async (id: string, name: string, productIds: string[]) => {
    const response = await api.put(`/favorite-categories/${id}`, { name, productIds });
    return response.data;
};

export const deleteFavoriteCategory = async (id: string) => {
    await api.delete(`/favorite-categories/${id}`);
};

// DELETE Operations
export const deleteOrder = async (id: string) => {
    await api.delete(`/orders/${id}`);
};

export const deleteRequest = async (id: string) => {
    await api.delete(`/requests/${id}`);
};

export const deleteSupportTicket = async (id: string) => {
    await api.delete(`/support-tickets/${id}`);
};

// Notifications
export const getNotifications = async (userId: string) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
};

export const markNotificationRead = async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsRead = async (userId: string) => {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data;
};

export const deleteNotification = async (id: string) => {
    await api.delete(`/notifications/${id}`);
};

// Blog API Functions
export const getBlogPosts = async (params?: { category?: string; search?: string; featured?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

    const response = await api.get(`/blog/posts?${queryParams.toString()}`);
    return response.data;
};

export const getBlogPost = async (slug: string) => {
    const response = await api.get(`/blog/posts/${slug}`);
    return response.data;
};

export const getRelatedBlogPosts = async (slug: string) => {
    const response = await api.get(`/blog/posts/${slug}/related`);
    return response.data;
};

export const getBlogCategories = async () => {
    const response = await api.get('/blog/categories');
    return response.data;
};

export const createBlogPost = async (post: any) => {
    const response = await api.post('/blog/posts', post);
    return response.data;
};

export const updateBlogPost = async (id: string, post: any) => {
    const response = await api.put(`/blog/posts/${id}`, post);
    return response.data;
};

export const deleteBlogPost = async (id: string) => {
    await api.delete(`/blog/posts/${id}`);
};

export const toggleBlogPostPublished = async (id: string) => {
    const response = await api.patch(`/blog/posts/${id}/toggle-published`);
    return response.data;
};

export const toggleBlogPostFeatured = async (id: string) => {
    const response = await api.patch(`/blog/posts/${id}/toggle-featured`);
    return response.data;
};

export const uploadBlogImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/blog/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// User Creation (Admin)
export const createUser = async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
}) => {
    const response = await api.post('/users', userData);
    return response.data;
};

// Analytics
export const getActiveUsers = async () => {
    const response = await api.get('/analytics/active-users');
    return response.data;
};

// Heartbeat
export const sendHeartbeat = async (type: 'landing' | 'dashboard', socketId: string) => {
    const response = await api.post('/heartbeat', { type, socketId });
    return response.data;
};

// Profile Management
export const updateAvatar = async (userId: string, avatarUrl: string) => {
    const response = await api.put(`/profile/${userId}/avatar`, { avatar: avatarUrl });
    return response.data;
};

export const updateProfile = async (userId: string, profileData: { fullName?: string; email?: string; companyName?: string }) => {
    const response = await api.put(`/profile/${userId}/profile`, {
        fullName: profileData.fullName,
        email: profileData.email,
        companyName: profileData.companyName
    });
    return response.data;
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
    const response = await api.put(`/profile/${userId}/password`, { currentPassword, newPassword });
    return response.data;
};

export default api;
