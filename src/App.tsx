
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';
import { Toaster } from 'sonner';
import { RSVPForm } from '@/components/RSVPForm';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-coral-50 to-teal-50">
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard userId={user.id} /> : <div>Please sign in</div>}
          />
          <Route path="/rsvp/:invitationCode" element={<RSVPForm />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
