import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

const mockNews = [
  {
    id: '1',
    title: 'TU Entrance Exam 2024 Registration Open',
    summary: 'Tribhuvan University announces the opening of entrance exam registration for various undergraduate programs.',
    content: 'Students interested in pursuing undergraduate studies at Tribhuvan University can now register for the entrance examination...',
    college: 'Tribhuvan University',
    category: 'Admission',
    publishedAt: '2024-01-15',
    readTime: '3 min read'
  },
  {
    id: '2',
    title: 'New Engineering Scholarships Available',
    summary: 'Several engineering colleges in Nepal are offering merit-based scholarships for deserving students.',
    content: 'In an effort to support talented students, multiple engineering institutions have announced new scholarship programs...',
    college: 'Multiple Colleges',
    category: 'Scholarship',
    publishedAt: '2024-01-12',
    readTime: '5 min read'
  },
  {
    id: '3',
    title: 'Kathmandu University Updates Admission Criteria',
    summary: 'KU has revised its admission requirements for the upcoming academic session.',
    content: 'Kathmandu University has announced updated admission criteria that will be effective from the next academic year...',
    college: 'Kathmandu University',
    category: 'Policy Update',
    publishedAt: '2024-01-10',
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'Medical College Admission Guidelines Released',
    summary: 'The Medical Education Commission has published new guidelines for medical college admissions.',
    content: 'The Medical Education Commission of Nepal has released comprehensive guidelines for medical college admissions...',
    college: 'Medical Education Commission',
    category: 'Guidelines',
    publishedAt: '2024-01-08',
    readTime: '6 min read'
  }
];

export default function News() {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Admission': 'bg-blue-100 text-blue-800 border-blue-200',
      'Scholarship': 'bg-green-100 text-green-800 border-green-200',
      'Policy Update': 'bg-orange-100 text-orange-800 border-orange-200',
      'Guidelines': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Latest Education News
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Stay updated with admission news, scholarships, and important announcements
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Featured News */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured News</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(mockNews[0].category)}>
                          {mockNews[0].category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{mockNews[0].college}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{mockNews[0].title}</h3>
                      <p className="text-muted-foreground mb-4">{mockNews[0].summary}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(mockNews[0].publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {mockNews[0].readTime}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Featured Image</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent News */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Updates</h2>
              <div className="space-y-6">
                {mockNews.slice(1).map((news) => (
                  <Card key={news.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(news.category)}>
                          {news.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{news.college}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2">{news.title}</h3>
                      <p className="text-muted-foreground mb-4">{news.summary}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.publishedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {news.readTime}
                          </div>
                        </div>
                        
                        <button className="flex items-center gap-1 text-primary hover:underline text-sm">
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <Card className="mt-12 bg-muted">
              <CardHeader>
                <CardTitle className="text-center">Stay Updated</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Get the latest education news and admission updates delivered to your email
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border border-border rounded-md"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Subscribe
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}