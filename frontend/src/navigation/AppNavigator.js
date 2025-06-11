import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import CoursePlannerScreen from '../screens/CoursePlannerScreen';
import OnCourseTrackerScreen from '../screens/OnCourseTrackerScreen';
import MyClubsScreen from '../screens/MyClubsScreen';
import ScorecardScreen from '../screens/ScorecardScreen';
import PracticeTipsScreen from '../screens/PracticeTipsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ApiTest from '../components/ApiTest';
import ApiTestScreen from '../screens/ApiTestScreen';
import PracticeGuidanceScreen from '../screens/PracticeGuidanceScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoundShareScreen from '../screens/RoundShareScreen';
import FriendsScreen from '../screens/FriendsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { theme } = React.useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'My Clubs') {
            iconName = focused ? 'golf' : 'golf-outline';
          } else if (route.name === 'On Course') {
            iconName = focused ? 'flag' : 'flag-outline';
          } else if (route.name === 'Practice') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Course Planner') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Achievements') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Clubs" component={MyClubsScreen} />
      <Tab.Screen name="On Course" component={OnCourseTrackerScreen} />
      <Tab.Screen name="Practice" component={PracticeGuidanceScreen} />
      <Tab.Screen name="Course Planner" component={CoursePlannerScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileSettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useAuth();
  const { theme } = React.useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
        <Stack.Screen name="Scorecard" component={ScorecardScreen} options={{ title: 'Scorecard' }} />
        <Stack.Screen name="PracticeTips" component={PracticeTipsScreen} options={{ title: 'Practice Tips' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ApiTest" component={ApiTestScreen} options={{ title: 'API Test' }} />
        <Stack.Screen name="SharedRound" component={RoundShareScreen} options={{ title: 'Shared Round' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 