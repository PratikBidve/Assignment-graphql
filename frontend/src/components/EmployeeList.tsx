import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Fab,
  Snackbar,
  TablePagination,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMPLOYEES } from '../graphql/queries';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../graphql/mutations';
import EmployeeForm, { EmployeeFormValues } from './EmployeeForm';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Employee {
  id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
}

const EmployeeList: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      page: page + 1,
      limit: rowsPerPage,
      sortBy,
      sortOrder,
      filter: search ? { name: search } : undefined,
    },
    fetchPolicy: 'network-only',
    onError: (error) => {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    },
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Employee added!', severity: 'success' });
      setAddOpen(false);
      refetch();
    },
    onError: (error) => setSnackbar({ open: true, message: error.message, severity: 'error' }),
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Employee updated!', severity: 'success' });
      setEditEmployee(null);
      refetch();
    },
    onError: (error) => setSnackbar({ open: true, message: error.message, severity: 'error' }),
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => {
      setSnackbar({ open: true, message: 'Employee deleted!', severity: 'success' });
      refetch();
    },
    onError: (error) => setSnackbar({ open: true, message: error.message, severity: 'error' }),
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'grid' | 'list'
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
  };

  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Delete employee ${employee.name}?`)) {
      deleteEmployee({ variables: { id: employee.id } });
    }
  };

  const handleAdd = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleEditClose = () => setEditEmployee(null);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleAddSubmit = (values: EmployeeFormValues) => {
    createEmployee({ variables: { input: values } });
  };

  const handleEditSubmit = (values: EmployeeFormValues) => {
    if (editEmployee) {
      updateEmployee({ variables: { id: editEmployee.id, input: values } });
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as 'ASC' | 'DESC');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setPage(0);
        refetch();
      }, 400)
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error: {error.message}
      </Alert>
    );
  }

  if (!data?.employees?.length) {
    return (
      <Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          No employees found.
        </Alert>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleAdd}>
          <AddIcon />
        </Fab>
        <EmployeeForm open={addOpen} onClose={handleAddClose} onSubmit={handleAddSubmit} />
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} message={snackbar.message} />
      </Box>
    );
  }

  const renderGrid = () => (
    <Grid container spacing={3}>
      {data.employees.map((employee: Employee) => (
        <Box
          key={employee.id}
          sx={{
            gridColumn: {
              xs: 'span 12',
              sm: 'span 6',
              md: 'span 4',
              lg: 'span 3',
            },
            display: 'flex',
          }}
        >
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              position: 'relative',
              flex: 1,
              '&:hover': { boxShadow: 8 },
              background: 'linear-gradient(135deg, #f4f6fb 60%, #e0e7ff 100%)',
            }}
            onClick={() => handleEmployeeClick(employee)}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {employee.name}
              </Typography>
              <Typography color="textSecondary">Age: {employee.age}</Typography>
              <Typography color="textSecondary">Class: {employee.class}</Typography>
              <Typography color="textSecondary">Attendance: {employee.attendance}%</Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton size="small" onClick={e => { e.stopPropagation(); handleEdit(employee); }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={e => e.stopPropagation()}>
                  <FlagIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); handleDelete(employee); }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Grid>
  );

  const renderList = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Subjects</TableCell>
            <TableCell>Attendance</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.employees.map((employee: Employee) => (
            <TableRow
              key={employee.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => handleEmployeeClick(employee)}
            >
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.age}</TableCell>
              <TableCell>{employee.class}</TableCell>
              <TableCell>{employee.subjects.join(', ')}</TableCell>
              <TableCell>{employee.attendance}%</TableCell>
              <TableCell>
                <IconButton size="small" onClick={e => { e.stopPropagation(); handleEdit(employee); }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={e => e.stopPropagation()}>
                  <FlagIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); handleDelete(employee); }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={handleSortByChange}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="age">Age</MenuItem>
              <MenuItem value="class">Class</MenuItem>
              <MenuItem value="attendance">Attendance</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Order</InputLabel>
            <Select value={sortOrder} label="Order" onChange={handleSortOrderChange}>
              <MenuItem value="ASC">Ascending</MenuItem>
              <MenuItem value="DESC">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {view === 'grid' ? renderGrid() : renderList()}
      <TablePagination
        component="div"
        count={data?.employees.length === rowsPerPage ? (page + 2) * rowsPerPage : (page + 1) * rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[4, 8, 16, 32]}
        sx={{ mt: 2, borderRadius: 3, background: 'rgba(255,255,255,0.85)', boxShadow: 2 }}
      />
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleAdd}>
        <AddIcon />
      </Fab>
      <EmployeeForm open={addOpen} onClose={handleAddClose} onSubmit={handleAddSubmit} />
      <EmployeeForm
        open={!!editEmployee}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        initialValues={editEmployee ? {
          name: editEmployee.name,
          age: editEmployee.age,
          class: editEmployee.class,
          subjects: editEmployee.subjects,
          attendance: editEmployee.attendance,
        } : undefined}
        isEdit
      />
      <Dialog
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedEmployee && (
          <>
            <DialogTitle>{selectedEmployee.name}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <Typography variant="subtitle1">Age</Typography>
                  <Typography>{selectedEmployee.age}</Typography>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                  <Typography variant="subtitle1">Class</Typography>
                  <Typography>{selectedEmployee.class}</Typography>
                </Box>
                <Box sx={{ width: '100%', p: 1 }}>
                  <Typography variant="subtitle1">Subjects</Typography>
                  <Typography>
                    {selectedEmployee.subjects.join(', ')}
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', p: 1 }}>
                  <Typography variant="subtitle1">Attendance</Typography>
                  <Typography>{selectedEmployee.attendance}%</Typography>
                </Box>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEmployee(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default EmployeeList;