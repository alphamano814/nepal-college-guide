import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { mockColleges } from '@/data/mockData';
import { College } from '@/types/college';
import { Users, GraduationCap, BookOpen, Settings, Plus, Edit, Trash2 } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    location: { city: '', district: '' },
    affiliation: '',
    description: ''
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = {
    totalColleges: colleges.length,
    totalPrograms: colleges.reduce((sum, college) => sum + college.programs.length, 0),
    totalStudents: "10,000+", // Mock data
    averageRating: (colleges.reduce((sum, college) => sum + college.averageRating, 0) / colleges.length).toFixed(1)
  };

  const handleEditCollege = (college: College) => {
    setSelectedCollege(college);
    setIsEditing(true);
  };

  const handleDeleteCollege = (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      setColleges(prev => prev.filter(c => c.id !== collegeId));
    }
  };

  const handleAddCollege = () => {
    if (newCollege.name && newCollege.location.city && newCollege.location.district) {
      const college: College = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCollege.name,
        location: newCollege.location,
        affiliation: newCollege.affiliation as "TU" | "KU" | "PU" | "Purbanchal" | "Pokhara",
        about: newCollege.description,
        logo_url: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200&h=200&fit=crop&crop=center',
        created_at: new Date().toISOString(),
        programs: [],
        facilities: [],
        reviews: [],
        news: [],
        averageRating: 0,
        totalReviews: 0,
        website: ''
      };
      setColleges(prev => [...prev, college]);
      setNewCollege({ name: '', location: { city: '', district: '' }, affiliation: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage colleges, programs, and system settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Colleges</p>
                <p className="text-2xl font-bold">{stats.totalColleges}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
                <p className="text-2xl font-bold">{stats.totalPrograms}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="colleges">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Colleges</CardTitle>
                <Button 
                  className="bg-gradient-hero hover:opacity-90"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add College
                </Button>
              </CardHeader>
              <CardContent>
                {showAddForm && (
                  <div className="border border-border rounded-lg p-4 mb-4 bg-muted/50">
                    <h4 className="font-semibold mb-4">Add New College</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="college-name">College Name</Label>
                        <Input
                          id="college-name"
                          value={newCollege.name}
                          onChange={(e) => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter college name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="college-affiliation">Affiliation</Label>
                        <Input
                          id="college-affiliation"
                          value={newCollege.affiliation}
                          onChange={(e) => setNewCollege(prev => ({ ...prev, affiliation: e.target.value }))}
                          placeholder="e.g., TU, PU, KU"
                        />
                      </div>
                      <div>
                        <Label htmlFor="college-city">City</Label>
                        <Input
                          id="college-city"
                          value={newCollege.location.city}
                          onChange={(e) => setNewCollege(prev => ({ 
                            ...prev, 
                            location: { ...prev.location, city: e.target.value }
                          }))}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="college-district">District</Label>
                        <Input
                          id="college-district"
                          value={newCollege.location.district}
                          onChange={(e) => setNewCollege(prev => ({ 
                            ...prev, 
                            location: { ...prev.location, district: e.target.value }
                          }))}
                          placeholder="Enter district"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="college-description">Description</Label>
                      <Textarea
                        id="college-description"
                        value={newCollege.description}
                        onChange={(e) => setNewCollege(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter college description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddCollege} className="bg-gradient-hero hover:opacity-90">
                        Add College
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {colleges.map((college) => (
                    <div key={college.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={college.logo_url} 
                            alt={college.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{college.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {college.location.city}, {college.location.district}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{college.affiliation}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {college.programs.length} programs
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCollege(college)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCollege(college.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Manage Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Program management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">User management features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="CollegeGuide - Choose College Nepal" />
                  </div>
                  
                  <div>
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea 
                      id="site-description" 
                      defaultValue="Find and compare colleges in Nepal. Make informed decisions about your education."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" defaultValue="info@collegeguide.np" />
                  </div>
                  
                  <Button 
                    className="bg-gradient-hero hover:opacity-90"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}