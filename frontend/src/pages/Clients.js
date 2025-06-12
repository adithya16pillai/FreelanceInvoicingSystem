import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { fetchClients, deleteClient } from '../store/slices/clientSlice';

function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading, error } = useSelector((state) => state.client);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleViewClient = (id) => {
    navigate(`/clients/${id}`);
  };

  const handleEditClient = (id) => {
    navigate(`/clients/${id}/edit`);
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await dispatch(deleteClient(id));
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'company', headerName: 'Company', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleViewClient(params.row._id)}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEditClient(params.row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClient(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredClients = clients.filter((client) =>
    Object.values(client).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography>Loading clients...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          Error loading clients: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h1">
            Clients
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredClients}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row._id}
          />
        </div>
      </Paper>
    </Container>
  );
}

export default Clients; 