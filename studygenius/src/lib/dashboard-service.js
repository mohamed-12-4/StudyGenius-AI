'use server';

import { getUserCourses, getCourse } from './azure-cosmos';
import { getDashboardStats, recordUserLogin } from './user-stats';
import {
  getStudyGroupsFromDb,
  getCommunityDiscussionsFromDb,
  getUpcomingEventsFromDb,
  getSharedResourcesFromDb
} from './azure-cosmos';

/**
 * Get upcoming tasks from study plans across all user courses
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of upcoming tasks
 */
export const getUpcomingTasks = async (userId) => {
  try {
    // Get all courses for the user
    const courses = await getUserCourses(userId);
    
    // Filter courses that have study plans
    const coursesWithPlans = courses.filter(course => course.studyPlan && course.studyPlan.plan);
    
    if (coursesWithPlans.length === 0) {
      return [];
    }
    
    const today = new Date();
    const upcoming = [];
    
    // Process each course and its study plan
    for (const course of coursesWithPlans) {
      let plan;
      
      // Parse the plan if it's a string, otherwise use the object directly
      try {
        plan = typeof course.studyPlan.plan === 'string' 
          ? JSON.parse(course.studyPlan.plan) 
          : course.studyPlan.plan;
      } catch (error) {
        console.error(`Error parsing study plan for course ${course.id}:`, error);
        continue;
      }
      
      // Skip if no schedule in the plan
      if (!plan.schedule || !plan.schedule.weeks || !plan.schedule.weeks.length) {
        continue;
      }

      // Calculate the start date based on course.startDate or plan generation date
      let startDate;
      if (course.startDate) {
        startDate = new Date(course.startDate);
      } else if (course.studyPlan.generated) {
        startDate = new Date(course.studyPlan.generated);
      } else {
        startDate = new Date(course.createdAt);
      }
      
      // Process each week in the schedule
      plan.schedule.weeks.forEach((week, weekIndex) => {
        if (!week.days || !week.days.length) {
          return;
        }
        
        // Calculate the date for this week based on start date
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(startDate.getDate() + (weekIndex * 7));
        
        // Process each day in the week
        week.days.forEach(day => {
          if (!day.activities || !day.activities.length) {
            return;
          }
          
          // Map day names to day indices (0 = Sunday, 1 = Monday, etc.)
          const dayMap = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
          };
          
          // Get the day index
          const dayName = day.day.toLowerCase();
          const dayIndex = dayMap[dayName];
          
          if (dayIndex === undefined) {
            return;
          }
          
          // Calculate the exact date for this day
          const taskDate = new Date(weekStartDate);
          const diff = (dayIndex - weekStartDate.getDay() + 7) % 7;
          taskDate.setDate(weekStartDate.getDate() + diff);
          
          // Skip past tasks
          if (taskDate < today) {
            return;
          }
          
          // Format the due date
          let dueDate;
          const diffDays = Math.round((taskDate - today) / (24 * 60 * 60 * 1000));
          
          if (diffDays === 0) {
            dueDate = 'Today';
          } else if (diffDays === 1) {
            dueDate = 'Tomorrow';
          } else if (diffDays < 7) {
            dueDate = taskDate.toLocaleDateString('en-US', { weekday: 'long' });
          } else {
            dueDate = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
          
          // Add each activity as a task
          day.activities.forEach((activity, index) => {
            // Determine priority based on date and course difficulty
            let priority;
            if (diffDays <= 3) {
              priority = 'high';
            } else if (diffDays <= 7) {
              priority = 'medium';
            } else {
              priority = 'low';
            }
            
            // For demonstration, set a random completion percentage
            // In a real app, this would come from user progress tracking
            const completion = diffDays <= 1 ? 
              Math.floor(Math.random() * 80) : 
              diffDays <= 3 ? 
                Math.floor(Math.random() * 50) : 
                Math.floor(Math.random() * 30);
            
            upcoming.push({
              id: `${course.id}_${weekIndex}_${dayName}_${index}`,
              title: activity,
              course: course.name,
              courseId: course.id,
              dueDate,
              rawDate: taskDate,
              priority,
              completion
            });
          });
        });
      });
    }
    
    // Sort by due date (closest first)
    upcoming.sort((a, b) => a.rawDate - b.rawDate);
    
    // Limit to the closest 10 tasks
    return upcoming.slice(0, 10);
  } catch (error) {
    console.error("Error getting upcoming tasks:", error);
    return [];
  }
};

/**
 * Get course progress for all user courses
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of course progress objects
 */
export const getCourseProgress = async (userId) => {
  try {
    // Get all courses for the user
    const courses = await getUserCourses(userId);
    
    if (!courses || courses.length === 0) {
      return [];
    }
    
    const today = new Date();
    const progress = [];
    
    // Process each course
    for (const course of courses) {
      // Skip courses without start/end dates
      if (!course.startDate || !course.endDate) {
        continue;
      }
      
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      
      // Skip courses that haven't started yet
      if (startDate > today) {
        continue;
      }
      
      // Calculate progress percentage based on time elapsed
      const totalDuration = endDate - startDate;
      const elapsed = today - startDate;
      
      // Cap at 100% for courses past their end date
      let percentage = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
      
      // Ensure minimum progress of 5% for started courses
      percentage = Math.max(percentage, 5);
      
      progress.push({
        id: course.id,
        name: course.name,
        progress: percentage
      });
    }
    
    // Sort by progress (highest first)
    progress.sort((a, b) => b.progress - a.progress);
    
    return progress;
  } catch (error) {
    console.error("Error getting course progress:", error);
    return [];
  }
};

/**
 * Get recommended resources based on course materials and topics
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of recommended resources
 */
