import axiosInstance from './axiosConfig';

interface Location {
    location_name: string;
}

const createLocation = async (location: Location) => {
    try {
        const response = await axiosInstance.post('/location', {
            location: location.location_name,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating location:', error);
        throw error;
    }
};

export default createLocation;