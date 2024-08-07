import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import React, { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { userGet } from "../enpoints/auth";
import { useSnackbar } from "./SnackbarProvider";
import { TransitionProps } from "@mui/material/transitions";

interface ComplaintTableProps {
  rows: any[];
  handleEdit: (id: GridRowId) => void;
  handleDelete: (id: GridRowId) => void;
  handleAssignUser: (id: GridRowId, userId: number) => void;
  userType: number;
}

interface User {
  id: number;
  name: string;
  surname: string;
  user_name: string;
  email: string;
  role_id: number;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ComplaintTable: React.FC<ComplaintTableProps> = ({
  rows,
  handleEdit,
  handleDelete,
  handleAssignUser,
  userType,
}) => {
  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const cookies = new Cookies();
  const [openDialogs, setOpenDialogs] = useState<Record<GridRowId, boolean>>({});

  const handleQR = (param: any) => {
    setOpenDialogs((prev) => ({ ...prev, [param.id]: true }));
  };
  const handleCloseQR = (id: GridRowId) => {
    setOpenDialogs((prev) => ({ ...prev, [id]: false }));
  };
  const handleDownloadQR = (base64: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    userGet()
      .then((data: any) => {
        console.log(data);
        setUsers(data);
      })
      .catch((error: Error) => {
        console.log("User get failed:", error);
        openSnackbar('User didn’t fetch!', 'info', 'bottom', 'right');
      });
  }, []);

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
    {
      field: "complaint", headerName: "Compliant", minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value} placement="top">
          {params.value}
        </Tooltip>
      )
      ,
    },
    {
      field: "photo_url",
      headerName: "Photo",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const photoUrl = typeof params.row.photo_url === 'string' ? params.row.photo_url : "";
        const cleanedPhotoUrl = photoUrl.replace("{'", "").replace("'}", "");

        return (
          <>
            <IconButton color="primary" onClick={() => handleQR(params)}>
              <img src={cleanedPhotoUrl} style={{ width: "100px" }} alt="Complaint Photo" />
            </IconButton>
            <Dialog
              open={!!openDialogs[params.id]}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => handleCloseQR(params.id)}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <img src={cleanedPhotoUrl} alt="Complaint Photo" />
                  <br />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleDownloadQR(cleanedPhotoUrl)}>
                  Download Image
                </Button>
                <Button onClick={() => handleCloseQR(params.id)}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
    ...(userType !== 2
      ? [
        {
          field: "assigned_user_id",
          headerName: "Assigned",
          minWidth: 200,
          renderCell: (params: GridRenderCellParams) => {
            const user = users.find((user) => user.id.toString() === params.value);
            if (params.row.status_id === 3 || userType === 2) {
              return user ? user.user_name : "Unassigned";
            }
            return (
              <FormControl>
                <Select
                  value={params.value || ""}
                  onChange={(event) =>
                    handleAssignUser(params.id, Number(event.target.value))
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === "") {
                      return <em>{params.row.assigned_user.email.split("@")[0]}</em>;
                    }
                    const user = users.find(
                      (user) => user.id.toString() === selected
                    );
                    return user ? user.user_name : "Unassigned";
                  }}
                >
                  {users
                    .filter((user) => user.role_id === 3)
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            );
          },
        },
      ]
      : []),
    {
      field: "status",
      headerName: "Status",
      renderCell: (params: GridRenderCellParams) => {
        return params.value && params.value.status_name ? params.value.status_name : "";
      },
    },
    { field: "created_at", headerName: "Created At", minWidth: 120 },
    { field: "finished_at", headerName: "Finished At", minWidth: 120 },
  ];

  if (cookies.get('role') === 'admin') {
    columns.push({
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton color="warning" onClick={() => handleEdit(params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    });
  }

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </div>
  );
};

export default ComplaintTable;
