'use client';

import { useState, useEffect } from 'react';
import { FiBookOpen, FiClock, FiCalendar, FiMap, FiSearch, FiSave, FiPlus } from "react-icons/fi";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { generateLearningRoadmap, generateResourceSuggestions } from '@/lib/azure-openai'; // Add generateResourceSuggestions
import { createRoadmap, getUserRoadmaps, getRoadmap } from '@/lib/azure-cosmos'; // Using correct function names
import RoadmapViewer from '@/components/resources/RoadmapViewer';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Resources() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(4); // Default 4 weeks
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResources, setIsGeneratingResources] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Load user's saved roadmaps when auth is complete
  useEffect(() => {
    async function loadRoadmaps() {
      if (authLoading) {
        // Still loading auth state, wait
        return;
      }
      
      if (!user) {
        setIsLoading(false);
        toast.error('Please log in to access your roadmaps');
        router.push('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const roadmaps = await getUserRoadmaps(user.id || user.$id);
        setSavedRoadmaps(roadmaps || []);
      } catch (error) {
        console.error('Error loading roadmaps:', error);
        toast.error('Failed to load your saved roadmaps');
      } finally {
        setIsLoading(false);
      }
    }

    loadRoadmaps();
  }, [user, authLoading, router]);

  const handleRoadmapSelect = (roadmap) => {
    setSelectedRoadmap(roadmap);
    
    // Parse the roadmap if stored as a string
    if (roadmap && typeof roadmap.roadmap === 'string') {
      try {
        const parsedRoadmap = JSON.parse(roadmap.roadmap);
        setRoadmap(parsedRoadmap);
      } catch (error) {
        console.error('Error parsing roadmap:', error);
        toast.error('Failed to parse the selected roadmap');
      }
    } else if (roadmap && roadmap.roadmap) {
      setRoadmap(roadmap.roadmap);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to generate a roadmap');
      router.push('/login');
      return;
    }

    try {
      setIsGenerating(true);
      toast.info('Generating your learning roadmap. This may take a minute...');
      
      // Generate the roadmap using Azure OpenAI
      const generatedRoadmap = await generateLearningRoadmap(topic, duration);
      
      // Save the roadmap
      const savedRoadmap = await createRoadmap(
        {
          roadmap: JSON.stringify(generatedRoadmap),
          topic,
          durationWeeks: duration,
          userId: user.$id // Use $id consistently as that's how AppWrite stores user IDs
        }, user.id || user.$id
      );
      
      // Update the roadmap list
      setSavedRoadmaps(prevRoadmaps => [savedRoadmap, ...prevRoadmaps]);
      
      // Set the roadmap to display
      setRoadmap(generatedRoadmap);
      setSelectedRoadmap(savedRoadmap);
      
      toast.success('Learning roadmap generated successfully!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Improved generateAdditionalResources function that properly uses the generateResourceSuggestions function
  const handleGenerateAdditionalResources = async () => {
    if (!roadmap || !topic) {
      toast.error('Please generate or select a roadmap first');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to generate additional resources');
      router.push('/login');
      return;
    }

    try {
      setIsGeneratingResources(true);
      toast.info('Looking for additional learning resources...');
      
      // Generate additional resources using Azure OpenAI's dedicated suggestion function
      const additionalResources = await generateResourceSuggestions(topic);
      
      // Make sure we have resources from the API
      if (!additionalResources || additionalResources.length === 0) {
        throw new Error('No additional resources found. Try a different topic.');
      }
      
      // Update the roadmap with new resources
      const currentResources = roadmap.resources || [];
      const updatedRoadmap = {
        ...roadmap,
        resources: [...currentResources, ...additionalResources]
      };
      
      // Update state
      setRoadmap(updatedRoadmap);
      
      // If this is a saved roadmap, update it in the database
      if (selectedRoadmap && selectedRoadmap.id) {
        const updatedSavedRoadmap = await createRoadmap({
          id: selectedRoadmap.id,
          roadmap: JSON.stringify(updatedRoadmap),
          topic: selectedRoadmap.topic,
          durationWeeks: selectedRoadmap.durationWeeks,
          userId: user.$id  // Use $id consistently here too
        });
        
        // Update the roadmap in the list
        setSavedRoadmaps(prevRoadmaps => 
          prevRoadmaps.map(r => r.id === selectedRoadmap.id ? updatedSavedRoadmap : r)
        );
        setSelectedRoadmap(updatedSavedRoadmap);
      }
      
      toast.success('Additional learning resources added!');
    } catch (error) {
      console.error('Error generating additional resources:', error);
      toast.error('Failed to find additional resources. Please try again.');
    } finally {
      setIsGeneratingResources(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Verifying your session...</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1 text-gray-900 dark:text-white">Resources Roadmap</h1>
      </div>

      {/* Generate Roadmap Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          <FiMap className="inline-block mr-2" /> Generate Learning Roadmap
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What would you like to learn?
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, Web Development, Data Science"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration in weeks
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={4}>4 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={isGenerating || !topic.trim()}
            className="w-full flex items-center justify-center gap-2 p-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FiSearch className="h-4 w-4" />
                <span>Generate Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Roadmaps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            <FiBookOpen className="inline-block mr-2" /> Your Roadmaps
          </h2>
        </div>
        
        {savedRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRoadmaps.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRoadmapSelect(item)}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                  selectedRoadmap && selectedRoadmap.id === item.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.topic}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">
                    {item.durationWeeks} weeks
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1 h-3 w-3" />
                  <span>
                    Created on {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FiMap className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">No roadmaps yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Create a learning roadmap to organize resources for a specific topic.
            </p>
          </div>
        )}
      </div>

      {/* Roadmap Viewer */}
      {roadmap && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <RoadmapViewer 
            roadmap={roadmap} 
            topic={selectedRoadmap?.topic || topic}
            duration={selectedRoadmap?.durationWeeks || duration}
          />
          
          {/* Add button to generate additional resources */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGenerateAdditionalResources}
              disabled={isGeneratingResources}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingResources ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4" />
                  <span>Find Additional Resources</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}