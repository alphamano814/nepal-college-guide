import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { CollegeCard } from '@/components/ui/college-card';
import { supabase } from '@/integrations/supabase/client';
import { College, Faculty, Affiliation } from '@/types/college';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, Clock, Star } from 'lucide-react';

export default function Colleges() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculties, setSelectedFaculties] = useState<Faculty[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<Affiliation[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedColleges: College[] = (data as any[]).map((college: any) => ({
        id: college.id,
        name: college.name,
        logo_url: college.image_url || undefined,
        location: {
          city: college.address.split(',')[0]?.trim() || '',
          district: college.address.split(',')[1]?.trim() || ''
        },
        affiliation: college.affiliated_university as Affiliation,
        about: college.description,
        website: college.website_link,
        phone: college.phone_number,
        created_at: college.created_at,
        programs: college.programs || [],
        facilities: (college.facilities || []).map((facility: string, index: number) => ({
          id: `${college.id}-facility-${index}`,
          college_id: college.id,
          facility_name: facility as any
        })),
        reviews: [],
        news: [],
        averageRating: 4.5,
        totalReviews: 10
      }));

      setColleges(mappedColleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFacultyToggle = (faculty: Faculty) => {
    setSelectedFaculties(prev => 
      prev.includes(faculty) 
        ? prev.filter(f => f !== faculty)
        : [...prev, faculty]
    );
  };

  const handleAffiliationToggle = (affiliation: Affiliation) => {
    setSelectedAffiliations(prev => 
      prev.includes(affiliation) 
        ? prev.filter(a => a !== affiliation)
        : [...prev, affiliation]
    );
  };

  const handleSaveCollege = (college: College) => {
    setSavedColleges(prev => 
      prev.includes(college.id) 
        ? prev.filter(id => id !== college.id)
        : [...prev, college.id]
    );
  };

  const handleViewDetails = (college: College) => {
    navigate(`/college/${college.id}`);
  };

  const filteredColleges = colleges.filter(college => {
    const searchLower = searchQuery.toLowerCase();
    
    // Debug logging
    if (searchQuery) {
      console.log('Searching for:', searchQuery);
      console.log('College:', college.name);
      console.log('City:', college.location?.city);
      console.log('District:', college.location?.district);
      console.log('Address from DB:', college);
    }
    
    const matchesSearch = !searchQuery || 
      (college.name?.toLowerCase() || '').includes(searchLower) ||
      (college.location?.city?.toLowerCase() || '').includes(searchLower) ||
      (college.location?.district?.toLowerCase() || '').includes(searchLower) ||
      (college.about?.toLowerCase() || '').includes(searchLower) ||
      (college.affiliation?.toLowerCase() || '').includes(searchLower) ||
      college.programs?.some(p => 
        (p.program_name?.toLowerCase() || '').includes(searchLower) ||
        (p.faculty?.toLowerCase() || '').includes(searchLower) ||
        p.fees?.toString().includes(searchQuery)
      ) ||
      college.facilities?.some(f => 
        (f.facility_name?.toLowerCase() || '').includes(searchLower)
      );
    
    const matchesFaculty = selectedFaculties.length === 0 || 
      college.programs?.some(p => selectedFaculties.includes(p.faculty));
    
    const matchesAffiliation = selectedAffiliations.length === 0 || 
      selectedAffiliations.includes(college.affiliation);
    
    return matchesSearch && matchesFaculty && matchesAffiliation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              All Colleges in Nepal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover and compare colleges across Nepal to find your perfect match
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search colleges, programs, or locations..."
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending: Engineering
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Star className="w-4 h-4 mr-1" />
                Top Rated: Medical
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Clock className="w-4 h-4 mr-1" />
                Admission Open
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Filter Colleges</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterChips
                    selectedFaculties={selectedFaculties}
                    selectedAffiliations={selectedAffiliations}
                    onFacultyToggle={handleFacultyToggle}
                    onAffiliationToggle={handleAffiliationToggle}
                  />
                  
                  {(selectedFaculties.length > 0 || selectedAffiliations.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedFaculties([]);
                        setSelectedAffiliations([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Colleges'}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredColleges.length} colleges found
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <div className="col-span-2 text-center py-12">
                    <div className="text-lg text-muted-foreground">Loading colleges...</div>
                  </div>
                ) : (
                  filteredColleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      onViewDetails={handleViewDetails}
                      onSave={handleSaveCollege}
                      isSaved={savedColleges.includes(college.id)}
                    />
                  ))
                )}
              </div>

              {filteredColleges.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No colleges found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Colleges Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Programs Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">75+</div>
              <div className="text-muted-foreground">Districts Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}