'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiClock, FiCheckCircle, FiFile, FiUpload, FiAward, FiBook, FiTrash2 } from "react-icons/fi";
import { toast } from 'sonner';
import { 
  getUserCourses, 
  getCourse, 
  createCourse, 
  getStudyPlan, 
  saveStudyPlan,
  updateCourse,
  deleteCourse
} from '@/lib/azure-cosmos';
import { uploadFile, deleteFile, getFilesList } from '@/lib/azure-storage';
import { generateStudyPlan } from '@/lib/azure-openai';
import CourseForm from '@/components/planner/CourseForm';
import FileUploader from '@/components/planner/FileUploader';
import StudyPlanViewer from '@/components/planner/StudyPlanViewer';
import CoursesList from '@/components/planner/CoursesList';
import FilesList from '@/components/planner/FilesList';
import { useAuth } from '@/context/AuthContext';

export default function StudyPlanner() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseFiles, setCourseFiles] = useState([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { user } = useAuth();

  // Load user's courses on component mount
  useEffect(() => {
    async function loadCourses() {
      if (!user) return; // Make sure we have a user before loading courses
      
      try {
        setIsLoading(true);
        const userCourses = await getUserCourses(user.id || user.$id);
        setCourses(userCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Failed to load courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, [user]);

  // Load course files when a course is selected
  useEffect(() => {
    async function loadFiles() {
      if (!selectedCourse || !user) return;

      try {
        setIsLoading(true);
        // Get files from Azure Storage directly instead of Cosmos DB
        const files = await getFilesList(user.id || user.$id, selectedCourse.id || selectedCourse.$id);
        setCourseFiles(files);

        // Load existing study plan from Cosmos DB
        const existingPlan = await getStudyPlan(selectedCourse.id || selectedCourse.$id, user.id || user.$id);
        setStudyPlan(existingPlan);
      } catch (error) {
        console.error('Error loading course files:', error);
        toast.error('Failed to load course files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadFiles();
  }, [selectedCourse, user]);

  const handleCourseSelect = async (courseId) => {
    try {
      const course = await getCourse(courseId, user.id || user.$id);
      setSelectedCourse(course);
      setActiveTab('files');
    } catch (error) {
      console.error('Error selecting course:', error);
      toast.error('Failed to load course details. Please try again.');
    }
  };

  const handleCourseCreate = async (courseData) => {
    try {
      setIsLoading(true);
      const newCourse = await createCourse(courseData, user.id || user.$id);
      setCourses(prev => [newCourse, ...prev]);
      setSelectedCourse(newCourse);
      setIsAddCourseModalOpen(false);
      setActiveTab('files');
      toast.success('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFile) => {
    if (!selectedCourse) {
      toast.error('Please select a course first.');
      return;
    }

    try {
      setIsLoading(true);
      // Note: The file is already uploaded to Azure Storage from the FileUploader component
      // Just update the local state with the new file
      setCourseFiles(prev => [uploadedFile, ...prev]);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      toast.error('Failed to process file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDelete = async (fileId, blobId) => {
    try {
      setIsLoading(true);
      // Delete file from Azure Storage using the blobId
      await deleteFile(blobId || fileId);
      
      // Update local state
      setCourseFiles(prev => prev.filter(file => file.id !== fileId && file.blobId !== blobId));
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesChanged = async () => {
    if (selectedCourse && user) {
      try {
        // Refresh files from Azure Storage
        const files = await getFilesList(user.id || user.$id, selectedCourse.id || selectedCourse.$id);
        setCourseFiles(files);
      } catch (error) {
        console.error('Error refreshing files:', error);
      }
    }
  };

  // Function to generate a study plan
  const handleGenerateStudyPlan = async () => {
    if (!selectedCourse || courseFiles.length === 0) {
      toast.error('Please add files to your course before generating a study plan.');
      return;
    }

    try {
      setIsGeneratingPlan(true);
      // Generate the study plan
      const generatedPlan = await generateStudyPlan(selectedCourse, courseFiles);
      
      // Save the study plan to the database
      const savedPlan = await saveStudyPlan(generatedPlan, selectedCourse.id || selectedCourse.$id, user.id || user.$id);
      
      // Update local state
      setStudyPlan(savedPlan);
      toast.success('Study plan generated successfully!');
      
      // Switch to plan tab
      setActiveTab('plan');
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="heading-1 text-gray-900 dark:text-white">Study Planner</h1>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsAddCourseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Course</span>
          </button>
          {selectedCourse && courseFiles.length > 0 && (
            <button 
              onClick={handleGenerateStudyPlan}
              disabled={isGeneratingPlan}
              className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPlan ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiAward className="h-5 w-5" />
                  <span>Generate Study Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'courses'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('courses')}
        >
          <FiBook className="inline-block mr-2" />
          My Courses
        </button>
        {selectedCourse && (
          <>
            <button
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'files'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('files')}
            >
              <FiFile className="inline-block mr-2" />
              Course Materials
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'plan'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('plan')}
            >
              <FiCalendar className="inline-block mr-2" />
              Study Plan
            </button>
          </>
        )}
      </div>

      {/* Content area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {isLoading && !isGeneratingPlan ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'courses' && (
              <CoursesList 
                courses={courses} 
                onSelectCourse={handleCourseSelect} 
              />
            )}
            
            {activeTab === 'files' && selectedCourse && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedCourse.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{selectedCourse.description}</p>
                </div>
                
                <FileUploader 
                  courseId={selectedCourse.id || selectedCourse.$id} 
                  userId={user.id || user.$id}
                  onFileUploaded={handleFileUpload}
                />
                
                <FilesList 
                  files={courseFiles}
                  courseId={selectedCourse.id || selectedCourse.$id}
                  userId={user.id || user.$id}
                  onFileDeleted={handleFileDelete}
                  onFilesChanged={handleFilesChanged}
                />
              </div>
            )}
            
            {activeTab === 'plan' && selectedCourse && (
              <StudyPlanViewer
                course={selectedCourse}
                files={courseFiles}
                existingPlan={studyPlan}
                isGenerating={isGeneratingPlan}
                setIsGenerating={setIsGeneratingPlan}
              />
            )}
          </>
        )}
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Course</h2>
            <CourseForm 
              onSubmit={handleCourseCreate} 
              onCancel={() => setIsAddCourseModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}