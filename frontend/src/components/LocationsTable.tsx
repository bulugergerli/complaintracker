import React, { useState, useEffect, forwardRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Slide,
} from "@mui/material";
import { getLocations } from '../enpoints/auth';
import axiosInstance from "../enpoints/axiosConfig"; // axiosInstance'ı import ediyoruz
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import { TransitionProps } from "@mui/material/transitions";

// Define the expected data type
interface LocationRow {
  id: number;
  location: string;
}

const initialRows: LocationRow[] = [
  { id: 1, location: "2F Bathroom" },
  { id: 2, location: "3F Admin" },
  { id: 3, location: "1F Lobby" },
  // TODO: get rows from get location endpoint
];

// Define the Transition component properly
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LocationsTable = () => {
  const [rows, setRows] = useState<LocationRow[]>(initialRows);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLocationId, setEditLocationId] = useState<number | null>(null);
  const [editLocationName, setEditLocationName] = useState("");
  const [openDialogs, setOpenDialogs] = useState<Record<GridRowId, boolean>>({});


  useEffect(() => {
    getLocations()
      .then((data: LocationRow[]) => {
        setRows(data);
      })
      .catch((error: Error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const handleEdit = (id: GridRowId) => {
    const location = rows.find((row) => row.id === id);
    if (location) {
      setEditLocationId(location.id);
      setEditLocationName(location.location);
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditLocationId(null);
    setEditLocationName("");
  };

  const handleEditSave = () => {
    if (editLocationId !== null) {
      axiosInstance.put(`/location`, { id: editLocationId, location: editLocationName })
        .then((response) => {
          if (response.status === 200) {
            setRows(rows.map((row) => (row.id === editLocationId ? { ...row, location: editLocationName } : row)));
            console.log('Location updated successfully!');
            // Snackbar ya da benzeri bir bildirim sistemi kullanabilirsiniz
          } else {
            console.error('Location update failed!');
          }
        })
        .catch((error) => {
          console.error("Error updating location:", error);
        })
        .finally(() => {
          handleEditDialogClose();
        });
    }
  };

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
  const handleDelete = (id: GridRowId) => {
    axiosInstance.delete(`/location`, { data: { id } })
      .then((response) => {
        if (response.status === 200) {
          setRows(rows.filter((row) => row.id !== id));
          console.log('Location deleted successfully!');
          // Snackbar ya da benzeri bir bildirim sistemi kullanabilirsiniz
        } else {
          console.error('Location delete failed!');
        }
      })
      .catch((error) => {
        console.error("Error deleting location:", error);
      });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    { field: "location", headerName: "Location", minWidth: 200 },
    {
      field: 'qr',
      headerName: 'QR',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton color="primary" onClick={() => handleQR(params)}>
            <VisibilityIcon />
          </IconButton>
          <Dialog
            open={!!openDialogs[params.id]}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => handleCloseQR(params.id)}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{`${params.row.location}`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <img src={`data:image/png;base64,${params.row.qr}`} />
                <br />
                {/* <a href={`data:image/png;base64,${params.row.qr}`} download="image.png">
                  <button>Download Image</button>
                </a> */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDownloadQR(`data:image/png;base64,${params.row.qr}`)}>
                Download Image
              </Button>
              <Button onClick={() => handleCloseQR(params.id)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      ),
    },
    {
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
    },
  ];

  return (
    <div>
      <h3>Locations</h3>
      <hr />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        disableColumnMenu
      />
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Location</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new name for the location.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Location Name"
            type="text"
            fullWidth
            value={editLocationName}
            onChange={(e) => setEditLocationName(e.target.value)}
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

export default LocationsTable;
