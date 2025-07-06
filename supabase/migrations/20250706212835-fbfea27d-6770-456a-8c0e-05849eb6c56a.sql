
-- Create invitations table to track unique invitation links
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  is_active BOOLEAN DEFAULT true
);

-- Create RSVPs table to store guest responses
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  rsvp_status TEXT NOT NULL CHECK (rsvp_status IN ('yes', 'no', 'maybe')),
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Users can create invitations for their own events
CREATE POLICY "Users can create invitations for own events" 
  ON public.invitations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Users can view invitations for their own events
CREATE POLICY "Users can view invitations for own events" 
  ON public.invitations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Users can update invitations for their own events
CREATE POLICY "Users can update invitations for own events" 
  ON public.invitations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Add Row Level Security (RLS) for RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Anyone can insert RSVPs (for public invitation responses)
CREATE POLICY "Anyone can create RSVPs" 
  ON public.rsvps 
  FOR INSERT 
  WITH CHECK (true);

-- Users can view RSVPs for their own events
CREATE POLICY "Users can view RSVPs for own events" 
  ON public.rsvps 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Users can update RSVPs for their own events
CREATE POLICY "Users can update RSVPs for own events" 
  ON public.rsvps 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = event_id AND user_id = auth.uid()
    )
  );

-- Create function to generate unique invitation codes
CREATE OR REPLACE FUNCTION public.generate_invitation_link(event_id_param UUID, user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_code TEXT;
  invitation_id UUID;
BEGIN
  -- Generate a unique code
  invitation_code := encode(gen_random_bytes(16), 'base64url');
  
  -- Insert the invitation record
  INSERT INTO public.invitations (event_id, user_id, invitation_code)
  VALUES (event_id_param, user_id_param, invitation_code)
  RETURNING id INTO invitation_id;
  
  -- Return the invitation code
  RETURN invitation_code;
END;
$$;

-- Create function to get RSVP stats for an event
CREATE OR REPLACE FUNCTION public.get_rsvp_stats(event_id_param UUID, user_id_param UUID)
RETURNS TABLE(total_rsvps BIGINT, yes_count BIGINT, no_count BIGINT, maybe_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) as total_rsvps,
    COUNT(*) FILTER (WHERE rsvp_status = 'yes') as yes_count,
    COUNT(*) FILTER (WHERE rsvp_status = 'no') as no_count,
    COUNT(*) FILTER (WHERE rsvp_status = 'maybe') as maybe_count
  FROM public.rsvps r
  WHERE r.event_id = event_id_param
  AND EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = event_id_param AND e.user_id = user_id_param
  );
$$;
