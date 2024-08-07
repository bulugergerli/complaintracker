import axiosInstance from "./axiosConfig";

const getUserData = async () => {
    try {
        const response = await axiosInstance.get('/user');
        return response.data; // backendden gelen kullanıcı verileri
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};