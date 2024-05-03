// Import necessary modules
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './AuthContext';
import LoginU from './pages/Login';
import LoginC from './pages/customer/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Newrek from './pages/Newrek';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login-user" element={<LoginU />} />
          <Route path="/login" element={<LoginC />} />
          <Route path="/dashboard-user" element={<Dashboard />} />
          <Route path="/dashboard-user/create" element={<Newrek />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
