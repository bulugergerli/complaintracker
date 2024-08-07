import axiosInstance from "./axiosConfig";

function complaintGet(id?: number | null) {
    return new Promise((resolve, reject) => {
        axiosInstance.get("/complaint", {params:{id: id}})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function complaintUpdate(data: any) {
    return new Promise((resolve, reject) => {
        console.log(data);
        const complaintData = {
            id: data.id,
            location_id: data.location_id,
            user_id: data.user_id,
            complaint: data.complaint,
            photo_url: [],
            assigned_user_id: data.assigned_user_id,
            status_id: data.status_id
        };
        axiosInstance.put("/complaint", complaintData)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export { complaintGet, complaintUpdate };