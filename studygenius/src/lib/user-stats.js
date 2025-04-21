'use server';

import { CosmosClient } from "@azure/cosmos";

// Azure Cosmos DB configuration
const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "studygenius";
const statsContainerId = "user_stats";

// Initialize the Cosmos client
const client = new CosmosClient({ endpoint, key });

// Initialize database and container
let database;
let statsContainer;

/**
 * Ensures that the database and user_stats container exist
 * @returns {Promise<void>}
 */
const ensureStatsDbSetup = async () => {
  try {
    // Create database if it doesn't exist
    const { database: dbResponse } = await client.databases.createIfNotExists({
      id: databaseId
    });
    database = dbResponse;

    // Create user_stats container if it doesn't exist
    const { container } = await database.containers.createIfNotExists({
      id: statsContainerId,
      partitionKey: { paths: ["/userId"] }
    });
    statsContainer = container;
    
    console.log("User stats database and container setup completed");
  } catch (error) {
    console.error("Error setting up user stats database and container:", error);
    throw error;
  }
};

// Simple database reference - will be initialized properly before use
database = client.database(databaseId);
statsContainer = database.container(statsContainerId);

/**
 * Get user stats or create if they don't exist
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The user stats object
 */
export const getUserStats = async (userId) => {
  try {
    // Ensure database and container exist
    await ensureStatsDbSetup();
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [
        { name: "@userId", value: userId }
      ]
    };
    
    const { resources } = await statsContainer.items.query(querySpec).fetchAll();
    
    // If user stats don't exist yet, create them
    if (resources.length === 0) {
      const newStats = {
        id: `stats_${userId}`,
        userId,
        points: 0,
        streak: 0,
        lastLogin: null,
        loginDates: [],
        focusTime: 0,
        coursesCompleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { resource } = await statsContainer.items.create(newStats);
      return resource;
    }
    
    return resources[0];
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
};

/**
 * Record a user login and update points/streak
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Updated user stats
 */
export const recordUserLogin = async (userId) => {
  try {
    // Ensure database and container exist
    await ensureStatsDbSetup();
    
    // Get or create user stats
    const userStats = await getUserStats(userId);
    
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if the user already logged in today
    const alreadyLoggedInToday = userStats.loginDates.includes(today);
    
    if (!alreadyLoggedInToday) {
      // Add today to login dates
      userStats.loginDates.push(today);
      
      // Award daily login points (10 points per day)
      userStats.points += 10;
      
      // Check and update streak
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (userStats.loginDates.includes(yesterdayStr)) {
        // Increment streak if they logged in yesterday
        userStats.streak += 1;
        
        // Bonus points for streak milestones
        if (userStats.streak % 7 === 0) {
          // Weekly streak bonus (50 points)
          userStats.points += 50;
        } else if (userStats.streak % 30 === 0) {
          // Monthly streak bonus (200 points)
          userStats.points += 200;
        }
      } else if (userStats.lastLogin) {
        // Reset streak if they didn't log in yesterday
        userStats.streak = 1;
      } else {
        // First login ever
        userStats.streak = 1;
      }
      
      // Update last login
      userStats.lastLogin = now.toISOString();
      userStats.updatedAt = now.toISOString();
      
      // Save updated stats
      const { resource } = await statsContainer.item(userStats.id, userId).replace(userStats);
      return resource;
    }
    
    return userStats;
  } catch (error) {
    console.error("Error recording user login:", error);
    throw error;
  }
};

/**
 * Update focus time for a user
 * @param {string} userId - The user ID
 * @param {number} minutes - Minutes to add to focus time
 * @returns {Promise<Object>} Updated user stats
 */
export const updateFocusTime = async (userId, minutes) => {
  try {
    // Ensure database and container exist
    await ensureStatsDbSetup();
    
    // Get current stats
    const userStats = await getUserStats(userId);
    
    // Update focus time (adds to existing)
    userStats.focusTime += minutes;
    
    // Award points for focus time (1 point per minute)
    userStats.points += minutes;
    
    userStats.updatedAt = new Date().toISOString();
    
    // Save updated stats
    const { resource } = await statsContainer.item(userStats.id, userId).replace(userStats);
    return resource;
  } catch (error) {
    console.error("Error updating focus time:", error);
    throw error;
  }
};

/**
 * Record a completed course for a user
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID
 * @returns {Promise<Object>} Updated user stats
 */
export const recordCompletedCourse = async (userId, courseId) => {
  try {
    // Ensure database and container exist
    await ensureStatsDbSetup();
    
    // Get current stats
    const userStats = await getUserStats(userId);
    
    // Initialize completed courses array if it doesn't exist
    if (!userStats.completedCourses) {
      userStats.completedCourses = [];
    }
    
    // Check if already completed
    if (!userStats.completedCourses.includes(courseId)) {
      // Add to completed courses
      userStats.completedCourses.push(courseId);
      
      // Update counter
      userStats.coursesCompleted = userStats.completedCourses.length;
      
      // Award points for completing a course (100 points)
      userStats.points += 100;
      
      userStats.updatedAt = new Date().toISOString();
      
      // Save updated stats
      const { resource } = await statsContainer.item(userStats.id, userId).replace(userStats);
      return resource;
    }
    
    return userStats;
  } catch (error) {
    console.error("Error recording completed course:", error);
    throw error;
  }
};

/**
 * Get dashboard stats for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async (userId) => {
  try {
    // Get user stats
    const userStats = await getUserStats(userId);
    
    // Format focus time for display
    const focusTimeHours = Math.floor(userStats.focusTime / 60);
    const focusTimeMinutes = userStats.focusTime % 60;
    const formattedFocusTime = `${focusTimeHours ? `${focusTimeHours} hrs` : ''} ${focusTimeMinutes ? `${focusTimeMinutes} min` : ''}`.trim() || '0 min';
    
    // Format points for display
    const formattedPoints = userStats.points.toLocaleString();
    
    return {
      streak: `${userStats.streak} days`,
      focusTime: formattedFocusTime,
      coursesCompleted: userStats.coursesCompleted,
      points: formattedPoints,
      lastLogin: userStats.lastLogin
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
};