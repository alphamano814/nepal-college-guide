export interface College {
  id: string;
  name: string;
  logo_url?: string;
  location: {
    city: string;
    district: string;
  };
  affiliation: 'TU' | 'KU' | 'PU' | 'Purbanchal' | 'Pokhara';
  about: string;
  website?: string;
  phone?: string;
  created_at: string;
  programs: Program[];
  facilities: Facility[];
  reviews: Review[];
  news: NewsItem[];
  averageRating: number;
  totalReviews: number;
}

export interface Program {
  id: string;
  college_id: string;
  program_name: string;
  faculty: 'Management' | 'Science' | 'Engineering' | 'Medical' | 'Humanities' | 'Law';
  duration: number;
  fees: number;
}

export interface Facility {
  id: string;
  college_id: string;
  facility_name: 'Hostel' | 'Library' | 'Transportation' | 'Sports' | 'Lab' | 'Canteen' | 'WiFi' | 'Parking';
}

export interface Review {
  id: string;
  college_id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  source: 'Google' | 'Student' | 'Alumni';
  created_at: string;
}

export interface NewsItem {
  id: string;
  college_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  created_at: string;
}

export type Faculty = Program['faculty'];
export type Affiliation = College['affiliation'];