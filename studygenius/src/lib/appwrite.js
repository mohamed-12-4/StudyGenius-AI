import { Client, Account, Databases } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('67ebd9d30008916bc91f'); // Replace with your Appwrite project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

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