'use client';

import { useEffect, useState } from 'react';
import { FiCalendar, FiBook, FiClock, FiTrendingUp, FiAward, FiUsers, FiArrowRight } from "react-icons/fi";
import { toast } from 'sonner';
import { getDashboardData } from '@/lib/dashboard-service';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      streak: "0 days",
      focusTime: "0 hrs",
      coursesCompleted: 0,
      points: "0"
    },
    upcomingTasks: [],
    courseProgress: [],
    recommendedResources: [],
    weeklyProgress: {
      current: 0,
      target: 20
    }
  });

  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Use the user ID from auth context
        const userId = user.id || user.$id;
        const data = await getDashboardData(userId);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Stats cards configuration
  const stats = [
    { 
      name: "Study Streak", 
      value: dashboardData.stats.streak, 
      icon: FiTrendingUp, 
      color: "text-primary-500" 
    },
    { 
      name: "Focus Time", 
      value: dashboardData.stats.focusTime, 
      icon: FiClock, 
      color: "text-secondary-500" 
    },
    { 
      name: "Courses", 
      value: `${dashboardData.courseProgress.length} active`, 
      icon: FiBook, 
      color: "text-success-500" 
    },
    { 
      name: "Points", 
      value: dashboardData.stats.points, 
      icon: FiAward, 
      color: "text-warning-500" 
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1 text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Today is</span>
          <span className="font-medium text-gray-900 dark:text-white">{formattedDate}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card bg-white dark:bg-gray-900 flex items-center p-4">
            <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')}/10 mr-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming tasks section */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-3 text-gray-900 dark:text-white">Upcoming Study Tasks</h2>
            <Link href="/dashboard/planner" className="text-sm text-primary-600 hover:text-primary-500 flex items-center">
              View all tasks <FiArrowRight className="ml-1" />
            </Link>
          </div>

          <div className="overflow-hidden">
            {dashboardData.upcomingTasks.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {dashboardData.upcomingTasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          task.priority === 'high' ? 'bg-danger-500' : 
                          task.priority === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                        }`}></span>
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{task.course}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              task.completion >= 75 ? 'bg-success-500' : 
                              task.completion >= 25 ? 'bg-warning-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${task.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.completion}%</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FiCalendar className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">No upcoming tasks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Add a course and generate a study plan to see your tasks here.
                </p>
                <Link 
                  href="/dashboard/planner" 
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add a course
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Weekly schedule preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-3 text-gray-900 dark:text-white">Weekly Overview</h2>
            <Link href="/dashboard/planner" className="text-sm text-primary-600 hover:text-primary-500">
              <FiCalendar className="inline mr-1" /> Full Schedule
            </Link>
          </div>
          
          <div className="space-y-3">
            {/* Hours studied this week */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Hours Studied</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dashboardData.weeklyProgress.current} / {dashboardData.weeklyProgress.target} hrs
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${(dashboardData.weeklyProgress.current / dashboardData.weeklyProgress.target) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Courses progress */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</h3>
              
              {dashboardData.courseProgress.length > 0 ? (
                dashboardData.courseProgress.slice(0, 3).map((course) => (
                  <div key={course.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[70%]">{course.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          course.progress >= 75 ? 'bg-success-500' : 
                          course.progress >= 25 ? 'bg-primary-500' : 'bg-secondary-500'
                        }`} 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No active courses yet
                  </p>
                </div>
              )}
              
              {dashboardData.courseProgress.length > 3 && (
                <div className="text-center">
                  <Link href="/dashboard/planner" className="text-sm text-primary-600 hover:underline">
                    +{dashboardData.courseProgress.length - 3} more courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiAward className="inline-block mr-2 text-secondary-500" />
            AI-Recommended Resources
          </h2>
          <Link href="/dashboard/planner" className="text-sm text-primary-600 hover:text-primary-500">
            View all resources
          </Link>
        </div>

        {dashboardData.recommendedResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recommendedResources.map((resource) => (
              <div key={resource.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium py-1 px-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {resource.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{resource.duration}</span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{resource.course}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="mt-3 text-sm text-primary-600 hover:text-primary-500 inline-block"
                >
                  View Resource
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FiBook className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-2" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">No resources yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add courses and generate study plans to get AI-recommended resources.
            </p>
            <Link 
              href="/dashboard/planner" 
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add a course
            </Link>
          </div>
        )}
      </div>

      {/* Community activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-3 text-gray-900 dark:text-white">
            <FiUsers className="inline-block mr-2 text-primary-500" />
            Community Activity
          </h2>
          <Link href="/dashboard/community" className="text-sm text-primary-600 hover:text-primary-500">
            Join a study group
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">JD</span>
              </div>
            </div>
            <div>
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Jane Doe</span>
                <span className="text-gray-500 dark:text-gray-400"> shared notes for </span>
                <span className="font-medium text-gray-900 dark:text-white">Physics 101</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                "These quantum mechanics summary notes helped me a lot for the midterm!"
              </p>
              <div className="mt-2 flex space-x-2">
                <button className="text-xs text-primary-600 hover:text-primary-500">
                  View Notes
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Thank (12)
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-secondary-600 font-medium">MS</span>
              </div>
            </div>
            <div>
              <div className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Math Study Group</span>
                <span className="text-gray-500 dark:text-gray-400"> is holding a session on </span>
                <span className="font-medium text-gray-900 dark:text-white">Linear Algebra</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                "Join us tomorrow at 6 PM for a collaborative problem-solving session!"
              </p>
              <div className="mt-2 flex space-x-2">
                <button className="text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 px-2 py-1 rounded">
                  Join Session
                </button>
                <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  8 attending
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}