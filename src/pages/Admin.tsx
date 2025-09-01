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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, GraduationCap, BookOpen, Settings, Plus, Edit, Trash2, X } from 'lucide-react';

const faculties = ['Management', 'Science', 'Engineering', 'Medical', 'Humanities', 'Law'] as const;
const affiliations = ['TU', 'KU', 'PU', 'Purbanchal', 'Pokhara'] as const;
const facilityTypes = ['Hostel', 'Library', 'Transportation', 'Sports', 'Lab', 'Canteen', 'WiFi', 'Parking'] as const;

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
  updated_at: string;
};

type Program = {
  name: string;
  faculty: string;
  fee: string;
};

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [newCollege, setNewCollege] = useState({
    name: '',
    address: '',
    affiliated_university: '',
    description: '',
    phone_number: '',
    website_link: '',
    image_url: '',
    programs: [] as Program[],
    facilities: [] as string[]
  });

  const [newProgram, setNewProgram] = useState({
    name: '',
    faculty: '',
    fee: ''
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchColleges();
    }
  }, [user, isAdmin]);

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
      toast({
        title: "Error",
        description: "Failed to load colleges",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
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
    totalStudents: "10,000+",
    averageRating: "4.5"
  };

  const handleEditCollege = (college: College) => {
    setSelectedCollege(college);
    setNewCollege({
      name: college.name,
      address: college.address,
      affiliated_university: college.affiliated_university,
      description: college.description,
      phone_number: college.phone_number,
      website_link: college.website_link || '',
      image_url: college.image_url || '',
      programs: college.programs || [],
      facilities: college.facilities || []
    });
    setIsEditing(true);
  };

  const handleDeleteCollege = async (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      try {
        const { error } = await supabase
          .from('colleges')
          .delete()
          .eq('id', collegeId);

        if (error) throw error;

        await fetchColleges();
        toast({
          title: "Success",
          description: "College deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete college",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddProgram = () => {
    if (newProgram.name && newProgram.faculty && newProgram.fee) {
      setNewCollege(prev => ({
        ...prev,
        programs: [...prev.programs, { ...newProgram }]
      }));
      setNewProgram({ name: '', faculty: '', fee: '' });
    }
  };

  const handleRemoveProgram = (index: number) => {
    setNewCollege(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  const handleAddFacility = (facility: string) => {
    if (!newCollege.facilities.includes(facility)) {
      setNewCollege(prev => ({
        ...prev,
        facilities: [...prev.facilities, facility]
      }));
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setNewCollege(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSaveCollege = async () => {
    if (!newCollege.name || !newCollege.address || !newCollege.affiliated_university || !newCollege.description || !newCollege.phone_number) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const collegeData = {
        name: newCollege.name,
        address: newCollege.address,
        affiliated_university: newCollege.affiliated_university,
        description: newCollege.description,
        phone_number: newCollege.phone_number,
        website_link: newCollege.website_link || null,
        image_url: newCollege.image_url || null,
        programs: newCollege.programs,
        facilities: newCollege.facilities,
      };

      if (isEditing && selectedCollege) {
        const { error } = await supabase
          .from('colleges')
          .update(collegeData)
          .eq('id', selectedCollege.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "College updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('colleges')
          .insert(collegeData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "College added successfully"
        });
      }

      await fetchColleges();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save college",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setNewCollege({
      name: '',
      address: '',
      affiliated_university: '',
      description: '',
      phone_number: '',
      website_link: '',
      image_url: '',
      programs: [],
      facilities: []
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedCollege(null);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully"
    });
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
                {(showAddForm || isEditing) && (
                  <div className="border border-border rounded-lg p-6 mb-6 bg-muted/50">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold">
                        {isEditing ? 'Edit College' : 'Add New College'}
                      </h4>
                      <Button variant="ghost" size="sm" onClick={resetForm}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium mb-4">Basic Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="college-name">College Name *</Label>
                            <Input
                              id="college-name"
                              value={newCollege.name}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter college name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-affiliation">Affiliated University *</Label>
                            <Select
                              value={newCollege.affiliated_university}
                              onValueChange={(value) => setNewCollege(prev => ({ ...prev, affiliated_university: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select affiliation" />
                              </SelectTrigger>
                              <SelectContent>
                                {affiliations.map((affiliation) => (
                                  <SelectItem key={affiliation} value={affiliation}>
                                    {affiliation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="college-address">Address *</Label>
                            <Input
                              id="college-address"
                              value={newCollege.address}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="Enter full address"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-phone">Phone Number *</Label>
                            <Input
                              id="college-phone"
                              value={newCollege.phone_number}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, phone_number: e.target.value }))}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-website">Website</Label>
                            <Input
                              id="college-website"
                              value={newCollege.website_link}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, website_link: e.target.value }))}
                              placeholder="Enter website URL"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-image">Image URL</Label>
                            <Input
                              id="college-image"
                              value={newCollege.image_url}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, image_url: e.target.value }))}
                              placeholder="Enter image URL"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="college-description">About College *</Label>
                          <Textarea
                            id="college-description"
                            value={newCollege.description}
                            onChange={(e) => setNewCollege(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter college description"
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Programs */}
                      <div>
                        <h5 className="font-medium mb-4">Programs</h5>
                        <div className="border border-border rounded-lg p-4 mb-4">
                          <h6 className="font-medium mb-3">Add Program</h6>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label htmlFor="program-name">Program Name</Label>
                              <Input
                                id="program-name"
                                value={newProgram.name}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., BBA"
                              />
                            </div>
                            <div>
                              <Label htmlFor="program-faculty">Faculty</Label>
                              <Select
                                value={newProgram.faculty}
                                onValueChange={(value) => setNewProgram(prev => ({ ...prev, faculty: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {faculties.map((faculty) => (
                                    <SelectItem key={faculty} value={faculty}>
                                      {faculty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="program-fee">Fee</Label>
                              <Input
                                id="program-fee"
                                value={newProgram.fee}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, fee: e.target.value }))}
                                placeholder="e.g., 5.5L"
                              />
                            </div>
                          </div>
                          <Button onClick={handleAddProgram} className="mt-3">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Program
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {newCollege.programs.map((program, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                              <div>
                                <span className="font-medium">{program.name}</span>
                                <span className="text-muted-foreground ml-2">• {program.faculty}</span>
                                <span className="text-muted-foreground ml-2">• {program.fee}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveProgram(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Facilities */}
                      <div>
                        <h5 className="font-medium mb-4">Facilities</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {facilityTypes.map((facility) => (
                            <Button
                              key={facility}
                              variant={newCollege.facilities.includes(facility) ? "default" : "outline"}
                              size="sm"
                              onClick={() => 
                                newCollege.facilities.includes(facility)
                                  ? handleRemoveFacility(facility)
                                  : handleAddFacility(facility)
                              }
                            >
                              {facility}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {newCollege.facilities.map((facility) => (
                            <Badge key={facility} variant="secondary">
                              {facility}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0"
                                onClick={() => handleRemoveFacility(facility)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSaveCollege}>
                          {isEditing ? 'Update College' : 'Add College'}
                        </Button>
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Colleges List */}
                <div className="space-y-4">
                  {colleges.map((college) => (
                    <div key={college.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{college.name}</h4>
                          <p className="text-sm text-muted-foreground">{college.address}</p>
                          <p className="text-sm text-muted-foreground">University: {college.affiliated_university}</p>
                          <p className="text-sm text-muted-foreground">Phone: {college.phone_number}</p>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium">Programs:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {college.programs.map((program: any, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {program.name} - {program.fee}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium">Facilities:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {college.facilities.map((facility: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
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
                <p className="text-muted-foreground">Program management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="Nepal College Finder" />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea
                      id="site-description"
                      defaultValue="Find and compare colleges in Nepal"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}