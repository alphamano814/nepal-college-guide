import { Star, MapPin, GraduationCap, Heart, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { College } from '@/types/college';
import { useEffect } from 'react';

interface CollegeCardProps {
  college: College;
  onViewDetails: (college: College) => void;
  onSave?: (college: College) => void;
  isSaved?: boolean;
}

export function CollegeCard({ college, onViewDetails, onSave, isSaved = false }: CollegeCardProps) {
  // Add structured data for each college card
  useEffect(() => {
    const structuredData = {
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
      "url": college.website || `${window.location.origin}/college/${college.id}`,
      "telephone": college.phone,
      "aggregateRating": college.totalReviews > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": college.averageRating,
        "reviewCount": college.totalReviews,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };

    const scriptId = `college-schema-${college.id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [college]);

  const formatFees = (fees: number) => {
    return new Intl.NumberFormat('ne-NP', { 
      style: 'currency', 
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(fees);
  };

  const getAffiliationColor = (affiliation: string) => {
    const colors = {
      'TU': 'bg-blue-100 text-blue-800',
      'KU': 'bg-green-100 text-green-800', 
      'PU': 'bg-purple-100 text-purple-800',
      'Purbanchal': 'bg-orange-100 text-orange-800',
      'Pokhara': 'bg-pink-100 text-pink-800'
    };
    return colors[affiliation as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 group animate-fade-in-up" itemScope itemType="https://schema.org/EducationalOrganization">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
              {college.logo_url ? (
                <img 
                  src={college.logo_url} 
                  alt={`${college.name} logo - College in ${college.location.city}, ${college.location.district}`}
                  className="w-full h-full object-cover rounded-lg"
                  itemProp="logo"
                />
              ) : (
                <GraduationCap className="w-6 h-6 text-primary" aria-hidden="true" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors" itemProp="name">
                {college.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="w-3 h-3 mr-1" aria-hidden="true" />
                <span itemProp="addressLocality">{college.location.city}</span>, <span itemProp="addressRegion">{college.location.district}</span>
                <meta itemProp="addressCountry" content="NP" />
              </div>
              {college.phone && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Phone className="w-3 h-3 mr-1" />
                  {college.phone}
                </div>
              )}
            </div>
          </div>
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(college)}
              className={`p-2 ${isSaved ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getAffiliationColor(college.affiliation)}>
              {college.affiliation}
            </Badge>
            <div className="flex items-center text-sm" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" aria-hidden="true" />
              <span className="font-medium" itemProp="ratingValue">{college.averageRating}</span>
              <span className="text-muted-foreground ml-1">(<span itemProp="reviewCount">{college.totalReviews}</span>)</span>
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2" itemProp="description">
            {college.about}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Programs: </span>
              <span className="font-medium">{college.programs.length}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => onViewDetails(college)}
            className="w-full mt-3 bg-gradient-hero hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}