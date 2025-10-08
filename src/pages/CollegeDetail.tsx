import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, MapPin, Star, Heart, Share2, Globe, Phone, Mail } from 'lucide-react';
import { College } from '@/types/college';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';

export default function CollegeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCollegeDetails();
    }
  }, [id]);

  const fetchCollegeDetails = async () => {
    try {
      console.log('Fetching college with ID:', id);
      const { data, error } = await (supabase as any)
        .from('colleges')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log('Query result:', { data, error });

      if (error) throw error;

      if (data) {
        const mappedCollege: College = {
          id: data.id,
          name: data.name,
          logo_url: data.image_url || 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200&h=200&fit=crop&crop=center',
          location: {
            city: data.address.split(',')[0]?.trim() || '',
            district: data.address.split(',')[1]?.trim() || ''
          },
          affiliation: data.affiliated_university,
          about: data.description,
          website: data.website_link,
          phone: data.phone_number,
          created_at: data.created_at,
          programs: data.programs || [],
          facilities: (data.facilities || []).map((facility: string, index: number) => ({
            id: `${data.id}-facility-${index}`,
            college_id: data.id,
            facility_name: facility
          })),
          reviews: [],
          news: [],
          averageRating: 4.2,
          totalReviews: 156
        };
        setCollege(mappedCollege);
      }
    } catch (error) {
      console.error('Error fetching college details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch college details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading college details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">College Not Found</h1>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const getAffiliationColor = (affiliation: string) => {
    const colors = {
      'TU': 'bg-blue-100 text-blue-800 border-blue-200',
      'KU': 'bg-green-100 text-green-800 border-green-200', 
      'PU': 'bg-purple-100 text-purple-800 border-purple-200',
      'Purbanchal': 'bg-orange-100 text-orange-800 border-orange-200',
      'Pokhara': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[affiliation as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatFees = (amount: string | number) => {
    if (typeof amount === 'string') {
      return amount;
    }
    if (amount >= 100000) {
      return `Rs. ${(amount / 100000).toFixed(1)}L`;
    }
    return `Rs. ${(amount / 1000).toFixed(0)}K`;
  };

  const collegeStructuredData = college ? {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "description": college.about,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": college.location.city,
      "addressRegion": college.location.district,
      "addressCountry": "NP"
    },
    "url": college.website,
    "telephone": college.phone,
    "aggregateRating": college.totalReviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": college.averageRating,
      "reviewCount": college.totalReviews,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "offers": college.programs.map(program => ({
      "@type": "Offer",
      "category": program.faculty,
      "name": program.program_name,
      "price": program.fees,
      "priceCurrency": "NPR"
    }))
  } : undefined;

  return (
    <div className="min-h-screen bg-background">
      {college && (
        <SEO 
          title={`${college.name} - ${college.location.city} | CollegeGuide Nepal`}
          description={`${college.about.substring(0, 150)}... View programs, fees, facilities and reviews for ${college.name} in ${college.location.city}, ${college.location.district}.`}
          keywords={`${college.name}, ${college.location.city} college, ${college.affiliation}, ${college.programs.map(p => p.faculty).join(', ')}, Nepal education`}
          type="article"
          structuredData={collegeStructuredData}
        />
      )}
      <Header />
      
      <main className="container mx-auto px-4 py-6" itemScope itemType="https://schema.org/EducationalOrganization">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back
        </Button>

        {/* College Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={college.logo_url} 
                  alt={`${college.name} logo - ${college.affiliation} affiliated college in ${college.location.city}`}
                  className="w-24 h-24 rounded-lg object-cover"
                  itemProp="logo"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2" itemProp="name">{college.name}</h1>
                    <div className="flex items-center gap-2 mb-2" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        <span itemProp="addressLocality">{college.location.city}</span>, <span itemProp="addressRegion">{college.location.district}</span>
                        <meta itemProp="addressCountry" content="NP" />
                      </span>
                    </div>
                    <Badge className={getAffiliationColor(college.affiliation)}>
                      {college.affiliation} Affiliated
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsSaved(!isSaved)}
                      aria-label={isSaved ? "Remove from saved" : "Save college"}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" size="sm" aria-label="Share college">
                      <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    <span className="font-semibold" itemProp="ratingValue">{college.averageRating}</span>
                    <span className="text-sm text-muted-foreground">(<span itemProp="reviewCount">{college.totalReviews}</span> reviews)</span>
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4" role="tablist" aria-label="College information tabs">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">About {college.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6" itemProp="description">
                  {college.about}
                </p>
                
                <div className="space-y-4">
                  {college.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" />
                      <a 
                        href={college.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {college.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{college.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Available Programs ({college.programs.length})</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {college.programs.map((program: any, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{program.name || program.program_name}</h3>
                        <Badge variant="secondary">{program.faculty}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Duration: {program.duration || 'N/A'}</span>
                        <span className="font-semibold text-primary">
                          {program.fee || formatFees(program.fees || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Facilities</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {college.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">✓</span>
                      </div>
                      <span className="text-foreground">
                        {typeof facility === 'string' ? facility : facility.facility_name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Student Reviews</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Reviews feature coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}