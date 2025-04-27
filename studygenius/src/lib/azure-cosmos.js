'use server';

import { CosmosClient } from "@azure/cosmos";
import { ID } from "appwrite";

// Azure Cosmos DB configuration
const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
const key = process.env.AZURE_COSMOS_KEY;
const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "studygenius";
const coursesContainerId = "courses";

// Initialize the Cosmos client
const client = new CosmosClient({ endpoint, key });

// Initialize database and container with creation if they don't exist
let database;
let coursesContainer;

// Initialize database and container references for roadmaps
const roadmapsContainerId = "roadmaps";
let roadmapsContainer;

/**
 * Ensures that the database and container exist before any operations
 * @returns {Promise<void>}
 */
const ensureDbSetup = async () => {
  try {
    // Create database if it doesn't exist
    const { database: dbResponse } = await client.databases.createIfNotExists({
      id: databaseId
    });
    database = dbResponse;

    // Create courses container if it doesn't exist
    const { container: coursesResponse } = await database.containers.createIfNotExists({
      id: coursesContainerId,
      partitionKey: { paths: ["/id"] }
    });
    coursesContainer = coursesResponse;
    
    // Create roadmaps container if it doesn't exist
    const { container: roadmapsResponse } = await database.containers.createIfNotExists({
      id: roadmapsContainerId,
      partitionKey: { paths: ["/id"] }
    });
    roadmapsContainer = roadmapsResponse;
    
    console.log("Database and containers setup completed");
  } catch (error) {
    console.error("Error setting up database and containers:", error);
    throw error;
  }
};

// Simple database reference - will be initialized properly before use
database = client.database(databaseId);
coursesContainer = database.container(coursesContainerId);

// Initialize the roadmaps container reference
roadmapsContainer = database.container(roadmapsContainerId);

/**
 * Create a new course in Cosmos DB
 * @param {Object} courseData - The course data
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The created course
 */
export const createCourse = async (courseData, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    const timestamp = new Date().toISOString();
    const course = {
      ...courseData,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    console.log("Creating course:", course);
    
    const { resource } = await coursesContainer.items.create(course);
    return resource;
  } catch (error) {
    console.error("Error creating course in Cosmos DB:", error);
    throw error;
  }
};

/**
 * Get a course by ID
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The course data
 */
