import React, { useEffect } from 'react';
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
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchProjectById, deleteProject } from '../store/slices/projectSlice';
import { fetchProjectTasks } from '../store/slices/taskSlice';
import { fetchProjectInvoices } from '../store/slices/invoiceSlice';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProject, loading, error } = useSelector(
    (state) => state.project
  );
  const { tasks } = useSelector((state) => state.task);
  const { invoices } = useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchProjectTasks(id));
    dispatch(fetchProjectInvoices(id));
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await dispatch(deleteProject(id));
      navigate('/projects');
    }
  };

  const handleAddTask = () => {
    navigate(`/tasks/new?projectId=${id}`);
  };

  const handleAddInvoice = () => {
    navigate(`/invoices/new?projectId=${id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'on-hold':
        return 'error';
      default:
        return 'default';
    }
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
          Error loading project: {error}
        </Typography>
      </Container>
    );
  }

  if (!selectedProject) {
    return (
      <Container>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Project not found
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
            Project Details
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
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Name"
                      secondary={selectedProject.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Client"
                      secondary={selectedProject.client?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          label={selectedProject.status}
                          color={getStatusColor(selectedProject.status)}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timeline
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Start Date"
                      secondary={new Date(
                        selectedProject.startDate
                      ).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="End Date"
                      secondary={new Date(
                        selectedProject.endDate
                      ).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Budget"
                      secondary={`$${selectedProject.budget}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedProject.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tasks Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Tasks</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Box>
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task._id}
                button
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                <ListItemText
                  primary={task.title}
                  secondary={task.description}
                />
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  size="small"
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
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
}

export default ProjectDetails; 