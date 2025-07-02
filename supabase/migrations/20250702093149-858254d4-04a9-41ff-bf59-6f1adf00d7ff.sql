
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  venue TEXT,
  expected_guests INTEGER DEFAULT 0,
  budget DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborators table for shared access
CREATE TABLE public.collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  collaborator_email TEXT NOT NULL,
  collaborator_name TEXT NOT NULL,
  role TEXT DEFAULT 'view-only' CHECK (role IN ('view-only', 'edit')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  invited_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  amount DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whatsapp_messages table for tracking sent messages
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  message_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for guests
CREATE POLICY "Users can view own event guests" ON public.guests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create guests for own events" ON public.guests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own event guests" ON public.guests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own event guests" ON public.guests
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for collaborators
CREATE POLICY "Users can view collaborators for own events" ON public.collaborators
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = invited_by);

CREATE POLICY "Users can create collaborators for own events" ON public.collaborators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update collaborators for own events" ON public.collaborators
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = invited_by);

CREATE POLICY "Users can delete collaborators for own events" ON public.collaborators
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = invited_by);

-- Create RLS policies for vendors
CREATE POLICY "Users can view own event vendors" ON public.vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create vendors for own events" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own event vendors" ON public.vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own event vendors" ON public.vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for whatsapp_messages
CREATE POLICY "Users can view own whatsapp messages" ON public.whatsapp_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own whatsapp messages" ON public.whatsapp_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to get user events
CREATE OR REPLACE FUNCTION get_user_events(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  event_date DATE,
  event_time TIME,
  venue TEXT,
  expected_guests INTEGER,
  budget DECIMAL,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT e.id, e.name, e.description, e.event_date, e.event_time, e.venue, e.expected_guests, e.budget, e.status, e.created_at
  FROM public.events e
  WHERE e.user_id = user_id_param
  ORDER BY e.created_at DESC;
$$;

-- Create function to delete user event (fixed version)
CREATE OR REPLACE FUNCTION delete_user_event(event_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.events 
  WHERE id = event_id_param AND user_id = user_id_param;
  
  RETURN FOUND;
END;
$$;

-- Create function to get event tasks
CREATE OR REPLACE FUNCTION get_event_tasks(event_id_param UUID, user_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  due_date DATE,
  completed BOOLEAN,
  priority TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT t.id, t.title, t.description, t.due_date, t.completed, t.priority, t.created_at
  FROM public.tasks t
  WHERE t.event_id = event_id_param AND t.user_id = user_id_param
  ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC;
$$;
