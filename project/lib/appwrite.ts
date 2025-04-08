import { Client, Account, ID } from 'appwrite';
import Constants from 'expo-constants';

const client = new Client()
    .setEndpoint(Constants.expoConfig?.extra?.APPWRITE_ENDPOINT as string)
    .setProject(Constants.expoConfig?.extra?.PROJECT_ID as string);

// Create an Account instance with the required scope
export const account = new Account(client);

// Helper function to ensure we have a valid session
export const ensureSession = async () => {
    try {
        const session = await account.getSession('current');
        return session;
    } catch (error) {
        return null;
    }
};

// Helper function to delete all sessions
export const deleteAllSessions = async () => {
    try {
        const sessions = await account.listSessions();
        for (const session of sessions.sessions) {
            await account.deleteSession(session.$id);
        }
    } catch (error) {
        console.error('Error deleting sessions:', error);
    }
};

// Export the client for other services
export { client }; 