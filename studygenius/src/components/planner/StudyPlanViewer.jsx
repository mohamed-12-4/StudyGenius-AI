'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiList, FiBookOpen, FiTarget, FiBook, FiRefreshCw, FiDownload, FiFile } from 'react-icons/fi';
import { toast } from 'sonner';
import { generateStudyPlan } from '@/lib/azure-openai';
import { saveStudyPlan } from '@/lib/azure-cosmos'; // Changed from appwrite to azure-cosmos
import { useAuth } from '@/context/AuthContext';

export default function StudyPlanViewer({ course, files, existingPlan, isGenerating, setIsGenerating }) {
  const [studyPlan, setStudyPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth(); // Get user from auth context


  useEffect(() => {
    // Set the study plan when component mounts or when existingPlan changes
    if (existingPlan) {
      try {
        // If the plan is a string (JSON), parse it
        const planData = typeof existingPlan.plan === 'string' 
          ? JSON.parse(existingPlan.plan) 
          : existingPlan.plan;
          
        setStudyPlan(planData);
      } catch (error) {
        console.error('Error parsing study plan:', error);
        setStudyPlan(null);
      }
    } else {
      setStudyPlan(null);
    }
  }, [existingPlan]);

  const handleGenerateStudyPlan = async () => {
    if (!course || files.length === 0) {
      toast.error('Please add files to your course before generating a study plan.');
      return;
    }

    try {
      setIsGenerating(true);
      // Generate the study plan using Azure OpenAI
      const generatedPlan = await generateStudyPlan(course, files);
      
      if (!user) {
        toast.error('User authentication required to save study plan');
        return;
      }
      
      // Save the study plan to Azure Cosmos DB with proper parameters
      const userId = user.id || user.$id;
      const courseId = course.id || course.$id;
      const savedPlan = await saveStudyPlan(generatedPlan, courseId, userId);
      
      // Update local state with the plan data
      const planData = typeof savedPlan.plan === 'string' 
        ? JSON.parse(savedPlan.plan) 
        : savedPlan.plan;
        
      setStudyPlan(planData);
      toast.success('Study plan generated successfully!');
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadStudyPlan = () => {
    if (!studyPlan) return;
    
    try {
      // Convert the study plan to a readable text format
      const planText = formatStudyPlanForDownload(studyPlan);
      
      // Create a blob with the formatted text
      const blob = new Blob([planText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course.name} - Study Plan.txt`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading study plan:', error);
      toast.error('Failed to download study plan.');
    }
  };

  const formatStudyPlanForDownload = (plan) => {
    // Format the study plan as readable text
    let text = `STUDY PLAN FOR: ${course.name}\n`;
    text += `===============================\n\n`;
    
    // Overview
    text += `OVERVIEW:\n${plan.overview || 'No overview available.'}\n\n`;
    
    // Topics
    text += `KEY TOPICS:\n`;
    if (plan.topics && plan.topics.length > 0) {
      plan.topics.forEach((topic, index) => {
        text += `${index + 1}. ${topic.title} (Priority: ${topic.priority})\n`;
        text += `   ${topic.description}\n\n`;
      });
    } else {
      text += `No topics available.\n\n`;
    }
    
    // Schedule
    text += `STUDY SCHEDULE:\n`;
    if (plan.schedule && plan.schedule.weeks && plan.schedule.weeks.length > 0) {
      plan.schedule.weeks.forEach((week, weekIndex) => {
        text += `Week ${weekIndex + 1}:\n`;
        
        if (week.days && week.days.length > 0) {
          week.days.forEach(day => {
            text += `  ${day.day} (${day.duration}):\n`;
            day.activities.forEach(activity => {
              text += `    - ${activity}\n`;
            });
          });
        } else {
          text += `  No daily schedule available.\n`;
        }
        
        text += `\n`;
      });
    } else {
      text += `No schedule available.\n\n`;
    }
    
    // Study techniques
    text += `RECOMMENDED STUDY TECHNIQUES:\n`;
    if (plan.techniques && plan.techniques.length > 0) {
      plan.techniques.forEach((technique, index) => {
        text += `${index + 1}. ${technique.name}\n`;
        text += `   ${technique.description}\n\n`;
      });
    } else {
      text += `No study techniques available.\n\n`;
    }
    
    // Additional resources
    text += `ADDITIONAL RESOURCES:\n`;
    if (plan.resources && plan.resources.length > 0) {
      plan.resources.forEach((resource, index) => {
        text += `${index + 1}. ${resource.title}\n`;
        text += `   ${resource.description}\n`;
        if (resource.url) {
          text += `   URL: ${resource.url}\n`;
        }
        text += `\n`;
      });
    } else {
      text += `No additional resources available.\n\n`;
    }
    
    text += `===============================\n`;
    text += `Generated by StudyGenius AI on ${new Date().toLocaleDateString()}`;
    
    return text;
  };

  // If there's no study plan yet
  if (!studyPlan && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <FiCalendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No study plan yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Generate a personalized study plan based on your course materials.
        </p>
        <button 
          onClick={handleGenerateStudyPlan}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <FiRefreshCw className="h-5 w-5" />
          <span>Generate Study Plan</span>
        </button>
      </div>
    );
  }

  // Show loading state while generating
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Generating Study Plan</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Our AI is analyzing your course materials and creating a personalized study plan...
        </p>
      </div>
    );
  }

  // If we have a study plan, display it with tabs for different sections
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Study Plan: {course.name}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateStudyPlan}
            className="flex items-center gap-2 px-3 py-1.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors text-sm"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Regenerate</span>
          </button>
          <button
            onClick={downloadStudyPlan}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
          >
            <FiDownload className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Overview section */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">{studyPlan.overview}</p>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'overview'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <FiBookOpen className="inline-block mr-2" />
          Overview
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'topics'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('topics')}
        >
          <FiList className="inline-block mr-2" />
          Topics
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'schedule'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('schedule')}
        >
          <FiCalendar className="inline-block mr-2" />
          Schedule
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'techniques'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('techniques')}
        >
          <FiTarget className="inline-block mr-2" />
          Techniques
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'resources'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('resources')}
        >
          <FiBook className="inline-block mr-2" />
          Resources
        </button>
      </div>

      {/* Tab content */}
      <div className="py-4">
        {/* Topics tab */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Key Topics</h3>
            {studyPlan.topics && studyPlan.topics.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {studyPlan.topics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{topic.title}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        topic.priority === 'High' 
                          ? 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200' 
                          : topic.priority === 'Medium'
                            ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200'
                            : 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                      }`}>
                        {topic.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{topic.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No topics available.</p>
            )}
          </div>
        )}

        {/* Schedule tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Study Schedule</h3>
            {studyPlan.schedule && studyPlan.schedule.weeks && studyPlan.schedule.weeks.length > 0 ? (
              <div className="space-y-8">
                {studyPlan.schedule.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Week {weekIndex + 1}</h4>
                    
                    {week.days && week.days.length > 0 ? (
                      <div className="space-y-4">
                        {week.days.map((day, dayIndex) => (
                          <div key={dayIndex} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">{day.day}</h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <FiClock className="mr-1" /> {day.duration}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {day.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                  <span className="text-primary-500 mr-2">•</span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No daily schedule available for this week.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No schedule available.</p>
            )}
          </div>
        )}

        {/* Techniques tab */}
        {activeTab === 'techniques' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Study Techniques</h3>
            {studyPlan.techniques && studyPlan.techniques.length > 0 ? (
              <div className="space-y-4">
                {studyPlan.techniques.map((technique, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{technique.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{technique.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No study techniques available.</p>
            )}
          </div>
        )}

        {/* Resources tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Resources</h3>
            {studyPlan.resources && studyPlan.resources.length > 0 ? (
              <div className="space-y-4">
                {studyPlan.resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{resource.description}</p>
                    {resource.url && (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Visit resource
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No additional resources available.</p>
            )}
          </div>
        )}

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-gray-500 dark:text-gray-400 w-36">Name:</span>
                    <span className="text-gray-900 dark:text-white">{course.name}</span>
                  </div>
                  {course.subject && (
                    <div className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 w-36">Subject:</span>
                      <span className="text-gray-900 dark:text-white">{course.subject}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="text-gray-500 dark:text-gray-400 w-36">Difficulty:</span>
                    <span className="text-gray-900 dark:text-white">
                      {course.difficultyLevel === 'beginner' ? 'Beginner' : 
                       course.difficultyLevel === 'medium' ? 'Intermediate' : 
                       course.difficultyLevel === 'advanced' ? 'Advanced' : 'Not specified'}
                    </span>
                  </div>
                  {course.estimatedHours && (
                    <div className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 w-36">Est. Hours:</span>
                      <span className="text-gray-900 dark:text-white">{course.estimatedHours} hours</span>
                    </div>
                  )}
                  {course.startDate && (
                    <div className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 w-36">Start Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(course.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {course.endDate && (
                    <div className="flex items-start">
                      <span className="text-gray-500 dark:text-gray-400 w-36">End Date:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Study Materials</h3>
                {files && files.length > 0 ? (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                        <FiFile className="mr-2 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
                )}
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Plan Summary</h3>
              <p className="text-gray-600 dark:text-gray-300">{studyPlan.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}