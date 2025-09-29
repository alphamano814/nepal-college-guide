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
import { supabase } from '@/integrations/supabase/client';
import { College, Program, Facility, Faculty, Affiliation } from '@/types/college';
import { Users, GraduationCap, BookOpen, Settings, Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const faculties = ['Management', 'Science', 'Engineering', 'Medical', 'Humanities', 'Law'] as const;
const affiliations = ['TU', 'KU', 'PU', 'Purbanchal', 'Pokhara'] as const;
const facilityTypes = ['Hostel', 'Library', 'Transportation', 'Sports', 'Lab', 'Canteen', 'WiFi', 'Parking'] as const;

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customFacility, setCustomFacility] = useState('');
  const [newCollege, setNewCollege] = useState({
    name: '',
    location: { city: '', district: '' },
    affiliation: '' as Affiliation | '',
    about: '',
    website: '',
    phone: '',
    programs: [] as Program[],
    facilities: [] as string[],
    image: null as File | null
  });

  const [newProgram, setNewProgram] = useState({
    program_name: '',
    faculty: '' as Faculty | '',
    duration: 0,
    fees: 0
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
      const { data, error } = await (supabase as any)
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedColleges: College[] = (data as any[]).map((college: any) => ({
        id: college.id,
        name: college.name,
        logo_url: college.image_url || undefined,
        location: {
          city: college.address.split(',')[0] || '',
          district: college.address.split(',')[1] || ''
        },
        affiliation: college.affiliated_university as Affiliation,
        about: college.description,
        website: college.website_link,
        phone: college.phone_number,
        created_at: college.created_at,
        programs: college.programs || [],
        facilities: (college.facilities || []).map((facility: string, index: number) => ({
          id: `${college.id}-facility-${index}`,
          college_id: college.id,
          facility_name: facility as any
        })),
        reviews: [],
        news: [],
        averageRating: 4.5,
        totalReviews: 10
      }));

      setColleges(mappedColleges);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch colleges",
        variant: "destructive",
      });
    }
  };

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
    totalStudents: "10,000+",
    averageRating: (colleges.reduce((sum, college) => sum + college.averageRating, 0) / colleges.length).toFixed(1)
  };

  const handleEditCollege = (college: College) => {
    setSelectedCollege(college);
    setNewCollege({
      name: college.name,
      location: college.location,
      affiliation: college.affiliation,
      about: college.about,
      website: college.website || '',
      phone: college.phone || '',
      programs: college.programs,
      facilities: college.facilities.map(f => f.facility_name),
      image: null
    });
    setIsEditing(true);
  };

  const handleDeleteCollege = async (collegeId: string) => {
    if (confirm('Are you sure you want to delete this college?')) {
      try {
        const { error } = await (supabase as any)
          .from('colleges')
          .delete()
          .eq('id', collegeId);

        if (error) throw error;

        setColleges(prev => prev.filter(c => c.id !== collegeId));
        toast({
          title: "Success",
          description: "College deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting college:', error);
        toast({
          title: "Error",
          description: "Failed to delete college",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddProgram = () => {
    if (newProgram.program_name && newProgram.faculty && newProgram.duration && newProgram.fees) {
      const program: Program = {
        id: Math.random().toString(36).substr(2, 9),
        college_id: '',
        program_name: newProgram.program_name,
        faculty: newProgram.faculty as Faculty,
        duration: newProgram.duration,
        fees: newProgram.fees
      };
      setNewCollege(prev => ({
        ...prev,
        programs: [...prev.programs, program]
      }));
      setNewProgram({ program_name: '', faculty: '' as Faculty | '', duration: 0, fees: 0 });
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

  const handleAddCustomFacility = () => {
    const trimmedFacility = customFacility.trim();
    if (trimmedFacility && !newCollege.facilities.includes(trimmedFacility)) {
      setNewCollege(prev => ({
        ...prev,
        facilities: [...prev.facilities, trimmedFacility]
      }));
      setCustomFacility('');
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      // Generate a unique filename using college name and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${newCollege.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('college-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('college-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSaveCollege = async () => {
    if (newCollege.name && newCollege.location.city && newCollege.location.district && newCollege.affiliation) {
      try {
        let imageUrl = 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200&h=200&fit=crop&crop=center';
        
        // Upload image if a new file is selected
        if (newCollege.image) {
          const uploadedImageUrl = await handleImageUpload(newCollege.image);
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
          }
        }

        const collegeData = {
          name: newCollege.name,
          description: newCollege.about,
          phone_number: newCollege.phone,
          website_link: newCollege.website,
          image_url: imageUrl,
          facilities: newCollege.facilities,
          address: `${newCollege.location.city}, ${newCollege.location.district}`,
          affiliated_university: newCollege.affiliation,
          programs: newCollege.programs
        };

        if (isEditing && selectedCollege) {
          const { error } = await (supabase as any)
            .from('colleges')
            .update(collegeData)
            .eq('id', selectedCollege.id);

          if (error) throw error;

          toast({
            title: "Success",
            description: "College updated successfully",
          });
        } else {
          const { error } = await (supabase as any)
            .from('colleges')
            .insert([collegeData]);

          if (error) throw error;

          toast({
            title: "Success",
            description: "College added successfully",
          });
        }

        // Refresh the colleges list
        await fetchColleges();

        // Reset form
        setCustomFacility('');
        setNewCollege({
          name: '',
          location: { city: '', district: '' },
          affiliation: '' as Affiliation | '',
          about: '',
          website: '',
          phone: '',
          programs: [],
          facilities: [],
          image: null
        });
        setShowAddForm(false);
        setIsEditing(false);
        setSelectedCollege(null);
      } catch (error) {
        console.error('Error saving college:', error);
        toast({
          title: "Error",
          description: "Failed to save college",
          variant: "destructive",
        });
      }
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
                {(showAddForm || isEditing) && (
                  <div className="border border-border rounded-lg p-6 mb-6 bg-muted/50">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-semibold">
                        {isEditing ? 'Edit College' : 'Add New College'}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddForm(false);
                          setIsEditing(false);
                          setSelectedCollege(null);
                          setCustomFacility('');
                          setNewCollege({
                            name: '',
                            location: { city: '', district: '' },
                            affiliation: '' as Affiliation | '',
                            about: '',
                            website: '',
                            phone: '',
                            programs: [],
                            facilities: [],
                            image: null
                          });
                        }}
                      >
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
                              value={newCollege.affiliation}
                              onValueChange={(value) => setNewCollege(prev => ({ ...prev, affiliation: value as any }))}
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
                            <Label htmlFor="college-city">City *</Label>
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
                            <Label htmlFor="college-district">District *</Label>
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
                          <div>
                            <Label htmlFor="college-phone">Phone Number</Label>
                            <Input
                              id="college-phone"
                              value={newCollege.phone}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-website">Website</Label>
                            <Input
                              id="college-website"
                              value={newCollege.website}
                              onChange={(e) => setNewCollege(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="Enter website URL"
                            />
                          </div>
                          <div>
                            <Label htmlFor="college-image">College Image</Label>
                            <Input
                              id="college-image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setNewCollege(prev => ({ ...prev, image: file || null }));
                              }}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Upload a college image (JPG, PNG, etc.)
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="college-about">About College</Label>
                          <Textarea
                            id="college-about"
                            value={newCollege.about}
                            onChange={(e) => setNewCollege(prev => ({ ...prev, about: e.target.value }))}
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
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <Label htmlFor="program-name">Program Name</Label>
                              <Input
                                id="program-name"
                                value={newProgram.program_name}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, program_name: e.target.value }))}
                                placeholder="e.g., BBA"
                              />
                            </div>
                            <div>
                              <Label htmlFor="program-faculty">Faculty</Label>
                              <Select
                                value={newProgram.faculty}
                                onValueChange={(value) => setNewProgram(prev => ({ ...prev, faculty: value as any }))}
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
                              <Label htmlFor="program-duration">Duration (Years)</Label>
                              <Input
                                id="program-duration"
                                type="number"
                                value={newProgram.duration || ''}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                placeholder="e.g., 4"
                              />
                            </div>
                            <div>
                              <Label htmlFor="program-fees">Fees (NPR)</Label>
                              <Input
                                id="program-fees"
                                type="number"
                                value={newProgram.fees || ''}
                                onChange={(e) => setNewProgram(prev => ({ ...prev, fees: parseInt(e.target.value) || 0 }))}
                                placeholder="e.g., 550000"
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleAddProgram}
                            className="mt-3 bg-gradient-hero hover:opacity-90"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Program
                          </Button>
                        </div>
                        
                        {newCollege.programs.length > 0 && (
                          <div className="space-y-2">
                            <h6 className="font-medium">Added Programs</h6>
                            {newCollege.programs.map((program, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <Badge>{program.faculty}</Badge>
                                  <span className="font-medium">{program.program_name}</span>
                                   <span className="text-sm text-muted-foreground">
                                     {program.duration} years - NPR {(program.fees || 0).toLocaleString()}
                                   </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProgram(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
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
                        
                        {/* Custom Facility Input */}
                        <div className="flex gap-2 mb-4">
                          <Input
                            placeholder="Add custom facility..."
                            value={customFacility}
                            onChange={(e) => setCustomFacility(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomFacility();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddCustomFacility}
                            disabled={!customFacility.trim()}
                            size="sm"
                            className="px-4"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        
                        {newCollege.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newCollege.facilities.map((facility, index) => (
                              <Badge key={`${facility}-${index}`} variant="secondary" className="flex items-center gap-1">
                                {facility}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFacility(facility)}
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleSaveCollege} 
                          className="bg-gradient-hero hover:opacity-90"
                        >
                          {isEditing ? 'Update College' : 'Add College'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowAddForm(false);
                            setIsEditing(false);
                            setSelectedCollege(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
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
                            {college.phone && (
                              <p className="text-sm text-muted-foreground">
                                📞 {college.phone}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{college.affiliation}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {college.programs.length} programs
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {college.facilities.length} facilities
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
                <div className="space-y-4">
                  {colleges.map((college) => (
                    <div key={college.id} className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{college.name}</h3>
                      {college.programs.length > 0 ? (
                        <div className="space-y-2">
                          {college.programs.map((program) => (
                            <div key={program.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <Badge>{program.faculty}</Badge>
                                <span className="font-medium">{program.program_name}</span>
                                 <span className="text-sm text-muted-foreground">
                                   {program.duration} years - NPR {(program.fees || 0).toLocaleString()}
                                 </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No programs added yet</p>
                      )}
                    </div>
                  ))}
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