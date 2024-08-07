import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import createLocation from '../enpoints/admin'; // Burada doğru yolu belirleyin

interface CreateLocationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Bu prop'u güncellememiz gerekecek
}

const CreateLocationForm: React.FC<CreateLocationFormProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState({
    location_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const newLocation = {
      ...formValues,
    };
    try {
      await createLocation(newLocation);
      onSubmit(newLocation);
      setFormValues({
        location_name: "",
      });
      onClose();
      console.log('Successful creating location:');

    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Location</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="location_name"
          label="Location Name"
          type="text"
          fullWidth
          value={formValues.location_name}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLocationForm;
