import { College } from '@/types/college';

export const mockColleges: College[] = [
  {
    id: '1',
    name: 'Tribhuvan University - Institute of Engineering',
    logo_url: '/placeholder.svg',
    location: {
      city: 'Kathmandu',
      district: 'Kathmandu'
    },
    affiliation: 'TU',
    about: 'The Institute of Engineering (IOE) is a constituent campus of Tribhuvan University and is the oldest engineering institution in Nepal. Established in 1972, it offers undergraduate and graduate programs in various engineering disciplines.',
    website: 'https://ioe.edu.np',
    created_at: '2024-01-01',
    programs: [
      {
        id: '1',
        college_id: '1',
        program_name: 'Bachelor of Computer Engineering',
        faculty: 'Engineering',
        duration: 4,
        fees: 500000
      },
      {
        id: '2',
        college_id: '1',
        program_name: 'Bachelor of Civil Engineering',
        faculty: 'Engineering',
        duration: 4,
        fees: 450000
      }
    ],
    facilities: [
      { id: '1', college_id: '1', facility_name: 'Library' },
      { id: '2', college_id: '1', facility_name: 'Lab' },
      { id: '3', college_id: '1', facility_name: 'WiFi' },
      { id: '4', college_id: '1', facility_name: 'Canteen' }
    ],
    reviews: [
      {
        id: '1',
        college_id: '1',
        reviewer_name: 'Rajesh Sharma',
        rating: 4,
        review_text: 'Great engineering college with excellent faculty and infrastructure.',
        source: 'Alumni',
        created_at: '2024-01-15'
      }
    ],
    news: [
      {
        id: '1',
        college_id: '1',
        title: 'Admission Open for Bachelor Programs 2024',
        description: 'Applications are now open for all undergraduate engineering programs.',
        created_at: '2024-01-20'
      }
    ],
    averageRating: 4.2,
    totalReviews: 156
  },
  {
    id: '2',
    name: 'Kathmandu University School of Management',
    logo_url: '/placeholder.svg',
    location: {
      city: 'Dhulikhel',
      district: 'Kavre'
    },
    affiliation: 'KU',
    about: 'KUSOM is the business school of Kathmandu University, offering world-class management education with international standards and practical approach to learning.',
    website: 'https://kusom.edu.np',
    created_at: '2024-01-01',
    programs: [
      {
        id: '3',
        college_id: '2',
        program_name: 'Bachelor of Business Administration (BBA)',
        faculty: 'Management',
        duration: 4,
        fees: 800000
      },
      {
        id: '4',
        college_id: '2',
        program_name: 'Master of Business Administration (MBA)',
        faculty: 'Management',
        duration: 2,
        fees: 1200000
      }
    ],
    facilities: [
      { id: '5', college_id: '2', facility_name: 'Library' },
      { id: '6', college_id: '2', facility_name: 'Hostel' },
      { id: '7', college_id: '2', facility_name: 'WiFi' },
      { id: '8', college_id: '2', facility_name: 'Sports' },
      { id: '9', college_id: '2', facility_name: 'Canteen' }
    ],
    reviews: [
      {
        id: '2',
        college_id: '2',
        reviewer_name: 'Priya Thapa',
        rating: 5,
        review_text: 'Excellent management education with great placement opportunities.',
        source: 'Student',
        created_at: '2024-01-10'
      }
    ],
    news: [
      {
        id: '2',
        college_id: '2',
        title: 'MBA Scholarship Program Announced',
        description: 'Merit-based scholarships available for outstanding MBA candidates.',
        created_at: '2024-01-18'
      }
    ],
    averageRating: 4.5,
    totalReviews: 89
  },
  {
    id: '3',
    name: 'B.P. Koirala Institute of Health Sciences',
    logo_url: '/placeholder.svg',
    location: {
      city: 'Dharan',
      district: 'Sunsari'
    },
    affiliation: 'Purbanchal',
    about: 'BPKIHS is a premier medical institute in Nepal, providing quality medical education and healthcare services with state-of-the-art facilities.',
    website: 'https://bpkihs.edu',
    created_at: '2024-01-01',
    programs: [
      {
        id: '5',
        college_id: '3',
        program_name: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)',
        faculty: 'Medical',
        duration: 6,
        fees: 2500000
      },
      {
        id: '6',
        college_id: '3',
        program_name: 'Bachelor of Dental Surgery (BDS)',
        faculty: 'Medical',
        duration: 5,
        fees: 2000000
      }
    ],
    facilities: [
      { id: '10', college_id: '3', facility_name: 'Library' },
      { id: '11', college_id: '3', facility_name: 'Hostel' },
      { id: '12', college_id: '3', facility_name: 'Lab' },
      { id: '13', college_id: '3', facility_name: 'WiFi' },
      { id: '14', college_id: '3', facility_name: 'Canteen' }
    ],
    reviews: [
      {
        id: '3',
        college_id: '3',
        reviewer_name: 'Dr. Anil Khadka',
        rating: 4,
        review_text: 'One of the best medical colleges in Nepal with excellent clinical exposure.',
        source: 'Alumni',
        created_at: '2024-01-12'
      }
    ],
    news: [
      {
        id: '3',
        college_id: '3',
        title: 'MBBS Entrance Exam Schedule Released',
        description: 'The entrance examination for MBBS admission will be held in March 2024.',
        created_at: '2024-01-22'
      }
    ],
    averageRating: 4.3,
    totalReviews: 203
  }
];

export const faculties = ['Engineering', 'Management', 'Medical', 'Science', 'Humanities', 'Law'] as const;
export const affiliations = ['TU', 'KU', 'PU', 'Purbanchal', 'Pokhara'] as const;