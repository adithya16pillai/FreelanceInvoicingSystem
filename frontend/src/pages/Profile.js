import React, { useEffect, useState } from 'react';
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
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { updateProfile, updatePassword } from '../store/slices/authSlice';

const profileValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  company: Yup.string(),
  phone: Yup.string(),
  address: Yup.string(),
  currency: Yup.string().required('Currency is required'),
  taxRate: Yup.number()
    .min(0, 'Tax rate must be positive')
    .max(100, 'Tax rate cannot exceed 100%'),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
];

function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const profileFormik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
      phone: user?.phone || '',
      address: user?.address || '',
      currency: user?.currency || 'USD',
      taxRate: user?.taxRate || 0,
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      await dispatch(updateProfile(values));
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      await dispatch(updatePassword(values));
      passwordFormik.resetForm();
    },
  });

  useEffect(() => {
    if (user) {
      profileFormik.setValues({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || '',
        address: user.address || '',
        currency: user.currency || 'USD',
        taxRate: user.taxRate || 0,
      });
    }
  }, [user]);

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
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant={activeTab === 'profile' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('profile')}
            sx={{ mr: 1 }}
          >
            Profile Information
          </Button>
          <Button
            variant={activeTab === 'password' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </Button>
        </Box>

        {activeTab === 'profile' ? (
          <form onSubmit={profileFormik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={profileFormik.values.name}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.name &&
                    Boolean(profileFormik.errors.name)
                  }
                  helperText={
                    profileFormik.touched.name && profileFormik.errors.name
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={profileFormik.values.email}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.email &&
                    Boolean(profileFormik.errors.email)
                  }
                  helperText={
                    profileFormik.touched.email && profileFormik.errors.email
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="company"
                  name="company"
                  label="Company Name"
                  value={profileFormik.values.company}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.company &&
                    Boolean(profileFormik.errors.company)
                  }
                  helperText={
                    profileFormik.touched.company && profileFormik.errors.company
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={profileFormik.values.phone}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.phone &&
                    Boolean(profileFormik.errors.phone)
                  }
                  helperText={
                    profileFormik.touched.phone && profileFormik.errors.phone
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  value={profileFormik.values.address}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.address &&
                    Boolean(profileFormik.errors.address)
                  }
                  helperText={
                    profileFormik.touched.address && profileFormik.errors.address
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  id="currency"
                  name="currency"
                  label="Default Currency"
                  value={profileFormik.values.currency}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.currency &&
                    Boolean(profileFormik.errors.currency)
                  }
                  helperText={
                    profileFormik.touched.currency &&
                    profileFormik.errors.currency
                  }
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  label="Default Tax Rate (%)"
                  value={profileFormik.values.taxRate}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.taxRate &&
                    Boolean(profileFormik.errors.taxRate)
                  }
                  helperText={
                    profileFormik.touched.taxRate && profileFormik.errors.taxRate
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        ) : (
          <form onSubmit={passwordFormik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  error={
                    passwordFormik.touched.currentPassword &&
                    Boolean(passwordFormik.errors.currentPassword)
                  }
                  helperText={
                    passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  error={
                    passwordFormik.touched.newPassword &&
                    Boolean(passwordFormik.errors.newPassword)
                  }
                  helperText={
                    passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  error={
                    passwordFormik.touched.confirmPassword &&
                    Boolean(passwordFormik.errors.confirmPassword)
                  }
                  helperText={
                    passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Update Password
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
}

export default Profile; 