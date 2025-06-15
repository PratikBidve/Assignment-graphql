import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Chip, Stack } from '@mui/material';

export interface EmployeeFormValues {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
}

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: EmployeeFormValues) => void;
  initialValues?: EmployeeFormValues;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, initialValues, isEdit }) => {
  const [values, setValues] = useState<EmployeeFormValues>(initialValues || {
    name: '',
    age: 18,
    class: '',
    subjects: [],
    attendance: 100,
  });
  const [subjectInput, setSubjectInput] = useState('');

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleAddSubject = () => {
    if (subjectInput && !values.subjects.includes(subjectInput)) {
      setValues({ ...values, subjects: [...values.subjects, subjectInput] });
      setSubjectInput('');
    }
  };

  const handleDeleteSubject = (subject: string) => {
    setValues({ ...values, subjects: values.subjects.filter(s => s !== subject) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...values, age: Number(values.age), attendance: Number(values.attendance) });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Age"
            name="age"
            type="number"
            value={values.age}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, max: 120 }}
          />
          <TextField
            margin="normal"
            label="Class"
            name="class"
            value={values.class}
            onChange={handleChange}
            fullWidth
            required
          />
          <Box mt={2} mb={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Add Subject"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubject(); } }}
                size="small"
              />
              <Button onClick={handleAddSubject} variant="outlined">Add</Button>
            </Stack>
            <Box mt={1}>
              {values.subjects.map(subject => (
                <Chip
                  key={subject}
                  label={subject}
                  onDelete={() => handleDeleteSubject(subject)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
          <TextField
            margin="normal"
            label="Attendance (%)"
            name="attendance"
            type="number"
            value={values.attendance}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, max: 100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{isEdit ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeForm;
