-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  affiliated_university TEXT NOT NULL,
  description TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  website_link TEXT,
  image_url TEXT,
  programs JSONB DEFAULT '[]'::jsonb,
  facilities TEXT[] DEFAULT ARRAY[]::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Colleges are viewable by everyone" 
ON public.colleges 
FOR SELECT 
USING (true);

-- Create policy for admin insert/update/delete (only for specific email)
CREATE POLICY "Admin can manage colleges" 
ON public.colleges 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'prabinpokhrel234@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'prabinpokhrel234@gmail.com');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_colleges_updated_at
    BEFORE UPDATE ON public.colleges
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();