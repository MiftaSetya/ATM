// Import necessary modules
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './AuthContext';
import LoginU from './pages/Login';
import LoginC from './pages/customer/Login';
import DashboardU from './pages/Dashboard';
import DashboardC from './pages/customer/Dashboard';
import NotFound from './pages/NotFound';
import Newrek from './pages/Newrek';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' to='/dashboard'/>
          <Route path="/login-user" element={<LoginU />} />
          <Route path="/login" element={<LoginC />} />
          <Route path="/dashboard-user" element={<DashboardU />} />
          <Route path="/dashboard" element={<DashboardC />} />
          <Route path="/dashboard-user/create" element={<Newrek />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
