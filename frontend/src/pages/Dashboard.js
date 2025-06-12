import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Receipt as InvoiceIcon,
} from '@mui/icons-material';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const [summaryCards, setSummaryCards] = useState([
    {
      title: 'Total Revenue',
      value: '$0',
      icon: <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Active Clients',
      value: '0',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Active Projects',
      value: '0',
      icon: <ProjectIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Pending Invoices',
      value: '0',
      icon: <InvoiceIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: '#ffebee',
    },
  ]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (stats) {
      setSummaryCards([
        {
          title: 'Total Revenue',
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
          color: '#e3f2fd',
        },
        {
          title: 'Active Clients',
          value: stats.activeClients,
          icon: <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
          color: '#e8f5e9',
        },
        {
          title: 'Active Projects',
          value: stats.activeProjects,
          icon: <ProjectIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
          color: '#fff3e0',
        },
        {
          title: 'Pending Invoices',
          value: stats.pendingInvoices,
          icon: <InvoiceIcon sx={{ fontSize: 40, color: 'error.main' }} />,
          color: '#ffebee',
        },
      ]);
    }
  }, [stats]);

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
          Error loading dashboard: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: card.color,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  {card.icon}
                  <Typography variant="h4" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add recent activity list here */}
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            {/* Add revenue chart here */}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Project Status
            </Typography>
            {/* Add project status chart here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 