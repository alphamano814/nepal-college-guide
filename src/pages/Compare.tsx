import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { College } from '@/types/college';
import { Search, X, Star, MapPin } from 'lucide-react';

export default function Compare() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*');

      if (error) throw error;

      const mappedColleges: College[] = data.map(college => ({
        id: college.id,
        name: college.name,
        logo_url: college.image_url || '',
        location: {
          city: college.address.split(',')[0] || college.address,
          district: college.address.split(',')[1] || 'Unknown'
        },
        affiliation: college.affiliated_university as College['affiliation'],
        about: college.description,
        website: college.website_link || '',
        phone: college.phone_number || '',
        created_at: college.created_at,
        programs: Array.isArray(college.programs) 
          ? (college.programs as any[]).map((program: any, index: number) => ({
              id: `${college.id}-program-${index}`,
              college_id: college.id,
              program_name: program.name || program.program_name || 'Unknown Program',
              faculty: program.faculty || 'Management',
              duration: program.duration || 4,
              fees: program.fees || 0
            }))
          : [],
        facilities: (college.facilities || []).map((facility: string, index: number) => ({
          id: `${college.id}-${index}`,
          college_id: college.id,
          facility_name: facility as any
        })),
        reviews: [],
        news: [],
        averageRating: 4.0,
        totalReviews: 0
      }));

      setAllColleges(mappedColleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = allColleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedColleges.find(selected => selected.id === college.id)
  );

  const addCollege = (college: College) => {
    if (selectedColleges.length < 10) {
      setSelectedColleges([...selectedColleges, college]);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `Rs. ${(amount / 100000).toFixed(1)}L`;
    }
    return `Rs. ${(amount / 1000).toFixed(0)}K`;
  };

  const getMinMaxFees = (college: College) => {
    if (!college.programs || college.programs.length === 0) {
      return { min: 0, max: 0 };
    }
    const fees = college.programs.map(p => p.fees);
    return {
      min: Math.min(...fees),
      max: Math.max(...fees)
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compare Colleges</h1>
          <p className="text-muted-foreground">Select up to 10 colleges to compare side by side</p>
        </div>

        {/* Add College Section */}
        {selectedColleges.length < 10 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add College to Compare</CardTitle>
            </CardHeader>
            <CardContent>
              {!showSearch ? (
                <Button onClick={() => setShowSearch(true)}>
                  <Search className="w-4 h-4 mr-2" />
                  Add College
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Search colleges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {searchQuery && (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredColleges.slice(0, 5).map(college => (
                        <div
                          key={college.id}
                          className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted"
                          onClick={() => addCollege(college)}
                        >
                          <img src={college.logo_url} alt={college.name} className="w-10 h-10 rounded" />
                          <div>
                            <h3 className="font-medium">{college.name}</h3>
                            <p className="text-sm text-muted-foreground">{college.location.city}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {loading ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading colleges...</p>
            </CardContent>
          </Card>
        ) : selectedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {selectedColleges.map(college => {
              const { min, max } = getMinMaxFees(college);
              return (
                <Card key={college.id} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => removeCollege(college.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <img src={college.logo_url} alt={college.name} className="w-12 h-12 rounded" />
                      <div>
                        <CardTitle className="text-lg">{college.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {college.location.city}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Affiliation</h4>
                      <Badge variant="secondary">{college.affiliation}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Rating</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{college.averageRating}</span>
                        <span className="text-sm text-muted-foreground">({college.totalReviews})</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Programs</h4>
                      <p className="text-sm text-muted-foreground">{college.programs?.length || 0} programs available</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Fee Range</h4>
                      <p className="text-sm">
                        {min === 0 && max === 0 ? 'Not specified' : `${formatFees(min)} - ${formatFees(max)}`}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {college.facilities?.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility.facility_name}
                          </Badge>
                        ))}
                        {(college.facilities?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(college.facilities?.length || 0) - 3} more
                          </Badge>
                        )}
                        {(!college.facilities || college.facilities.length === 0) && (
                          <p className="text-sm text-muted-foreground">No facilities listed</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No colleges selected</h3>
              <p className="text-muted-foreground mb-4">Add colleges to start comparing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}