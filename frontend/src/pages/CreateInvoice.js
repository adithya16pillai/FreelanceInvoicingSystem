import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createInvoice } from '../store/slices/invoiceSlice';
import { fetchClients } from '../store/slices/clientSlice';
import { fetchProjects } from '../store/slices/projectSlice';

const validationSchema = Yup.object({
  client: Yup.string().required('Client is required'),
  project: Yup.string(),
  issueDate: Yup.date().required('Issue date is required'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(Yup.ref('issueDate'), 'Due date must be after issue date'),
  items: Yup.array()
    .of(
      Yup.object({
        description: Yup.string().required('Description is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        rate: Yup.number()
          .required('Rate is required')
          .min(0, 'Rate must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
  taxRate: Yup.number()
    .required('Tax rate is required')
    .min(0, 'Tax rate must be positive')
    .max(100, 'Tax rate cannot exceed 100%'),
  notes: Yup.string(),
});

function CreateInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.invoice);
  const { clients } = useSelector((state) => state.client);
  const { projects } = useSelector((state) => state.project);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchProjects());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      client: '',
      project: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0 }],
      taxRate: 0,
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const invoiceData = {
        ...values,
        subtotal: values.items.reduce(
          (sum, item) => sum + item.quantity * item.rate,
          0
        ),
        tax: (values.items.reduce(
          (sum, item) => sum + item.quantity * item.rate,
          0
        ) * values.taxRate) / 100,
      };
      invoiceData.totalAmount = invoiceData.subtotal + invoiceData.tax;

      await dispatch(createInvoice(invoiceData));
      navigate('/invoices');
    },
  });

  const handleAddItem = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { description: '', quantity: 1, rate: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue('items', newItems);
  };

  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setSelectedClient(clients.find((c) => c._id === clientId));
    formik.setFieldValue('client', clientId);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Invoice
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                id="client"
                name="client"
                label="Client"
                value={formik.values.client}
                onChange={handleClientChange}
                error={formik.touched.client && Boolean(formik.errors.client)}
                helperText={formik.touched.client && formik.errors.client}
              >
                {clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                id="project"
                name="project"
                label="Project (Optional)"
                value={formik.values.project}
                onChange={formik.handleChange}
                error={formik.touched.project && Boolean(formik.errors.project)}
                helperText={formik.touched.project && formik.errors.project}
              >
                <MenuItem value="">None</MenuItem>
                {projects
                  .filter((project) => project.client === formik.values.client)
                  .map((project) => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                id="issueDate"
                name="issueDate"
                label="Issue Date"
                value={formik.values.issueDate}
                onChange={formik.handleChange}
                error={formik.touched.issueDate && Boolean(formik.errors.issueDate)}
                helperText={formik.touched.issueDate && formik.errors.issueDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                id="dueDate"
                name="dueDate"
                label="Due Date"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                helperText={formik.touched.dueDate && formik.errors.dueDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Invoice Items
            </Typography>
            {formik.values.items.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id={`items.${index}.description`}
                    name={`items.${index}.description`}
                    label="Description"
                    value={item.description}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.items?.[index]?.description &&
                      Boolean(formik.errors.items?.[index]?.description)
                    }
                    helperText={
                      formik.touched.items?.[index]?.description &&
                      formik.errors.items?.[index]?.description
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="number"
                    id={`items.${index}.quantity`}
                    name={`items.${index}.quantity`}
                    label="Quantity"
                    value={item.quantity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.items?.[index]?.quantity &&
                      Boolean(formik.errors.items?.[index]?.quantity)
                    }
                    helperText={
                      formik.touched.items?.[index]?.quantity &&
                      formik.errors.items?.[index]?.quantity
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    id={`items.${index}.rate`}
                    name={`items.${index}.rate`}
                    label="Rate"
                    value={item.rate}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.items?.[index]?.rate &&
                      Boolean(formik.errors.items?.[index]?.rate)
                    }
                    helperText={
                      formik.touched.items?.[index]?.rate &&
                      formik.errors.items?.[index]?.rate
                    }
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                    disabled={formik.values.items.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ mt: 2 }}
            >
              Add Item
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                id="taxRate"
                name="taxRate"
                label="Tax Rate (%)"
                value={formik.values.taxRate}
                onChange={formik.handleChange}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="notes"
                name="notes"
                label="Notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/invoices')}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              Create Invoice
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateInvoice; 