export const getCourse = async (courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @courseId AND c.userId = @userId",
      parameters: [
        { name: "@courseId", value: courseId },
        { name: "@userId", value: userId }
      ]
    };
    
    const { resources } = await coursesContainer.items.query(querySpec).fetchAll();
    return resources[0];
  } catch (error) {
    console.error("Error getting course from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Get all courses for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of course objects
 */
export const getUserCourses = async (userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    const querySpec = {
      query: "SELECT * FROM c where c.userId = @userId",
      parameters: [
        { name: "@userId", value: userId }
      ]
    };
    
    const { resources } = await coursesContainer.items.query(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error("Error getting user courses from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Update a course
 * @param {string} courseId - The course ID
 * @param {Object} courseData - The updated course data
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The updated course
 */
export const updateCourse = async (courseId, courseData, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // First get the existing course to ensure it exists and belongs to the user
    const existingCourse = await getCourse(courseId, userId);
    
    if (!existingCourse) {
      throw new Error("Course not found or access denied");
    }
    
    const updatedCourse = {
      ...existingCourse,
      ...courseData,
      updatedAt: new Date().toISOString()
    };
    
    const { resource } = await coursesContainer.item(courseId, courseId).replace(updatedCourse);
    return resource;
  } catch (error) {
    console.error("Error updating course in Cosmos DB:", error);
    throw error;
  }
};

/**
 * Delete a course
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<void>}
 */
export const deleteCourse = async (courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // First get the existing course to ensure it exists and belongs to the user
    const existingCourse = await getCourse(courseId, userId);
    
    if (!existingCourse) {
      throw new Error("Course not found or access denied");
    }
    
    await coursesContainer.item(courseId, courseId).delete();
  } catch (error) {
    console.error("Error deleting course from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Save a study plan for a course
 * @param {Object} studyPlan - The study plan data
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The updated course with study plan
 */
export const saveStudyPlan = async (studyPlan, courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // First get the existing course
    const existingCourse = await getCourse(courseId, userId);
    
    if (!existingCourse) {
      console.error(`Course not found for ID: ${courseId}, userID: ${userId}`);
      throw new Error("Course not found or access denied");
    }
    
    console.log(`Found course ${existingCourse.name} (${existingCourse.id}), updating with study plan`);
    
    const updatedCourse = {
      ...existingCourse,
      studyPlan,
      updatedAt: new Date().toISOString()
    };
    
    const { resource } = await coursesContainer.item(courseId, courseId).replace(updatedCourse);
    return resource.studyPlan;
  } catch (error) {
    console.error("Error saving study plan in Cosmos DB:", error);
    throw error;
  }
};

/**
 * Get a study plan for a course
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The study plan data or null if no plan exists
 */
export const getStudyPlan = async (courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // Get the course that contains the study plan
    const course = await getCourse(courseId, userId);
    
    if (!course) {
      throw new Error("Course not found or access denied");
    }
    
    // Return the study plan if it exists, otherwise return null
    return course.studyPlan || null;
  } catch (error) {
    console.error("Error getting study plan from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Add a file record to a course
 * @param {Object} fileData - The file data including blobId, name, size, type
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Object>} The updated course with the file added
 */
export const addFileRecord = async (fileData, courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // Get the existing course
    const course = await getCourse(courseId, userId);
    
    if (!course) {
      throw new Error("Course not found or access denied");
    }
    
    // Initialize files array if it doesn't exist
    if (!course.files) {
      course.files = [];
    }
    
    // Create a unique ID for the file record
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the file record
    const fileRecord = {
      id: fileId,
      ...fileData,
      courseId,
      createdAt: new Date().toISOString()
    };
    
    // Add the file record to the course
    course.files.push(fileRecord);
    course.updatedAt = new Date().toISOString();
    
    // Update the course in the database
    const { resource } = await coursesContainer.item(courseId, courseId).replace(course);
    
    // Return the newly created file record
    return fileRecord;
  } catch (error) {
    console.error("Error adding file record to Cosmos DB:", error);
    throw error;
  }
};

/**
 * Delete a file record from a course
 * @param {string} fileId - The file record ID
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<void>}
 */
export const deleteFileRecord = async (fileId, courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // Get the existing course
    const course = await getCourse(courseId, userId);
    
    if (!course) {
      throw new Error("Course not found or access denied");
    }
    
    // Check if the course has files
    if (!course.files || !Array.isArray(course.files)) {
      throw new Error("No files found for this course");
    }
    
    // Find the file index
    const fileIndex = course.files.findIndex(file => file.id === fileId);
    
    if (fileIndex === -1) {
      throw new Error("File not found in this course");
    }
    
    // Remove the file from the array
    course.files.splice(fileIndex, 1);
    course.updatedAt = new Date().toISOString();
    
    // Update the course in the database
    await coursesContainer.item(courseId, courseId).replace(course);
  } catch (error) {
    console.error("Error deleting file record from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Get files for a course
 * @param {string} courseId - The course ID
 * @param {string} userId - The user ID who owns the course
 * @returns {Promise<Array>} Array of file records
 */
export const getCourseFiles = async (courseId, userId) => {
  try {
    // Ensure database and container exist
    await ensureDbSetup();
    
    // Get the course that contains the files
    const course = await getCourse(courseId, userId);
    
    if (!course) {
      throw new Error("Course not found or access denied");
    }
    
    // Return the files if they exist, otherwise return an empty array
    return course.files || [];
  } catch (error) {
    console.error("Error getting course files from Cosmos DB:", error);
    throw error;
  }
};

/**
 * Initialize database and container references for community data
 */
const studyGroupsContainerId = "studyGroups";
const communityDiscussionsContainerId = "communityDiscussions";
const upcomingEventsContainerId = "upcomingEvents";
const sharedResourcesContainerId = "sharedResources";

let studyGroupsContainer;
let communityDiscussionsContainer;
let upcomingEventsContainer;
let sharedResourcesContainer;

const ensureCommunityDbSetup = async () => {
  try {
    // Create studyGroups container if it doesn't exist
    const { container: studyGroupsResponse } = await database.containers.createIfNotExists({
      id: studyGroupsContainerId,
      partitionKey: { paths: ["/id"] }
    });
    studyGroupsContainer = studyGroupsResponse;

    // Create communityDiscussions container if it doesn't exist
    const { container: communityDiscussionsResponse } = await database.containers.createIfNotExists({
      id: communityDiscussionsContainerId,
      partitionKey: { paths: ["/id"] }
    });
    communityDiscussionsContainer = communityDiscussionsResponse;

    // Create upcomingEvents container if it doesn't exist
    const { container: upcomingEventsResponse } = await database.containers.createIfNotExists({
      id: upcomingEventsContainerId,
      partitionKey: { paths: ["/id"] }
    });
    upcomingEventsContainer = upcomingEventsResponse;

    // Create sharedResources container if it doesn't exist
    const { container: sharedResourcesResponse } = await database.containers.createIfNotExists({
      id: sharedResourcesContainerId,
      partitionKey: { paths: ["/id"] }
    });
    sharedResourcesContainer = sharedResourcesResponse;

    console.log("Community database and containers setup completed");
  } catch (error) {
    console.error("Error setting up community database and containers:", error);
    throw error;
  }
};

// Initialize the community containers
studyGroupsContainer = database.container(studyGroupsContainerId);
communityDiscussionsContainer = database.container(communityDiscussionsContainerId);
upcomingEventsContainer = database.container(upcomingEventsContainerId);
sharedResourcesContainer = database.container(sharedResourcesContainerId);

/**
 * Fetch all study groups
 * @returns {Promise<Array>} Array of study groups
 */
export const getStudyGroupsFromDb = async () => {
  try {
    await ensureCommunityDbSetup();
    const { resources } = await studyGroupsContainer.items.query("SELECT * FROM c").fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching study groups:", error);
    throw error;
  }
};

/**
 * Fetch all community discussions
 * @returns {Promise<Array>} Array of community discussions
 */
export const getCommunityDiscussionsFromDb = async () => {
  try {
    await ensureCommunityDbSetup();
    const { resources } = await communityDiscussionsContainer.items.query("SELECT * FROM c").fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching community discussions:", error);
    throw error;
  }
};

/**
 * Fetch all upcoming events
 * @returns {Promise<Array>} Array of upcoming events
 */
export const getUpcomingEventsFromDb = async () => {
  try {
    await ensureCommunityDbSetup();
    const { resources } = await upcomingEventsContainer.items.query("SELECT * FROM c").fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};

/**
 * Fetch all shared resources
 * @returns {Promise<Array>} Array of shared resources
 */
export const getSharedResourcesFromDb = async () => {
  try {
    await ensureCommunityDbSetup();
    const { resources } = await sharedResourcesContainer.items.query("SELECT * FROM c").fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching shared resources:", error);
    throw error;
  }
};

/**
 * Create a new community
 * @param {Object} communityData - The community data (name, description)
 * @param {string} userId - The user ID who creates the community
 * @returns {Promise<Object>} The created community
 */
export const createCommunity = async (communityData, userId) => {
  try {
    await ensureCommunityDbSetup();
    const timestamp = new Date().toISOString();
    const community = {
      ...communityData,
      ownerId: userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    const { resource } = await studyGroupsContainer.items.create(community);
    return resource;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
};

/**
 * Create a new post in a community
 * @param {string} communityId - The community ID
 * @param {string} userId - The user ID who posts
 * @param {string} content - The post content
 * @param {Array} attachments - Array of attachment objects { blobId, name, url, contentType, size }
 * @returns {Promise<Object>} The created post
 */
export const createPost = async (communityId, userId, content, attachments = []) => {
  try {
    await ensureCommunityDbSetup();
    const timestamp = new Date().toISOString();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const post = {
      id: uniqueId, // Explicitly set a unique ID
      communityId,
      userId,
      content,
      attachments,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const { resource } = await communityDiscussionsContainer.items.create(post);
    return resource;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

/**
 * Get all posts for a community
 * @param {string} communityId - The community ID
 * @returns {Promise<Array>} Array of post objects
 */
export const getCommunityPosts = async (communityId) => {
  try {
    await ensureCommunityDbSetup();
    const querySpec = {
      query: "SELECT * FROM c WHERE c.communityId = @communityId ORDER BY c.createdAt DESC",
      parameters: [
        { name: "@communityId", value: communityId }
      ]
    };
    const { resources } = await communityDiscussionsContainer.items.query(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error("Error getting community posts from Cosmos DB:", error);
    throw error;
  }
};