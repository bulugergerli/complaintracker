import axiosInstance from "./axiosConfig";



function createComplaint(data: any) {
    return new Promise((resolve, reject) => {
        const complaintData = {
            id: data.id,
            user_id: data.user_id,
            assigned_user_id: data.assigned_user_id,
            status_id: data.status_id,
            location_id: data.location_id,
            complaint: data.complaint,
            photo_url: data.photo_url,
        };
        axiosInstance.post("/complaint", complaintData)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
interface LocationRow {
    id: number;
    location: string;
}
function getLocations(): Promise<LocationRow[]> {
    return new Promise((resolve, reject) => {
        axiosInstance.get("/location")
            .then(response => {
                resolve(response.data as LocationRow[]);
            })
            .catch(error => {
                reject(error);
            });
    });
}
function userLoginRegister(data: any, login: string) {
    return new Promise((resolve, reject) => {
        const userData = {
            name: data.name,
            surname: data.surname,
            user_name: data.user_name,
            email: data.email,
            password: data.password,
            role_id: data.role_id,
            remember: data.remember
        };
        const queryParams = {
            login: login
        };
        axiosInstance.post("/user", userData, {
            params: queryParams
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function userGet() {
    return new Promise((resolve, reject) => {
        axiosInstance.get("/user")
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
// userGet(loginUserData)
// .then((data: any) => {
//     console.log(data);
//     // TODO: show success
//     // TODO: redirect homepage
// })
// .catch((error: Error )=> {
//     console.log("User get failed:", error);
//     // TODO: show error 
// });

// userGet(loginUserData)
// .then((data: any) => {
//     console.log(data);
//     // TODO: show success
//     // TODO: redirect homepage
// })
// .catch((error: Error )=> {
//     console.log("User get failed:", error);
//     // TODO: show error 
// });
// userGet(loginUserData)
// .then((data: any) => {
//     console.log(data);
//     // TODO: show success
//     // TODO: redirect homepage
// })
// .catch((error: Error )=> {
//     console.log("User get failed:", error);
//     // TODO: show error 
// });
// userGet(loginUserData)
// .then((data: any) => {
//     console.log(data);
//     // TODO: show success
//     // TODO: redirect homepage
// })
// .catch((error: Error )=> {
//     console.log("User get failed:", error);
//     // TODO: show error 
// });
export { userLoginRegister, userGet, createComplaint, getLocations };
