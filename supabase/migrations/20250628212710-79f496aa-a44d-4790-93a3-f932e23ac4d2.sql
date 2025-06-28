
-- Drop the existing policy first
DROP POLICY "Users can view own profile" ON public.profiles;

-- Create the new policy with the correct syntax
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);
