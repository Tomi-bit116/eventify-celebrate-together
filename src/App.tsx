import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Dashboard } from '@/components/Dashboard';
import { Auth } from '@supabase/ui-react';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from 'sonner';
import { RSVPForm } from '@/components/RSVPForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-coral-50 to-teal-50">
        <Routes>
          <Route
            path="/"
            element={
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: Auth.Theme.default }}
                providers={['google', 'github']}
                redirectTo="/"
              >
                <Dashboard />
              </Auth>
            }
          />
          <Route path="/rsvp/:invitationCode" element={<RSVPForm />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
