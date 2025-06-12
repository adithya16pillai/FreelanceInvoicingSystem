import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchClientById, deleteClient } from '../store/slices/clientSlice';
import { fetchClientProjects } from '../store/slices/projectSlice';
import { fetchClientInvoices } from '../store/slices/invoiceSlice';

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedClient, loading, error } = useSelector((state) => state.client);
  const { projects } = useSelector((state) => state.project);
  const { invoices } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(fetchClientById(id));
    dispatch(fetchClientProjects(id));
    dispatch(fetchClientInvoices(id));
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/clients/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await dispatch(deleteClient(id));
      navigate('/clients');
    }
  };

  const handleAddProject = () => {
    navigate(`/projects/new?clientId=${id}`);
  };

  const handleAddInvoice = () => {
    navigate(`/invoices/new?clientId=${id}`);
  };

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          Error loading client: {error}
        </Typography>
      </Container>
    );
  }

  if (!selectedClient) {
    return (
      <Container>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Client not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h1">
            Client Details
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={selectedClient.name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={selectedClient.email}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Phone"
                  secondary={selectedClient.phone}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Company"
                  secondary={selectedClient.company}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={selectedClient.address}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Notes"
                  secondary={selectedClient.notes}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Projects Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Projects</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
            >
              Add Project
            </Button>
          </Box>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project._id}
                button
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <ListItemText
                  primary={project.name}
                  secondary={project.description}
                />
                <Chip
                  label={project.status}
                  color={
                    project.status === 'completed'
                      ? 'success'
                      : project.status === 'in-progress'
                      ? 'warning'
                      : 'default'
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Invoices Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Invoices</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddInvoice}
            >
              Create Invoice
            </Button>
          </Box>
          <List>
            {invoices.map((invoice) => (
              <ListItem
                key={invoice._id}
                button
                onClick={() => navigate(`/invoices/${invoice._id}`)}
              >
                <ListItemText
                  primary={`Invoice #${invoice.invoiceNumber}`}
                  secondary={`Amount: $${invoice.totalAmount}`}
                />
                <Chip
                  label={invoice.status}
                  color={
                    invoice.status === 'paid'
                      ? 'success'
                      : invoice.status === 'pending'
                      ? 'warning'
                      : 'error'
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
}

export default ClientDetails; 