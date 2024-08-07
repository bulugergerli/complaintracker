import { Box, Button, Container } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintTable from "../components/ComplaintTable";
import CreateComplaintForm from "../components/CreateComplaintForm";
import PageHeader from "../components/PageHeader";
import QRCodeScanner from "../components/QRCodeScanner";
import { Cookies } from "react-cookie";
import { useSnackbar } from "../components/SnackbarProvider";
import { CheckTokenExpiration, ReturnTokenPayload } from "../utilities/jwt";
import { complaintGet } from "../enpoints/complaint";

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

interface JwtPayload {
  user_id: number;
}

const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const CustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { openSnackbar } = useSnackbar();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get("location");
  const [nextId, setNextId] = useState(1);
  const [formLocationId, setFormLocationId] = useState<string | null>(null);
  const qrScannerRef = useRef<{ clear: () => void } | null>(null);

  const token = getCookie('token') || '';
  const tokenPayload = token ? ReturnTokenPayload(token) : null;
  const userId = tokenPayload ? tokenPayload.user_id : null;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      openSnackbar('There is no token!', 'info', 'bottom', 'right');
    } else {
      const valid = CheckTokenExpiration(token);
      if (!valid) {
        navigate("/login");
        openSnackbar('Token is expired!', 'info', 'bottom', 'right');
      }
    }
  }, [userId, navigate, openSnackbar, token]);

  useEffect(() => {
    if (userId) {
      complaintGet(userId)
        .then((data: any) => {
          setComplaints(data || []);
          if (!data) {
            openSnackbar('Complaints did not fetch!', 'info', 'bottom', 'right');
          }
        })
        .catch((error: Error) => {
          openSnackbar('Complaints did not fetch!', 'info', 'bottom', 'right');
        });
    }
  }, [userId, openSnackbar]);

  useEffect(() => {
    if (locationId) {
      setFormLocationId(locationId);
      setIsFormOpen(true); // Automatically open the form if locationId is present
    }
  }, [locationId]);

  const handleOpenForm = () => {
    setFormLocationId(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    navigate("/customer");
  };

  const handleSubmitForm = (newComplaint: any) => {
    setComplaints([...complaints, newComplaint]);
    setNextId(nextId + 1);
    handleCloseForm();
    if (qrScannerRef.current) {
      qrScannerRef.current.clear(); // Clear QR scanner input
    }
  };

  const handleScan = (url: string) => {
    try {
      const decodedUrl = new URL(url);
      const locationId = decodedUrl.searchParams.get("location");
      if (locationId) {
        navigate(`/customer?location=${locationId}`);
      }
    } catch (error) {
      console.error("Invalid QR code URL", error);
      openSnackbar('Invalid QR code URL', 'error', 'bottom', 'right');
    }
  };

  return (
    <>
      <PageHeader pageName="Customer" />
      <Container>
        <ComplaintTable
          rows={complaints}
          handleEdit={(id: GridRowId) => {}}
          handleDelete={(id: GridRowId) => {}}
          handleAssignUser={(id: GridRowId, userId: number) => {}}
          userType={cookies.get('role')}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: 2,
            marginTop: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpenForm}>
            Create Complaint
          </Button>
          <QRCodeScanner onScan={handleScan} />
        </Box>
        <CreateComplaintForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          locationId={formLocationId}
          nextId={complaints.length + 1}
        />
      </Container>
    </>
  );
};

export default CustomerPage;