export const getRecommendedResources = async (userId) => {
  try {
    // Get all courses for the user
    const courses = await getUserCourses(userId);
    
    // Filter courses that have study plans
    const coursesWithPlans = courses.filter(course => course.studyPlan && course.studyPlan.plan);
    
    if (coursesWithPlans.length === 0) {
      return [];
    }
    
    const recommendations = [];
    
    // Process each course and its study plan
    for (const course of coursesWithPlans) {
      let plan;
      
      try {
        plan = typeof course.studyPlan.plan === 'string' 
          ? JSON.parse(course.studyPlan.plan) 
          : course.studyPlan.plan;
      } catch (error) {
        console.error(`Error parsing study plan for course ${course.id}:`, error);
        continue;
      }
      
      // Skip if no resources in the plan
      if (!plan.resources || !plan.resources.length) {
        continue;
      }
      
      // Get resources from the plan
      plan.resources.forEach(resource => {
        // Determine resource type based on URL or description
        let type = 'Article';
        if (resource.url) {
          if (resource.url.includes('youtube') || resource.url.includes('vimeo')) {
            type = 'Video';
          } else if (resource.url.includes('quiz') || resource.url.includes('test')) {
            type = 'Quiz';
          } else if (resource.url.includes('slides') || resource.url.includes('presentation')) {
            type = 'Slides';
          }
        } else if (resource.description) {
          if (resource.description.toLowerCase().includes('video')) {
            type = 'Video';
          } else if (resource.description.toLowerCase().includes('quiz') || 
                    resource.description.toLowerCase().includes('test')) {
            type = 'Quiz';
          } else if (resource.description.toLowerCase().includes('slides') || 
                    resource.description.toLowerCase().includes('presentation')) {
            type = 'Slides';
          }
        }
        
        // Estimate duration based on resource type
        let duration;
        switch (type) {
          case 'Video':
            duration = '10-15 min';
            break;
          case 'Quiz':
            duration = '15 questions';
            break;
          case 'Slides':
            duration = '20 slides';
            break;
          default:
            duration = '5-10 min read';
        }
        
        recommendations.push({
          id: `${course.id}_${recommendations.length}`,
          title: resource.title,
          type,
          duration,
          course: course.name,
          courseId: course.id,
          url: resource.url || '#',
          description: resource.description
        });
      });
    }
    
    // Get a mixed selection of resources from different courses
    const selected = [];
    const courseIds = [...new Set(recommendations.map(r => r.courseId))];
    
    // Try to get at least one resource from each course
    courseIds.forEach(id => {
      const courseResources = recommendations.filter(r => r.courseId === id);
      if (courseResources.length > 0) {
        // Get a random resource from this course
        const randomIndex = Math.floor(Math.random() * courseResources.length);
        selected.push(courseResources[randomIndex]);
      }
    });
    
    // Add more random resources until we have enough
    while (selected.length < 6 && recommendations.length > selected.length) {
      const remaining = recommendations.filter(r => !selected.includes(r));
      if (remaining.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * remaining.length);
      selected.push(remaining[randomIndex]);
    }
    
    return selected;
  } catch (error) {
    console.error("Error getting recommended resources:", error);
    return [];
  }
};

/**
 * Fetch study groups for the community page
 * @returns {Promise<Array>} Array of study groups
 */
export const getStudyGroups = async () => {
  return await getStudyGroupsFromDb();
};

/**
 * Fetch community discussions for the community page
 * @returns {Promise<Array>} Array of discussions
 */
export const getCommunityDiscussions = async () => {
  return await getCommunityDiscussionsFromDb();
};

/**
 * Fetch upcoming events for the community page
 * @returns {Promise<Array>} Array of events
 */
export const getUpcomingEvents = async () => {
  return await getUpcomingEventsFromDb();
};

/**
 * Fetch shared resources for the community page
 * @returns {Promise<Array>} Array of shared resources
 */
export const getSharedResources = async () => {
  return await getSharedResourcesFromDb();
};

/**
 * Fetch community stats for the community page
 * @returns {Promise<Object>} Object containing stats (studyBuddies, activeDiscussions, sharedResources)
 */
export const getCommunityStats = async () => {
  try {
    const [studyGroups, discussions, resources] = await Promise.all([
      getStudyGroupsFromDb(),
      getCommunityDiscussionsFromDb(),
      getSharedResourcesFromDb()
    ]);

    return {
      studyBuddies: studyGroups.length,
      activeDiscussions: discussions.length,
      sharedResources: resources.length
    };
  } catch (error) {
    console.error("Error fetching community stats:", error);
    throw error;
  }
};

/**
 * Get all dashboard data needed for display
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Complete dashboard data
 */
export const getDashboardData = async (userId) => {
  try {
    // Record the user login and update stats
    await recordUserLogin(userId);
    
    // Get all data types in parallel
    const [stats, upcomingTasks, courseProgress, recommendedResources] = await Promise.all([
      getDashboardStats(userId),
      getUpcomingTasks(userId),
      getCourseProgress(userId),
      getRecommendedResources(userId)
    ]);
    
    // Calculate total weekly study hours
    const totalWeeklyHours = upcomingTasks.reduce((total, task) => {
      // Estimate 1-2 hours per task
      return total + (Math.random() * 1 + 1);
    }, 0);
    
    return {
      stats,
      upcomingTasks,
      courseProgress,
      recommendedResources,
      weeklyProgress: {
        current: Math.round(totalWeeklyHours * 10) / 10, // Round to 1 decimal place
        target: 20 // Default target hours per week
      }
    };
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
};

/**
 * Create a new discussion post
 * @param {Object} discussionData - The discussion data (title, content)
 * @returns {Promise<Object>} The created discussion
 */
export const createDiscussion = async (discussionData) => {
  try {
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discussionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create discussion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
};