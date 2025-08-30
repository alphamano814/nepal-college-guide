import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { CollegeCard } from '@/components/ui/college-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockColleges } from '@/data/mockData';
import { College, Faculty, Affiliation } from '@/types/college';
import { MapPin } from 'lucide-react';

export default function Colleges() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculties, setSelectedFaculties] = useState<Faculty[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<Affiliation[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);

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

  const filteredColleges = mockColleges.filter(college => {
    const matchesSearch = !searchQuery || 
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.programs.some(p => p.program_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFaculty = selectedFaculties.length === 0 || 
      college.programs.some(p => selectedFaculties.includes(p.faculty));
    
    const matchesAffiliation = selectedAffiliations.length === 0 || 
      selectedAffiliations.includes(college.affiliation);
    
    return matchesSearch && matchesFaculty && matchesAffiliation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Section */}
      <section className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              All Colleges in Nepal
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Discover and compare colleges across Nepal
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search colleges, programs, or locations..."
              />
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
                {filteredColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onViewDetails={handleViewDetails}
                    onSave={handleSaveCollege}
                    isSaved={savedColleges.includes(college.id)}
                  />
                ))}
              </div>

              {filteredColleges.length === 0 && (
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
    </div>
  );
}