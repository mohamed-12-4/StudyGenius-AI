import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'StudyGeniusAI',
    slug: 'StudyGeniusAI',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'StudyGeniusAI',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true
    },
    web: {
        bundler: 'metro',
        output: 'single',
        favicon: './assets/images/favicon.png'
    },
    plugins: [
        'expo-router'
    ],
    experiments: {
        typedRoutes: true
    },
    extra: {
        APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
        PROJECT_ID: process.env.PROJECT_ID,
        router: {
            origin: false
        },
        eas: {
            projectId: 'e3f6c5a3-a57c-4414-b1cb-9cb6d5401c21'
        }
    },
    android: {
        package: 'com.mohamedelashmony05.StudyGeniusAI'
    }
}); 