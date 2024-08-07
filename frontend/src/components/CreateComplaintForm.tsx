import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState, useRef} from "react";
import { createComplaint, getLocations } from "../enpoints/auth";
import SnackbarProvider, { useSnackbar } from './SnackbarProvider';
import { useNavigate } from 'react-router-dom';
import { ReturnTokenPayload } from "../utilities/jwt";


interface CreateComplaintFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  locationId: string | null;
  nextId: number;
}

interface Location {
  id: number;
  location: string;
}

interface JwtPayload {
  user_id: number;
}

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const CreateComplaintForm: React.FC<CreateComplaintFormProps> = ({
  open,
  onClose,
  onSubmit,
  locationId,
  nextId,
}) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState({
    id: nextId.toString(),
    complaint: "",
    location_id: locationId || "",
    photo_url: [] as string[],
  });
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    getLocations()
      .then((data: Location[]) => {
        setLocations(data);
      })
      .catch((error: Error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      id: nextId.toString(),
      location_id: locationId || "",
    }));
  }, [nextId, locationId]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormValues((prev) => ({ ...prev, location_id: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(urls)
        .then((results) => {
          setFormValues((prev) => ({
            ...prev,
            photo_url: results,
          }));
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };

  const handleSubmit = () => {
    const token = getCookie('token');
    const tokenPayload = token ? ReturnTokenPayload(token) : null;
    const userId = tokenPayload ? tokenPayload.user_id : null;
    console.log(userId);
    
    if (!userId) {
      openSnackbar('User ID not found!', 'error', 'bottom', 'right');
      return;
    }
    const newComplaint = {
      ...formValues,
      created_at: new Date().toISOString(),
    };
    onSubmit(newComplaint);
    setFormValues({
      id: nextId.toString(),
      complaint: "",
      location_id: locationId || "",
      photo_url: [],
    });
    onClose();
    const createComplaintData = {
      id: nextId.toString(),
      location_id: parseInt(formValues.location_id, 10),
      complaint: formValues.complaint,
      photo_url: formValues.photo_url,
      user_id: userId,
      // assigned_user_id: 2, // Mock value
      status_id: 1 // Mock value
    };
    console.log(createComplaintData);
    createComplaint(createComplaintData)
      .then((createComplaintData: any) => { 
        console.log(createComplaintData);
        if (createComplaintData.status === true) {
          openSnackbar('Create complaint is a success!', 'success', 'bottom', 'right');
          navigate('/customer');
        }  
      })
      .catch((error: Error) => {
        openSnackbar('Create complaint is not a success!', 'info', 'bottom', 'right');
        console.log("Complaint creation failed:", error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Complaint</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" disabled={!!locationId}>
          <InputLabel>Location</InputLabel>
          <Select
            name="location_id"
            value={formValues.location_id}
            onChange={handleSelectChange}
            disabled={!!locationId}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id.toString()}>
                {location.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="complaint"
          label="Complaint"
          type="text"
          fullWidth
          value={formValues.complaint}
          onChange={handleTextFieldChange}
        />
        <Input type="file" onChange={handleFileChange} fullWidth inputProps={{ multiple: true }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateComplaintForm;
