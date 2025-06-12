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
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { fetchInvoices, deleteInvoice } from '../store/slices/invoiceSlice';

function Invoices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error } = useSelector((state) => state.invoice);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddInvoice = () => {
    navigate('/invoices/new');
  };

  const handleViewInvoice = (id) => {
    navigate(`/invoices/${id}`);
  };

  const handleEditInvoice = (id) => {
    navigate(`/invoices/${id}/edit`);
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await dispatch(deleteInvoice(id));
    }
  };

  const handleDownloadPDF = (id) => {
    // Implement PDF download functionality
    console.log('Downloading PDF for invoice:', id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    { field: 'invoiceNumber', headerName: 'Invoice #', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'issueDate', headerName: 'Issue Date', flex: 1 },
    { field: 'dueDate', headerName: 'Due Date', flex: 1 },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleViewInvoice(params.row._id)}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEditInvoice(params.row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleDownloadPDF(params.row._id)}
          >
            <PdfIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteInvoice(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filteredInvoices = invoices.filter((invoice) =>
    Object.values(invoice).some(
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
        <Typography>Loading invoices...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" sx={{ mt: 4 }}>
          Error loading invoices: {error}
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
            Invoices
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddInvoice}
          >
            Create Invoice
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search invoices..."
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
            rows={filteredInvoices}
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

export default Invoices; 