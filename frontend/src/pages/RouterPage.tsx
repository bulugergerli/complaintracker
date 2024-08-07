import React, { useEffect, useState } from "react";
import ComplaintTable from "../components/ComplaintTable";
import { GridRowId } from "@mui/x-data-grid";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { useSnackbar } from "../components/SnackbarProvider";
import { CheckTokenExpiration } from "../utilities/jwt";
import { complaintGet, complaintUpdate } from "../enpoints/complaint";
import { userGet } from "../enpoints/auth";

interface AssignedUser {
    id: number;
    email: string;
}

interface Location {
    id: number;
    location: string;
    qr: string;
}

interface Status {
    id: number;
    status_name: string;
}

interface Complaint {
    assigned_user: AssignedUser;
    complaint: string;
    created_at: string;
    finished_at: string;
    id: number;
    location: Location;
    photo_url: string;
    status: Status;
    user: AssignedUser;
}

interface User {
    id: number;
    name: string;
    surname: string;
    user_name: string;
    email: string;
    role_id: number; // Ensure that the 'type' is included and correctly typed
}


const RouterPage: React.FC = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const { openSnackbar } = useSnackbar();
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const [users, setUsers] = useState<User[]>([]);


    useEffect(() => {
        userGet()
            .then((data: any) => {
                console.log(data);
                setUsers(data)
            })
            .catch((error: Error) => {
                console.log("User get failed:", error);
                openSnackbar('User didnt fetch!', 'info', 'bottom', 'right');
            });
    }, [])

    useEffect(() => {
        complaintGet()
            .then((data: any) => {
                console.log(data);
                setComplaints(data);
            })
            .catch((error: Error) => {
                openSnackbar('Complaint didnt fetch!', 'info', 'bottom', 'right');
            });
    }, [])


    const handleEdit = (id: GridRowId) => {
        console.log(`Edit row with id: ${id}`);
    };

    const handleDelete = (id: GridRowId) => {
        setComplaints(complaints.filter((row) => row.id !== id));
    };

    const handleAssignUser = (complaintId: GridRowId, userId: number) => {

        const complaintData = complaints.find(row => row.id === complaintId);
        if (complaintData) {

            const updatedData = {
                id: complaintId,
                location_id: complaintData.location.id,
                user_id: complaintData.user.id,
                complaint: complaintData.complaint,
                photo_url: complaintData.photo_url,
                assigned_user_id: userId,
                status_id: 2
            };

            complaintUpdate(updatedData)
                .then(() => {
                    openSnackbar('User assigned successfully!', 'success', 'bottom', 'right');
                })
                .catch((error: Error) => {
                    console.error("Error updating the complaint:", error);
                    openSnackbar('Failed to assign user!', 'error', 'bottom', 'right');
                });
        } else {
            openSnackbar('Complaint not found!', 'error', 'bottom', 'right');
        }
    };


    const waitingAssignmentRows = complaints.filter((row) => row.status.id === 1);
    const inProgressRows = complaints.filter((row) => row.status.id === 2);
    const doneRows = complaints.filter((row) => row.status.id === 3);

    useEffect(() => {
        const token = cookies.get('token');
        if (token == "") {
            navigate("/login")
            openSnackbar('There is not token!', 'info', 'bottom', 'right');
        }
        if (token) {
            const valid = CheckTokenExpiration(token);
            if (!valid) {
                navigate("/login")
                openSnackbar('Token is expired!', 'info', 'bottom', 'right');
            }
        }
    }, [])
    return (
        <div>
            <PageHeader pageName="Router" />
            <h2>Waiting Complaints</h2>
            <ComplaintTable
                rows={waitingAssignmentRows}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAssignUser={handleAssignUser}
                userType={cookies.get('role')} // Router type
            />
            <h2>Ongoing Complaints</h2>
            <ComplaintTable
                rows={inProgressRows}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAssignUser={handleAssignUser}
                userType={cookies.get('role')} // Router type
            />
            <h2>Finished Complaints</h2>
            <ComplaintTable
                rows={doneRows}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAssignUser={handleAssignUser}
                userType={cookies.get('role')} // Router type
            />
        </div>
    );
};

export default RouterPage;
