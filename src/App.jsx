import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetails from './pages/PatientDetails'
import AddPatient from './pages/AddPatient'
import MedicalRecords from './pages/MedicalRecords'
import RecordDetails from './pages/RecordDetails'
import AddRecord from './pages/AddRecord'
import EditRecord from './pages/EditRecord'
import Consultations from './pages/Consultations'
import ConsultationDetails from './pages/ConsultationDetails'
import AddConsultation from './pages/AddConsultation'
import MedicalCenters from './pages/MedicalCenters'
import Synchronization from './pages/Synchronization'
import PatientMedicalHistory from './pages/PatientMedicalHistory'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import ActivityLogs from './pages/ActivityLogs'
import Security from './pages/Security'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <NotificationProvider>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard - Accessible à tous les rôles */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist', 'patient']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Patients - Admin, Doctor, Receptionist */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/add"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
            <AddPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
            <PatientDetails />
          </ProtectedRoute>
        }
      />

      {/* Medical Records - Admin, Doctor, Patient */}
      <Route
        path="/records"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
            <MedicalRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/history"
        element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <PatientMedicalHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records/add"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor']}>
            <AddRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor']}>
            <EditRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
            <RecordDetails />
          </ProtectedRoute>
        }
      />

      {/* Consultations - Admin, Doctor, Receptionist */}
      <Route
        path="/consultations"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
            <Consultations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor']}>
            <ConsultationDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/add"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}>
            <AddConsultation />
          </ProtectedRoute>
        }
      />

      {/* System - Distributed - Admin only */}
      <Route
        path="/centers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MedicalCenters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sync"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Synchronization />
          </ProtectedRoute>
        }
      />

      {/* Users - Admin only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'patient']}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Logs & Security - Admin only */}
      <Route
        path="/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Security />
          </ProtectedRoute>
        }
      />

      {/* Settings - Accessible à tous les rôles */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist', 'patient']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/analytics" element={<Navigate to="/dashboard" replace />} />
      <Route path="/help" element={<Navigate to="/settings" replace />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </NotificationProvider>
  )
}

export default App
