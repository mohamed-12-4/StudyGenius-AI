import { Client, Account, Databases, Query, ID } from 'appwrite';

// Initialize Appwrite client
const appwriteEndpoint = 'https://fra.cloud.appwrite.io/v1'
const appwriteProject = '67ebd9d30008916bc91f'
const client = new Client();

client
    .setEndpoint(appwriteEndpoint) 
    .setProject(appwriteProject); 

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);



// Helper function to verify session in API routes
export const verifySession = async (request) => {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return null;
    }

    // Check if it's a Bearer token
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('Found JWT token in Authorization header');
      
      // Create a new client instance with the JWT token
      const apiClient = new Client();
      apiClient
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProject)
        .setJWT(token);
      
      // Try to get the current user with this JWT
      const apiAccount = new Account(apiClient);
      try {
        const user = await apiAccount.get();
        if (user) {
          return user.$id; // Return the user ID
        }
      } catch (error) {
        console.error('Invalid JWT token:', error);
        return null;
      }
    } else {
      console.log('Authorization header is not a Bearer token');
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
};

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
        
        // Create a new session with cookies that work across the application
        const session = await account.createEmailPasswordSession(email, password);
        
        // Explicitly create a client with the session for use in the browser
        const clientSession = new Client()
            .setEndpoint(appwriteEndpoint)
            .setProject(appwriteProject)
            .setSession(session.secret); // Use session secret to ensure cookies are set properly
        
        return session;
    } catch (error) {
        // If we still get "active session" error, try one more time with a forceful approach
        if (error.message && error.message.includes('session is active')) {
            try {
                // Try to delete all sessions for this user before creating a new one
                await logout();
                return await account.createEmailPasswordSession(email, password);
            } catch (secondError) {
                console.error('Error in second login attempt:', secondError);
                throw secondError;
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

// Helper to get JWT token for API authentication
export const getJWT = async () => {
    try {
        // Create a JWT token using the Appwrite SDK
        const token = await account.createJWT();
        if (token) {
            return token.jwt;
        }
        return null;
    } catch (error) {
        console.error('Error getting JWT token:', error);
        return null;
    }
};

// Helper function to make authenticated API calls
export const callApi = async (url, method = 'GET', data = null) => {
    try {
        // Get JWT token
        const jwt = await getJWT();
        if (!jwt) {
            throw new Error('Failed to get authentication token');
        }
        
        // Prepare fetch options
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        };
        
        // Add body for non-GET requests
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        // Make the API call
        const response = await fetch(url, options);
        
        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error calling API ${url}:`, error);
        throw error;
    }
};
