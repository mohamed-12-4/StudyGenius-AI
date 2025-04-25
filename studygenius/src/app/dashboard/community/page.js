"use client";

import { useState, useEffect } from 'react';
import {
  getStudyGroups,
  getCommunityDiscussions,
  getUpcomingEvents,
  getSharedResources,
  getCommunityStats
} from '@/lib/dashboard-service';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiSearch, 
  FiStar, 
  FiPlusCircle, 
  FiFilter, 
  FiBook,
  FiCalendar,
  FiClock,
  FiFileText,
  FiThumbsUp
} from "react-icons/fi";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import NewPostModal from '@/components/community/NewPostModal';
import AIChatbot from '@/components/community/AIChatbot';
import Link from 'next/link';

export default function Community() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [studyGroups, setStudyGroups] = useState([]);
  const [communityDiscussions, setCommunityDiscussions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [sharedResources, setSharedResources] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    studyBuddies: 0,
    activeDiscussions: 0,
    sharedResources: 0
  });

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const handleNewPostClick = () => {
    setIsNewPostModalOpen(true);
  };

  const handleCloseNewPostModal = () => {
    setIsNewPostModalOpen(false);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [groups, discussions, events, resources] = await Promise.all([
          getStudyGroups(),
          getCommunityDiscussions(),
          getUpcomingEvents(),
          getSharedResources()
        ]);

        setStudyGroups(groups);
        setCommunityDiscussions(discussions);
        setUpcomingEvents(events);
        setSharedResources(resources);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getCommunityStats();
        setCommunityStats(stats);
      } catch (error) {
        console.error('Error fetching community stats:', error);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const defaultStudyGroup = {
    id: 'ai-study-group',
    name: 'AI Study Group',
    course: 'Artificial Intelligence',
    members: 100,
    activity: 'High',
    lastActive: 'Just now',
    isMember: true
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Study groups at the top */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiUsers className="inline-block mr-2 text-primary-500" />
            Study Groups
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
            <FiPlusCircle className="mr-1" /> Create Study Group
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {[defaultStudyGroup, ...studyGroups].map((group) => (
                <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{group.course}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{group.members}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        group.activity === 'High'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                          : 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300'
                      }`}
                    >
                      {group.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{group.lastActive}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    {group.isMember ? (
                      <span className="text-success-600 dark:text-success-400 mr-3">Joined</span>
                    ) : (
                      <button className="text-primary-600 hover:text-primary-500 mr-3">Join</button>
                    )}
                    {group.id === 'ai-study-group' ? (
                      <Link href="/dashboard/community/ai-study-group" className="text-primary-600 hover:text-primary-500">
                        View
                      </Link>
                    ) : (
                      <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Chatbot for AI Study Group */}
      <AIChatbot />

      {/* Community stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3">
            <FiUsers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{communityStats.studyBuddies}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Study Buddies</p>
        </div>
        
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mb-3">
            <FiMessageSquare className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{communityStats.activeDiscussions}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Discussions</p>
        </div>
        
        <div className="card flex flex-col items-center p-6">
          <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 mb-3">
            <FiBook className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{communityStats.sharedResources}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Shared Resources</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discussion board section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiMessageSquare className="inline-block mr-2 text-primary-500" />
              Discussion Board
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all discussions
            </button>
          </div>

          <div className="space-y-4">
            {communityDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">{discussion.author.initials}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {discussion.title}
                        {discussion.isHot && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 rounded-full">
                            Hot
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {discussion.timePosted}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">by {discussion.author.name}</span>
                        <span className="text-xs py-0.5 px-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                          {discussion.course}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FiMessageSquare className="h-3 w-3 mr-1" /> {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <FiUsers className="h-3 w-3 mr-1" /> {discussion.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-500 border border-gray-200 dark:border-gray-800 rounded-lg">
              Load More Discussions
            </button>
          </div>
        </div>

        {/* Upcoming events section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3 text-gray-900 dark:text-white">
              <FiCalendar className="inline-block mr-2 text-secondary-500" />
              Upcoming Events
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.organizer}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {event.attendees} / {event.maxAttendees} attending
                  </div>
                  <button className="px-3 py-1 text-xs text-primary-600 hover:text-primary-500 border border-primary-600 hover:border-primary-500 rounded-full">
                    RSVP
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full py-2 text-sm text-secondary-600 hover:text-secondary-500 border border-gray-200 dark:border-gray-800 rounded-lg">
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Shared study resources */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiFileText className="inline-block mr-2 text-primary-500" />
            Shared Resources
          </h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
            <FiPlusCircle className="mr-1" /> Share Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sharedResources.map((resource) => (
            <div 
              key={resource.id} 
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                  resource.type === 'PDF' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300' :
                  resource.type === 'Notes' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                  resource.type === 'Code' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {resource.type}
                </span>
                <div className="flex items-center">
                  <FiStar className="h-3 w-3 text-warning-500 mr-1" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{resource.rating}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{resource.title}</h3>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>{resource.course}</span>
                <span className="mx-1">•</span>
                <span>{resource.timeShared}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-1">
                    <span className="text-xs text-primary-600 dark:text-primary-400">{resource.author.initials}</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{resource.author.name}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <FiThumbsUp className="h-3 w-3 mr-1" />
                  <span>{resource.downloads}</span>
                </div>
              </div>
              
              <button className="w-full mt-3 py-1 text-xs text-primary-600 hover:text-primary-500 border border-gray-200 dark:border-gray-700 rounded">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <NewPostModal onClose={handleCloseNewPostModal} />
      )}
    </div>
  );
}