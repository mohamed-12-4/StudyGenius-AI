import { Client, Account, Databases, Query, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('67ebd9d30008916bc91f'); // Replace with your Appwrite project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = 'studygenius'; // Replace with your database ID
export const COURSES_COLLECTION_ID = 'courses';
export const FILES_COLLECTION_ID = 'files';
export const STUDY_PLANS_COLLECTION_ID = 'study_plans';

// Helper functions for authentication
export const createUser = async (email, password, name) => {
    try {
        // First try to delete any existing session to prevent the "active session" error
        try {
            await logout();
        } catch (e) {
            // Ignore errors from logout
            console.log('No active session to logout from or insufficient permissions');
        }
        
        // Create the user account
        const newAccount = await account.create('unique()', email, password, name);
        
        if (newAccount) {
            try {
                // Login immediately after successful signup
                return await login(email, password);
            } catch (loginError) {
                // If login fails after account creation, we should still return the account
                console.error('Error logging in after account creation:', loginError);
                return newAccount;
            }
        }
        return newAccount;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        // First try to get the current user to check if there's an active session
        try {
            const currentUser = await account.get();
            if (currentUser) {
                // If there's an active session, delete it before creating a new one
                await account.deleteSession('current');
            }
        } catch (e) {
            // Ignore errors from getting current user - this typically means no active session
            console.log('No active session detected');
        }
        
        // Create a new session
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        // If we still get "active session" error, try one more time with a forceful approach
        if (error.message && error.message.includes('session is active')) {
            try {
                // Try to delete all sessions for this user before creating a new one
                const sessions = await account.listSessions();
                for (const session of sessions.sessions) {
                    try {
                        await account.deleteSession(session.$id);
                    } catch (deleteError) {
                        console.log(`Failed to delete session ${session.$id}:`, deleteError);
                    }
                }
                
                // Try to create a session again after deleting all
                return await account.createEmailPasswordSession(email, password);
            } catch (innerError) {
                console.error('Error handling active session:', innerError);
                throw innerError;
            }
        }
        
        console.error('Error logging in:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        if (error.code === 401 || error.message.includes('missing scope')) {
            // This is expected for guests or when not logged in, so just return null
            console.log('User not authenticated or missing permissions');
            return null;
        }
        console.error('Error getting current user:', error);
        return null;
    }
};

export const logout = async () => {
    try {
        return await account.deleteSession('current');
    } catch (error) {
        if (error.code === 401 || error.message.includes('missing scope')) {
            // This is expected for guests or when not logged in
            console.log('No active session to log out from or insufficient permissions');
            return null;
        }
        console.error('Error logging out:', error);
        return null;
    }
};

// Helper to check if user is logged in
export const isLoggedIn = async () => {
    try {
        const user = await getCurrentUser();
        return !!user;
    } catch (error) {
        return false;
    }
};

// Helper to get all active sessions
export const getActiveSessions = async () => {
    try {
        return await account.listSessions();
    } catch (error) {
        if (error.code === 401 || error.message.includes('missing scope')) {
            // This is expected for guests
            console.log('Unable to list sessions - user not authenticated or missing permissions');
            return [];
        }
        console.error('Error getting sessions:', error);
        return [];
    }
};

// Course Management Functions
export const createCourse = async (courseData) => {
    try {
        const userId = (await getCurrentUser()).$id;
        
        // Create course document
        const course = await databases.createDocument(
            DATABASE_ID,
            COURSES_COLLECTION_ID,
            ID.unique(),
            {
                ...courseData,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );
        
        return course;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const course = await databases.updateDocument(
            DATABASE_ID,
            COURSES_COLLECTION_ID,
            courseId,
            {
                ...courseData,
                updatedAt: new Date().toISOString(),
            }
        );
        
        return course;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COURSES_COLLECTION_ID,
            courseId
        );
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

export const getCourse = async (courseId) => {
    try {
        const course = await databases.getDocument(
            DATABASE_ID,
            COURSES_COLLECTION_ID,
            courseId
        );
        
        return course;
    } catch (error) {
        console.error('Error getting course:', error);
        throw error;
    }
};

export const getUserCourses = async () => {
    try {
        const userId = (await getCurrentUser()).$id;
        
        const courses = await databases.listDocuments(
            DATABASE_ID,
            COURSES_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.orderDesc('updatedAt')
            ]
        );
        
        return courses.documents;
    } catch (error) {
        console.error('Error getting user courses:', error);
        throw error;
    }
};

// File Management Functions
export const addFileRecord = async (fileData, courseId) => {
    try {
        const userId = (await getCurrentUser()).$id;
        
        const file = await databases.createDocument(
            DATABASE_ID,
            FILES_COLLECTION_ID,
            ID.unique(),
            {
                ...fileData,
                userId,
                courseId,
                createdAt: new Date().toISOString(),
            }
        );
        
        return file;
    } catch (error) {
        console.error('Error adding file record:', error);
        throw error;
    }
};

export const deleteFileRecord = async (fileId) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            FILES_COLLECTION_ID,
            fileId
        );
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting file record:', error);
        throw error;
    }
};

export const getCourseFiles = async (courseId) => {
    try {
        const files = await databases.listDocuments(
            DATABASE_ID,
            FILES_COLLECTION_ID,
            [
                Query.equal('courseId', courseId),
                Query.orderDesc('createdAt')
            ]
        );
        
        return files.documents;
    } catch (error) {
        console.error('Error getting course files:', error);
        throw error;
    }
};

// Study Plan Management Functions
export const saveStudyPlan = async (studyPlanData, courseId) => {
    try {
        const userId = (await getCurrentUser()).$id;
        
        // Check if a study plan already exists for this course
        const existingPlans = await databases.listDocuments(
            DATABASE_ID,
            STUDY_PLANS_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.equal('courseId', courseId),
            ]
        );
        
        if (existingPlans.documents.length > 0) {
            // Update existing study plan
            const studyPlan = await databases.updateDocument(
                DATABASE_ID,
                STUDY_PLANS_COLLECTION_ID,
                existingPlans.documents[0].$id,
                {
                    ...studyPlanData,
                    updatedAt: new Date().toISOString(),
                }
            );
            
            return studyPlan;
        } else {
            // Create new study plan
            const studyPlan = await databases.createDocument(
                DATABASE_ID,
                STUDY_PLANS_COLLECTION_ID,
                ID.unique(),
                {
                    ...studyPlanData,
                    userId,
                    courseId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            );
            
            return studyPlan;
        }
    } catch (error) {
        console.error('Error saving study plan:', error);
        throw error;
    }
};

export const getStudyPlan = async (courseId) => {
    try {
        const userId = (await getCurrentUser()).$id;
        
        const studyPlans = await databases.listDocuments(
            DATABASE_ID,
            STUDY_PLANS_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.equal('courseId', courseId),
            ]
        );
        
        return studyPlans.documents.length > 0 ? studyPlans.documents[0] : null;
    } catch (error) {
        console.error('Error getting study plan:', error);
        throw error;
    }
};