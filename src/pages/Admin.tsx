import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
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
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setColleges(prev => prev.filter(c => c.id !== collegeId));
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
                <Button className="bg-gradient-hero hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add College
                </Button>
              </CardHeader>
              <CardContent>
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
                  
                  <Button className="bg-gradient-hero hover:opacity-90">
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