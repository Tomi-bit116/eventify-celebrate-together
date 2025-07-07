
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { RSVPForm } from '@/components/RSVPForm';
import Index from '@/pages/Index';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-coral-50 to-teal-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rsvp/:invitationCode" element={<RSVPForm />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
