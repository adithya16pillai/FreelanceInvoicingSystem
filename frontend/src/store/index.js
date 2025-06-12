import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clientReducer from './slices/clientSlice';
import projectReducer from './slices/projectSlice';
import invoiceReducer from './slices/invoiceSlice';
import dashboardReducer from './slices/dashboardSlice';
import taskReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientReducer,
    projects: projectReducer,
    invoices: invoiceReducer,
    dashboard: dashboardReducer,
    tasks: taskReducer,
  },
});

export default store; 