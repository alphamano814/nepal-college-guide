import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockColleges } from '@/data/mockData';
import { College } from '@/types/college';
import { Search, X, Star, MapPin } from 'lucide-react';

export default function Compare() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredColleges = mockColleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedColleges.find(selected => selected.id === college.id)
  );

  const addCollege = (college: College) => {
    if (selectedColleges.length < 3) {
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
          <p className="text-muted-foreground">Select up to 3 colleges to compare side by side</p>
        </div>

        {/* Add College Section */}
        {selectedColleges.length < 3 && (
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
        {selectedColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <p className="text-sm text-muted-foreground">{college.programs.length} programs available</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Fee Range</h4>
                      <p className="text-sm">{formatFees(min)} - {formatFees(max)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {college.facilities.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {facility.facility_name}
                          </Badge>
                        ))}
                        {college.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{college.facilities.length - 3} more
                          </Badge>
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