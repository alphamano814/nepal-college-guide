import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, Clock, Star, Phone, Globe, GraduationCap } from 'lucide-react';

type College = {
  id: string;
  name: string;
  address: string;
  affiliated_university: string;
  description: string;
  phone_number: string;
  website_link?: string;
  image_url?: string;
  programs: any[];
  facilities: string[];
  created_at: string;
};

type Faculty = 'Management' | 'Science' | 'Engineering' | 'Medical' | 'Humanities' | 'Law';
type Affiliation = 'TU' | 'KU' | 'PU' | 'Purbanchal' | 'Pokhara';

const faculties = ['Management', 'Science', 'Engineering', 'Medical', 'Humanities', 'Law'] as const;
const affiliations = ['TU', 'KU', 'PU', 'Purbanchal', 'Pokhara'] as const;

export default function Home() {
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
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setColleges((data || []).map(item => ({
        ...item,
        programs: Array.isArray(item.programs) ? item.programs : []
      })));
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

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = !searchQuery || 
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.programs.some((p: any) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFaculty = selectedFaculties.length === 0 || 
      college.programs.some((p: any) => selectedFaculties.includes(p.faculty));
    
    const matchesAffiliation = selectedAffiliations.length === 0 || 
      selectedAffiliations.includes(college.affiliated_university as Affiliation);
    
    return matchesSearch && matchesFaculty && matchesAffiliation;
  });

  const handleViewDetails = (college: College) => {
    navigate(`/college/${college.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect College in Nepal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Compare programs, fees, facilities, and reviews to make the best choice for your future
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
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Colleges'}
                  </h2>
                  <p className="text-muted-foreground">
                    {loading ? 'Loading...' : `${filteredColleges.length} colleges found`}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">Loading colleges...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredColleges.map((college) => (
                    <Card key={college.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        {college.image_url && (
                          <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                            <img 
                              src={college.image_url} 
                              alt={college.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{college.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <MapPin className="h-4 w-4" />
                                {college.address}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <GraduationCap className="h-4 w-4" />
                                {college.affiliated_university}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {college.phone_number}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {college.description}
                          </p>

                          {/* Programs */}
                          {college.programs.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Programs:</p>
                              <div className="flex flex-wrap gap-1">
                                {college.programs.slice(0, 3).map((program: any, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {program.name} - {program.fee}
                                  </Badge>
                                ))}
                                {college.programs.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{college.programs.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Facilities */}
                          {college.facilities.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Facilities:</p>
                              <div className="flex flex-wrap gap-1">
                                {college.facilities.slice(0, 4).map((facility: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {facility}
                                  </Badge>
                                ))}
                                {college.facilities.length > 4 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{college.facilities.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {college.website_link && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={college.website_link} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => handleViewDetails(college)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && filteredColleges.length === 0 && (
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
              <div className="text-3xl font-bold text-primary mb-2">{colleges.length}+</div>
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