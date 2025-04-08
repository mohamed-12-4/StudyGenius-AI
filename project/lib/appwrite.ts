import { Client, Account } from 'appwrite';
import Constants from 'expo-constants';

const client = new Client()
    .setEndpoint(Constants.expoConfig?.extra?.APPWRITE_ENDPOINT as string)
    .setProject(Constants.expoConfig?.extra?.PROJECT_ID as string);

export const account = new Account(client);

export { client }; 