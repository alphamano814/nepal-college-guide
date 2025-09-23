-- Create storage bucket for college images
INSERT INTO storage.buckets (id, name, public)
VALUES ('college-images', 'college-images', true);

-- Create RLS policies for college images bucket
CREATE POLICY "College images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'college-images');

CREATE POLICY "Admin can upload college images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'college-images' AND
  (auth.jwt() ->> 'email') = 'prabinpokhrel234@gmail.com'
);

CREATE POLICY "Admin can update college images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'college-images' AND
  (auth.jwt() ->> 'email') = 'prabinpokhrel234@gmail.com'
);

CREATE POLICY "Admin can delete college images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'college-images' AND
  (auth.jwt() ->> 'email') = 'prabinpokhrel234@gmail.com'
);