import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  Video,
  FileText,
  User,
  GraduationCap,
  BookOpen,
  Award,
  Loader2,
  Lightbulb,
  Target,
  Plus,
  X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SUBJECT_CATEGORIES } from '@/data/subjects';
import { LANGUAGES } from '@/data/languages';

export function MentorOnboardingPage() {
  const [step, setStep] = useState(0); // 0: Welcome, 1-7: Form Steps, 8: Success
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    profilePhoto: null,
    location: '',
    preferredLanguages: [],
    bio: '',
    educationLevel: '',
    institutionName: '',
    graduationYear: '',
    fieldOfStudy: '',
    currentProfession: '',
    yearsExperience: '',
    previousTeachingExperience: false,
    teachingDetails: '',
    selectedSubjects: [],
    teachingApproach: [],
    targetAudience: '',
    governmentId: null,
    educationalCertificates: [],
    professionalCertifications: [],
    teachingCredentials: [],
    demoVideo: null,
    ndaAgreed: false,
    signature: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev: any) => ({ ...prev, [id]: checked }));
    } else if (type === 'file') {
      setFormData((prev: any) => ({ ...prev, [id]: e.target.files ? Array.from(e.target.files) : null }));
    } else {
      setFormData((prev: any) => ({ ...prev, [id]: value }));
    }
    setFormErrors((prev: any) => ({ ...prev, [id]: '' })); // Clear error on change
  };

  const handleMultiSelectChange = (id: string, value: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentArray = prev[id] || [];
      return {
        ...prev,
        [id]: checked ? [...currentArray, value] : currentArray.filter((item: string) => item !== value),
      };
    });
    setFormErrors((prev: any) => ({ ...prev, [id]: '' }));
  };

  const handleSubjectSkillChange = (subjectId: string, level: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentSubjects = prev.selectedSubjects || [];
      if (checked) {
        return {
          ...prev,
          selectedSubjects: [...currentSubjects, { id: subjectId, level }],
        };
      } else {
        return {
          ...prev,
          selectedSubjects: currentSubjects.filter((s: any) => s.id !== subjectId),
        };
      }
    });
    setFormErrors((prev: any) => ({ ...prev, selectedSubjects: '' }));
  };

  const validateStep = () => {
    let errors: any = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName) errors.fullName = 'Full name is required.';
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required.';
      if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = 'Valid 10-digit phone number is required.';
      if (!formData.dob) errors.dob = 'Date of birth is required.';
      if (!formData.location) errors.location = 'Location is required.';
      if (formData.preferredLanguages.length === 0) errors.preferredLanguages = 'At least one language is required.';
      if (!formData.profilePhoto) errors.profilePhoto = 'Profile photo is required.';
      if (!formData.bio || formData.bio.length < 50) errors.bio = 'Biography is required and must be at least 50 characters.';
    } else if (step === 2) {
      if (!formData.educationLevel) errors.educationLevel = 'Education level is required.';
      if (!formData.institutionName) errors.institutionName = 'Institution name is required.';
      if (!formData.graduationYear) errors.graduationYear = 'Graduation year is required.';
      if (!formData.fieldOfStudy) errors.fieldOfStudy = 'Field of study is required.';
      if (!formData.currentProfession) errors.currentProfession = 'Current profession is required.';
      if (!formData.yearsExperience) errors.yearsExperience = 'Years of experience is required.';
    } else if (step === 3) {
      if (formData.selectedSubjects.length < 3) errors.selectedSubjects = 'Select at least 3 subjects.';
      if (formData.selectedSubjects.length > 10) errors.selectedSubjects = 'Select a maximum of 10 subjects.';
      if (formData.teachingApproach.length === 0) errors.teachingApproach = 'Select at least one teaching approach.';
      if (!formData.targetAudience) errors.targetAudience = 'Target audience is required.';
    } else if (step === 4) {
      if (!formData.governmentId || formData.governmentId.length === 0) errors.governmentId = 'Government ID is required.';
      if (formData.educationalCertificates.length === 0) errors.educationalCertificates = 'Educational certificates are required.';
    } else if (step === 5) {
      if (!formData.demoVideo || formData.demoVideo.length === 0) errors.demoVideo = 'Demo video is required.';
    } else if (step === 6) {
      if (!formData.ndaAgreed) errors.ndaAgreed = 'You must agree to the NDA.';
      if (!formData.signature) errors.signature = 'Digital signature is required.';
    }

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
    }
    return isValid;
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step < 7) {
      if (validateStep()) {
        setStep((prev) => prev + 1);
      }
    } else if (step === 7) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setStep(8); // Move to success state
        toast({
          title: 'Application Submitted!',
          description: 'Your mentor application has been submitted successfully.',
          variant: 'default',
        });
        console.log('Mentor Application Data:', formData);
      }, 2000);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center py-12">
            <img
              src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Welcome"
              className="w-64 h-auto mx-auto mb-8 rounded-lg shadow-lg"
            />
            <h2 className="text-3xl font-bold text-foreground mb-4">Become a StudyBuddy Mentor</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Empower learners, share your knowledge, and earn on your own schedule.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 text-center">
                <h3 className="text-xl font-semibold text-primary">Earn ₹500-2000/hour</h3>
                <p className="text-sm text-muted-foreground">Competitive rates for your expertise.</p>
              </Card>
              <Card className="p-4 text-center">
                <h3 className="text-xl font-semibold text-primary">Flexible Schedule</h3>
                <p className="text-sm text-muted-foreground">Teach when and where it suits you.</p>
              </Card>
              <Card className="p-4 text-center">
                <h3 className="text-xl font-semibold text-primary">Build Your Reputation</h3>
                <p className="text-sm text-muted-foreground">Grow your profile and impact lives.</p>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Estimated completion time: 15 minutes</p>
            <Button onClick={handleNext} className="px-8 py-3 text-lg">
              Start Application <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <User className="h-5 w-5" /> 1. Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john.doe@example.com" />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                {formErrors.dob && <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender (Optional)</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location (City, State)</Label>
                <Input id="location" value={formData.location} onChange={handleInputChange} placeholder="Mumbai, Maharashtra" />
                {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input id="profilePhoto" type="file" accept="image/*" onChange={handleInputChange} />
              {formErrors.profilePhoto && <p className="text-red-500 text-xs mt-1">{formErrors.profilePhoto}</p>}
              {formData.profilePhoto && formData.profilePhoto[0] && (
                <img src={URL.createObjectURL(formData.profilePhoto[0])} alt="Profile Preview" className="mt-2 h-24 w-24 object-cover rounded-full" />
              )}
            </div>
            <div>
              <Label htmlFor="preferredLanguages">Preferred Languages for Teaching</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {LANGUAGES.map((lang) => (
                  <div key={lang.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang.code}`}
                      checked={formData.preferredLanguages.includes(lang.code)}
                      onCheckedChange={(checked) => handleMultiSelectChange('preferredLanguages', lang.code, checked as boolean)}
                    />
                    <Label htmlFor={`lang-${lang.code}`} className="flex items-center gap-1">
                      {lang.flag} {lang.name}
                    </Label>
                  </div>
                ))}
              </div>
              {formErrors.preferredLanguages && <p className="text-red-500 text-xs mt-1">{formErrors.preferredLanguages}</p>}
            </div>
            <div>
              <Label htmlFor="bio">Short Biography (Min 50 characters)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your teaching style, and what makes you a great mentor."
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </p>
              {formErrors.bio && <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> 2. Education & Experience
            </h3>
            <div>
              <Label htmlFor="educationLevel">Highest Education Level</Label>
              <Select value={formData.educationLevel} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, educationLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.educationLevel && <p className="text-red-500 text-xs mt-1">{formErrors.educationLevel}</p>}
            </div>
            <div>
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input id="institutionName" value={formData.institutionName} onChange={handleInputChange} placeholder="e.g., IIT Bombay" />
              {formErrors.institutionName && <p className="text-red-500 text-xs mt-1">{formErrors.institutionName}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input id="graduationYear" type="number" value={formData.graduationYear} onChange={handleInputChange} placeholder="YYYY" />
                {formErrors.graduationYear && <p className="text-red-500 text-xs mt-1">{formErrors.graduationYear}</p>}
              </div>
              <div>
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input id="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} placeholder="e.g., Computer Science" />
                {formErrors.fieldOfStudy && <p className="text-red-500 text-xs mt-1">{formErrors.fieldOfStudy}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="currentProfession">Current Profession/Role</Label>
              <Input id="currentProfession" value={formData.currentProfession} onChange={handleInputChange} placeholder="e.g., Software Engineer, Data Scientist" />
              {formErrors.currentProfession && <p className="text-red-500 text-xs mt-1">{formErrors.currentProfession}</p>}
            </div>
            <div>
              <Label htmlFor="yearsExperience">Years of Professional Experience</Label>
              <Input id="yearsExperience" type="number" value={formData.yearsExperience} onChange={handleInputChange} placeholder="e.g., 5" />
              {formErrors.yearsExperience && <p className="text-red-500 text-xs mt-1">{formErrors.yearsExperience}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="previousTeachingExperience"
                checked={formData.previousTeachingExperience}
                onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, previousTeachingExperience: checked }))}
              />
              <Label htmlFor="previousTeachingExperience">Do you have previous teaching experience?</Label>
            </div>
            {formData.previousTeachingExperience && (
              <div>
                <Label htmlFor="teachingDetails">Please provide details of your teaching experience</Label>
                <Textarea id="teachingDetails" value={formData.teachingDetails} onChange={handleInputChange} rows={3} />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> 3. Subjects & Expertise
            </h3>
            <div>
              <Label className="mb-2 block">Select Subjects you can teach (Min 3, Max 10)</Label>
              <div className="space-y-4">
                {SUBJECT_CATEGORIES.map((category) => (
                  <div key={category.id} className="border rounded-md p-3">
                    <h4 className="font-semibold text-foreground mb-2">{category.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.subcategories.map((sub) => (
                        <div key={sub.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${sub.id}`}
                            checked={formData.selectedSubjects.some((s: any) => s.id === sub.id)}
                            onCheckedChange={(checked) => handleSubjectSkillChange(sub.id, 'Intermediate', checked as boolean)}
                          />
                          <Label htmlFor={`subject-${sub.id}`}>{sub.name}</Label>
                          {/* Could add a select for skill level here if needed */}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.selectedSubjects && <p className="text-red-500 text-xs mt-1">{formErrors.selectedSubjects}</p>}
            </div>
            <div>
              <Label className="mb-2 block">Teaching Approach Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Exam-focused',
                  'Project-based',
                  'Conceptual',
                  'Interview prep',
                ].map((approach) => (
                  <div key={approach} className="flex items-center space-x-2">
                    <Checkbox
                      id={`approach-${approach.toLowerCase().replace(/\s/g, '-')}`}
                      checked={formData.teachingApproach.includes(approach)}
                      onCheckedChange={(checked) => handleMultiSelectChange('teachingApproach', approach, checked as boolean)}
                    />
                    <Label htmlFor={`approach-${approach.toLowerCase().replace(/\s/g, '-')}`}>
                      {approach}
                    </Label>
                  </div>
                ))}
              </div>
              {formErrors.teachingApproach && <p className="text-red-500 text-xs mt-1">{formErrors.teachingApproach}</p>}
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData((prev: any) => ({ ...prev, targetAudience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Who do you prefer to teach?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="professionals">Professionals</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.targetAudience && <p className="text-red-500 text-xs mt-1">{formErrors.targetAudience}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Upload className="h-5 w-5" /> 4. Document Verification
            </h3>
            <p className="text-sm text-muted-foreground">
              Please upload the required documents for verification. All documents will be kept confidential.
            </p>
            <div>
              <Label htmlFor="governmentId">Government ID (e.g., Aadhaar, Passport) - Front & Back</Label>
              <Input id="governmentId" type="file" multiple accept="image/*,.pdf" onChange={handleInputChange} />
              {formErrors.governmentId && <p className="text-red-500 text-xs mt-1">{formErrors.governmentId}</p>}
              {formData.governmentId && formData.governmentId.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.governmentId.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="educationalCertificates">Educational Certificates (e.g., Degree, Transcripts)</Label>
              <Input id="educationalCertificates" type="file" multiple accept="image/*,.pdf" onChange={handleInputChange} />
              {formErrors.educationalCertificates && <p className="text-red-500 text-xs mt-1">{formErrors.educationalCertificates}</p>}
              {formData.educationalCertificates && formData.educationalCertificates.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.educationalCertificates.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="professionalCertifications">Professional Certifications (Optional)</Label>
              <Input id="professionalCertifications" type="file" multiple accept="image/*,.pdf" onChange={handleInputChange} />
              {formData.professionalCertifications && formData.professionalCertifications.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.professionalCertifications.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="teachingCredentials">Previous Teaching Credentials (Optional)</Label>
              <Input id="teachingCredentials" type="file" multiple accept="image/*,.pdf" onChange={handleInputChange} />
              {formData.teachingCredentials && formData.teachingCredentials.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.teachingCredentials.map((f: File) => f.name).join(', ')}
                </p>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Video className="h-5 w-5" /> 5. Demo Video Recording
            </h3>
            <p className="text-sm text-muted-foreground">
              Record a short 3-5 minute lesson on your favorite subject. This helps us understand your teaching style.
            </p>
            <Card className="p-4 border-dashed border-2 flex flex-col items-center justify-center text-center min-h-[200px]">
              <Video className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">Upload your demo video or use our built-in recorder.</p>
              <Input id="demoVideo" type="file" accept="video/*" onChange={handleInputChange} className="w-full max-w-xs" />
              {formErrors.demoVideo && <p className="text-red-500 text-xs mt-1">{formErrors.demoVideo}</p>}
              {formData.demoVideo && formData.demoVideo[0] && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {formData.demoVideo[0].name}
                </p>
              )}
              <Button variant="outline" className="mt-4">
                <Video className="mr-2 h-4 w-4" /> Start Recording (Coming Soon)
              </Button>
            </Card>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold">Recording Guidelines:</p>
              <ul className="list-disc list-inside">
                <li>Keep it between 3-5 minutes.</li>
                <li>Choose a topic you're passionate about.</li>
                <li>Ensure good lighting and clear audio.</li>
                <li>Showcase your teaching style and engagement.</li>
              </ul>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" /> 6. NDA Agreement
            </h3>
            <Card className="p-6 border bg-muted/20 max-h-96 overflow-y-auto">
              <h4 className="text-lg font-bold mb-4">Non-Disclosure Agreement (NDA)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This Non-Disclosure Agreement ("Agreement") is entered into by and between StudyBuddy ("Company") and the Mentor ("Recipient").
                <br /><br />
                **1. Confidential Information:** Recipient acknowledges that during the course of their engagement with the Company, they may be exposed to confidential and proprietary information, including but not limited to, business strategies, user data, technological processes, marketing plans, and financial information (collectively, "Confidential Information").
                <br /><br />
                **2. Non-Disclosure Obligation:** Recipient agrees to keep all Confidential Information strictly confidential and not to disclose, publish, or disseminate such information to any third party without the prior written consent of the Company. Recipient further agrees not to use the Confidential Information for any purpose other than for the performance of their duties as a mentor for StudyBuddy.
                <br /><br />
                **3. Exceptions:** The obligations of confidentiality shall not apply to information that: (a) is or becomes publicly available through no fault of the Recipient; (b) was known to the Recipient prior to its disclosure by the Company; (c) is independently developed by the Recipient without use of or reference to the Confidential Information; or (d) is required to be disclosed by law or court order, provided that the Recipient gives prompt notice to the Company of such requirement.
                <br /><br />
                **4. Return of Information:** Upon termination of the Recipient's engagement with the Company, or at any time upon the Company's request, Recipient shall immediately return to the Company all Confidential Information, including all copies thereof, in any form or medium.
                <br /><br />
                **5. Remedies:** Recipient acknowledges that unauthorized disclosure or use of Confidential Information would cause irreparable harm to the Company, for which monetary damages would be an inadequate remedy. Therefore, the Company shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.
                <br /><br />
                **6. Governing Law:** This Agreement shall be governed by and construed in accordance with the laws of India.
                <br /><br />
                By proceeding, you acknowledge that you have read, understood, and agree to the terms of this Non-Disclosure Agreement.
              </p>
            </Card>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ndaAgreed"
                checked={formData.ndaAgreed}
                onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, ndaAgreed: checked }))}
              />
              <Label htmlFor="ndaAgreed">I have read and understood the NDA and agree to its terms.</Label>
            </div>
            {formErrors.ndaAgreed && <p className="text-red-500 text-xs mt-1">{formErrors.ndaAgreed}</p>}
            <div>
              <Label htmlFor="signature">Digital Signature (Type your full name)</Label>
              <Input id="signature" value={formData.signature} onChange={handleInputChange} placeholder="Your Full Name" />
              {formErrors.signature && <p className="text-red-500 text-xs mt-1">{formErrors.signature}</p>}
            </div>
            <Button variant="outline" className="w-full">Download NDA as PDF</Button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> 7. Application Review
            </h3>
            <p className="text-sm text-muted-foreground">
              Please review all the information you have provided before final submission. You can go back and edit any section.
            </p>
            <Card className="p-6 shadow-lg bg-muted/10">
              <h4 className="text-lg font-bold mb-4">Summary of Your Application</h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Personal Information</span>
                  <Button variant="link" size="sm" onClick={() => setStep(1)}>Edit</Button>
                </div>
                <p className="text-muted-foreground ml-4">Name: {formData.fullName}</p>
                <p className="text-muted-foreground ml-4">Email: {formData.email}</p>
                <p className="text-muted-foreground ml-4">Location: {formData.location}</p>
                <p className="text-muted-foreground ml-4">Languages: {formData.preferredLanguages.join(', ')}</p>
                <p className="text-muted-foreground ml-4 line-clamp-2">Bio: {formData.bio}</p>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Education & Experience</span>
                  <Button variant="link" size="sm" onClick={() => setStep(2)}>Edit</Button>
                </div>
                <p className="text-muted-foreground ml-4">Education: {formData.educationLevel} from {formData.institutionName}</p>
                <p className="text-muted-foreground ml-4">Profession: {formData.currentProfession} ({formData.yearsExperience} years)</p>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Subjects & Expertise</span>
                  <Button variant="link" size="sm" onClick={() => setStep(3)}>Edit</Button>
                </div>
                <p className="text-muted-foreground ml-4">Subjects: {formData.selectedSubjects.map((s: any) => s.id).join(', ')}</p>
                <p className="text-muted-foreground ml-4">Approach: {formData.teachingApproach.join(', ')}</p>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Documents & Video</span>
                  <Button variant="link" size="sm" onClick={() => setStep(4)}>Edit</Button>
                </div>
                <p className="text-muted-foreground ml-4">Government ID: {formData.governmentId ? 'Uploaded' : 'Missing'}</p>
                <p className="text-muted-foreground ml-4">Educational Certs: {formData.educationalCertificates.length > 0 ? 'Uploaded' : 'Missing'}</p>
                <p className="text-muted-foreground ml-4">Demo Video: {formData.demoVideo ? 'Uploaded' : 'Missing'}</p>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">NDA Agreement</span>
                  <Button variant="link" size="sm" onClick={() => setStep(6)}>Edit</Button>
                </div>
                <p className="text-muted-foreground ml-4">NDA Agreed: {formData.ndaAgreed ? 'Yes' : 'No'}</p>
                <p className="text-muted-foreground ml-4">Signature: {formData.signature || 'N/A'}</p>
              </div>
            </Card>
            <p className="text-sm text-muted-foreground mt-4">
              Expected review timeline: 3-5 business days. You will be notified via email.
            </p>
            <p className="text-sm text-muted-foreground">
              For any queries, please contact our support team.
            </p>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
            <h3 className="text-3xl font-bold text-foreground mt-6 mb-3">Application Submitted!</h3>
            <p className="text-lg text-muted-foreground max-w-md">
              Thank you for applying to be a StudyBuddy mentor. We will review your application shortly.
            </p>
            <Card className="p-6 mt-8 w-full max-w-md text-left shadow-lg">
              <CardTitle className="text-xl font-bold mb-4">Next Steps</CardTitle>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>You will receive an email confirmation within 24 hours.</li>
                <li>Our team will review your application within 3-5 business days.</li>
                <li>You will be notified of your application status via email.</li>
                <li>In the meantime, you can explore your temporary mentor dashboard.</li>
              </ul>
              <div className="flex flex-col gap-3 mt-6">
                <Link to="/mentor-dashboard" className="w-full">
                  <Button className="w-full">Go to Mentor Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="p-6 md:p-8 shadow-xl rounded-2xl">
        <CardHeader className="p-0 mb-6">
          {step > 0 && step < 8 && (
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={handleBack} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Progress value={((step - 1) / 6) * 100} className="w-1/2" />
              <span className="text-sm text-muted-foreground">Step {step} of 7</span>
            </div>
          )}
          <CardTitle className="text-3xl font-extrabold text-center text-primary">
            {step === 0 ? 'Welcome to StudyBuddy Mentorship' :
             step === 8 ? 'Application Complete!' :
             'Mentor Application'}
          </CardTitle>
          {step > 0 && step < 8 && (
            <CardDescription className="text-center text-muted-foreground mt-2">
              Please provide the following details to complete your application.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {renderStepContent()}
        </CardContent>
        {step > 0 && step < 8 && (
          <div className="flex justify-end mt-8">
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : step === 7 ? (
                <>
                  Submit Application <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
