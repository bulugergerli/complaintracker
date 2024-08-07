import { Box, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { CheckTokenExpiration, ReturnTokenPayload } from "../utilities/jwt";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { useSnackbar } from "../components/SnackbarProvider";
import { complaintGet, complaintUpdate } from "../enpoints/complaint";
import { statusOptions } from "../data";

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
  finished_at: string | null;
  id: number;
  location: Location;
  photo_url: string;
  status: Status;
  user: AssignedUser;
}

const WorkerPage = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { openSnackbar } = useSnackbar();
  const token = cookies.get("token");
  const tokenPayload = token ? ReturnTokenPayload(token) : null;
  const workerId = tokenPayload ? tokenPayload.user_id : null;
  const [rows, setRows] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = (await complaintGet(workerId)) as Complaint[] | null;
        if (!data) {
          openSnackbar("Complaint didn't fetch!", "info", "bottom", "right");
          setRows([]);
        } else {
          setRows(data);
        }
      } catch (error) {
        openSnackbar("Complaint didn't fetch!", "info", "bottom", "right");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [workerId, openSnackbar]);

  const handleStatusChange = async (complaintId: number, newStatusId: number) => {
    const complaint = rows.find((row) => row.id === complaintId);
    if (complaint && complaint.assigned_user.id === workerId) {
      const updatedData = {
        id: complaintId,
        location_id: complaint.location.id,
        user_id: complaint.user.id,
        complaint: complaint.complaint,
        photo_url: complaint.photo_url,
        assigned_user_id: complaint.assigned_user.id,
        status_id: newStatusId,
        finished_at: newStatusId === 3 ? new Date().toISOString().split("T")[0] : null,
      };
      try {
        console.log(updatedData);
        await complaintUpdate(updatedData);
        setRows(
          rows.map((row) =>
            row.id === complaintId
              ? {
                  ...row,
                  status: {
                    ...row.status,
                    id: newStatusId,
                    status_name: statusOptions.find((opt) => opt.id === newStatusId)?.label || "",
                  },
                  finished_at: newStatusId === 3 ? new Date().toISOString().split("T")[0] : null,
                }
              : row
          )
        );
        openSnackbar("Complaint status updated successfully!", "success", "bottom", "right");
      } catch (error) {
        console.error("Failed to update complaint status:", error);
        openSnackbar("Failed to update complaint status!", "error", "bottom", "right");
      }
    } else {
      console.error("You can only change the status of complaints assigned to you.");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "location",
      headerName: "Location",
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => {
        return params.value && params.value.location ? params.value.location : "";
      },
    },
    { field: "complaint", headerName: "Complaint", minWidth: 200 },
    {
      field: "photo_url",
      headerName: "Photo",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const photoUrl = typeof params.row.photo_url === 'string' ? params.row.photo_url : "";
        const cleanedPhotoUrl = photoUrl.replace("{'", "").replace("'}", "");

        return (
          <img src={cleanedPhotoUrl} alt="Complaint Photo" style={{ width: "100px" }} />
        );
      },
    },
    {
      field: "assigned_user",
      headerName: "Assigned",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const user = params.value ? params.value.user_name : "Unassigned";
        return user;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const status = statusOptions.find((option) => option.id === params.value.id);
        return (
          <Select
            value={params.value.id}
            onChange={(e) => handleStatusChange(params.id as number, e.target.value as number)}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    { field: "created_at", headerName: "Created At", minWidth: 200 },
    { field: "finished_at", headerName: "Finished At", minWidth: 200 },
  ];

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/login");
      openSnackbar("There is no token!", "info", "bottom", "right");
      return;
    }
    const valid = CheckTokenExpiration(token);
    if (!valid) {
      navigate("/login");
      openSnackbar("Token is expired!", "info", "bottom", "right");
    }
  }, [cookies, navigate, openSnackbar]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Worker Page
      </Typography>
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          disableColumnMenu
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default WorkerPage;
