import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSnackbar } from "./SnackbarProvider";
import axiosInstance from "../enpoints/axiosConfig"; // axiosInstance'ı import ediyoruz

// Kullanıcı verilerinin tipini belirleyen arayüz
interface UserData {
  id: number;
  name: string;
  surname: string;
  user_name: string;
  email: string;
  role_id: number;
}

const UserTable = () => {
  const [rows, setRows] = useState<UserData[]>([]); // rows'un tipini belirtiyoruz
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUserSurname, setEditUserSurname] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");

  const { openSnackbar } = useSnackbar();

  const handleEdit = (id: GridRowId) => {
    const user = rows.find((row) => row.id === id);
    if (user) {
      setEditUserId(user.id);
      setEditName(user.name);
      setEditUserSurname(user.surname);
      setEditUserName(user.user_name);

      setEditUserEmail(user.email);
      setEditUserRole(String(user.role_id));
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditUserId(null);
    setEditName("");
    setEditUserSurname("");
    setEditUserName("");

    setEditUserEmail("");
    setEditUserRole("");
  };

  const handleEditSave = () => {
    if (editUserId !== null) {
      axiosInstance.put(`/user`, {
        id: editUserId,
        name: editName,
        surname: editUserSurname,
        user_name: editUserName,
        email: editUserEmail,
        role_id: Number(editUserRole),
      })
        .then((response) => {
          if (response.status === 200) {
            const updatedRows = rows.map((row) => {
              if (row.id === editUserId) {
                return {
                  ...row,
                  name: editName,
                  surname: editUserSurname,
                  email: editUserEmail,
                  user_name: editUserName,
                  role_id: Number(editUserRole),
                };
              }
              return row;
            });
            setRows(updatedRows);
            console.log('User updated successfully!');
            // Snackbar ya da benzeri bir bildirim sistemi kullanabilirsiniz
          } else {
            console.error('User update failed!');
          }
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        })
        .finally(() => {
          handleEditDialogClose();
        });
    }
  };

  const handleDelete = (id: GridRowId) => {
    axiosInstance.delete(`/user`, { data: { id } }) // Doğru endpoint ve data parametresi kullanılıyor
      .then((response) => {
        if (response.status === 200) {
          setRows(rows.filter((row) => row.id !== id));
          openSnackbar('User deleted successfully!', 'success', 'bottom', 'right');
        } else {
          openSnackbar('User delete failed!', 'error', 'bottom', 'right');
        }
      })
      .catch((error) => {
        console.error("User delete failed:", error);
        openSnackbar('User delete failed!', 'error', 'bottom', 'right');
      });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", minWidth: 200 },
    { field: "surname", headerName: "Surname", minWidth: 200 },
    { field: "user_name", headerName: "Username", minWidth: 200 },
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "role_id", headerName: "Role", minWidth: 200 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" justifyContent="space-between" width="100%">
          <IconButton color="warning" onClick={() => handleEdit(params.id)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    axiosInstance.get('/user') // axiosInstance kullanarak backendden veri alıyoruz
      .then((response) => {
        const data = response.data;
        const formattedData = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          surname: user.surname,
          user_name: user.user_name,
          email: user.email,
          role_id: user.role_id,
        }));
        setRows(formattedData);
      })
      .catch((error) => {
        console.error("User get failed:", error);
        openSnackbar('User fetch failed!', 'info', 'bottom', 'right');
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <h3>Users</h3>
      <hr />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnMenu
      />
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new information for the user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Surname"
            type="text"
            fullWidth
            value={editUserSurname}
            onChange={(e) => setEditUserSurname(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={editUserEmail}
            onChange={(e) => setEditUserEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Role"
            type="number"
            fullWidth
            value={editUserRole}
            onChange={(e) => setEditUserRole(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
