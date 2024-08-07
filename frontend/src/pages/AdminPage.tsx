import { Container, Button, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ComplaintTable from "../components/ComplaintTable";
import PageHeader from "../components/PageHeader";
import UserTable from "../components/UserTable";
import LocationsTable from "../components/LocationsTable";
import { GridRowId } from "@mui/x-data-grid";
import CreateLocationForm from "../components/CreateLocationForm";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { CheckTokenExpiration } from "../utilities/jwt";
import { useSnackbar } from "../components/SnackbarProvider";
import { complaintGet, complaintUpdate } from "../enpoints/complaint";

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

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { openSnackbar } = useSnackbar();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);

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

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitForm = (newComplaint: any) => {
    // setComplaints([...complaints, newComplaint]);
    handleCloseForm();
  };

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
    <>
      <PageHeader pageName="Admin" />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 2,
            marginTop: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpenForm}>
            Create Location
          </Button>
          <CreateLocationForm
            open={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleSubmitForm}
          />
        </Box>
        <LocationsTable />
      </Container>
      <Container>
        <h3>Complaints</h3>
        <hr />
        <ComplaintTable
          rows={complaints}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAssignUser={handleAssignUser}
          userType={4} // Admin type
        />
      </Container>
      <Container>
        <UserTable />
      </Container>
    </>
  );
};

export default AdminPage;