import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Latest Education News
            </h1>
            <p className="text-lg md:text-xl text-white/90 animate-fade-in-up animate-delay-100">
              Stay updated with admission news, scholarships, and important announcements
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center py-16 animate-fade-in-up">
              <CardContent>
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Newspaper className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No News Available Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  News articles will be added soon through the admin section. Check back later for the latest updates on admissions, scholarships, and education news.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
