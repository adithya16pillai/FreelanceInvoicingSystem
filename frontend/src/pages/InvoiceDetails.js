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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { fetchInvoiceById, deleteInvoice } from '../store/slices/invoiceSlice';

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedInvoice, loading, error } = useSelector(
    (state) => state.invoice
  );

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/invoices/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await dispatch(deleteInvoice(id));
      navigate('/invoices');
    }
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF for invoice:', id);
  };

  const handleSendEmail = () => {
    // Implement email sending functionality
    console.log('Sending email for invoice:', id);
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
          Error loading invoice: {error}
        </Typography>
      </Container>
    );
  }

  if (!selectedInvoice) {
    return (
      <Container>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Invoice not found
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
            Invoice Details
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
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleDownloadPDF}
              sx={{ mr: 1 }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleSendEmail}
              sx={{ mr: 1 }}
            >
              Send Email
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
                  Invoice Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Invoice Number"
                      secondary={selectedInvoice.invoiceNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          label={selectedInvoice.status}
                          color={getStatusColor(selectedInvoice.status)}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Issue Date"
                      secondary={new Date(
                        selectedInvoice.issueDate
                      ).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Due Date"
                      secondary={new Date(
                        selectedInvoice.dueDate
                      ).toLocaleDateString()}
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
                  Client Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Client Name"
                      secondary={selectedInvoice.client?.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={selectedInvoice.client?.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={selectedInvoice.client?.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Address"
                      secondary={selectedInvoice.client?.address}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Items
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInvoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.rate.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1">Subtotal</Typography>
                  </TableCell>
                  <TableCell align="right">
                    ${selectedInvoice.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1">Tax</Typography>
                  </TableCell>
                  <TableCell align="right">
                    ${selectedInvoice.tax.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    ${selectedInvoice.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {selectedInvoice.notes && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Typography variant="body1">{selectedInvoice.notes}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default InvoiceDetails; 