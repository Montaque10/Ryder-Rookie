import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api/'; // Django backend API base URL
const AUTH_BASE_URL = 'http://127.0.0.1:8000/auth/'; // Djoser authentication base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication API Calls ---
export const registerUser = (data) => authApi.post('users/', data);
export const loginUser = async (data) => {
  const response = await authApi.post('jwt/create/', data);
  await AsyncStorage.setItem('accessToken', response.data.access);
  await AsyncStorage.setItem('refreshToken', response.data.refresh);
  return response.data;
};
export const getUserProfile = () => api.get('users/me/');
export const updateToken = async (refreshToken) => {
  const response = await authApi.post('jwt/refresh/', { refresh: refreshToken });
  await AsyncStorage.setItem('accessToken', response.data.access);
  return response.data.access;
};
export const logoutUser = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};

// --- User Profile & Clubs API Calls ---
export const getClubs = () => api.get('clubs/');
export const createClub = (data) => api.post('clubs/', data);
export const updateClub = (id, data) => api.put(`clubs/${id}/`, data);
export const deleteClub = (id) => api.delete(`clubs/${id}/`);

// --- Course & Round API Calls ---
export const getCourses = () => api.get('courses/');
export const createRound = (data) => api.post('rounds/', data);
export const getRound = (id) => api.get(`rounds/${id}/`);
export const updateRound = (id, data) => api.patch(`rounds/${id}/`, data);
export const getRounds = () => api.get('rounds/');
export const getRoundDetails = (id) => api.get(`rounds/${id}/`);
export const createHoleScore = (data) => api.post('hole-scores/', data);
export const updateHoleScore = (id, data) => api.patch(`hole-scores/${id}/`, data);
export const calculateRoundScore = (roundId) => api.post(`rounds/${roundId}/calculate_total_score/`);
export const getHoleScoreForRoundAndHole = async (roundId, holeNumber) => {
  try {
    const response = await api.get(`hole-scores/`, {
      params: { round: roundId, hole_number: holeNumber }
    });
    return response.data.results[0] || null;
  } catch (err) {
    return null;
  }
};

// --- Intelligent Club Suggestion API Call ---
export const suggestClub = (distance) => api.get(`suggest-club/?distance=${distance}`);

// --- Smart Planning & Course Selection API Call ---
export const courseSearchAndWeather = (city) => api.get(`course-search-weather/?city=${city}`);

// --- Improvement & Practice Guidance API Call ---
export const getPracticeTips = (category = '', difficulty = '') => 
  api.get('practice-tips/', { 
    params: { 
      category: category || undefined,
      difficulty: difficulty || undefined
    }
  });

export const getDrivingRanges = (city = '', name = '') => 
  api.get('driving-ranges/', { 
    params: { 
      city: city || undefined,
      name: name || undefined
    }
  });

// --- Gamification & Community API Calls ---
export const getAchievements = () => api.get('achievements/');
export const getUserAchievements = () => api.get('user-achievements/');
export const getLeaderboard = (metric) => api.get('leaderboard/', { params: { metric } });
export const getClubSuggestion = (distance) => api.post('club-suggestion/', { distance_to_target: distance });

export const getWeather = (params) => api.get('weather/', { params });
export const searchCourses = (params) => api.get('courses/', { params });

export const updateUserProfile = async (userId, data, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/users/${userId}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// --- Social Sharing & Friend System API Calls ---
export const shareRound = (roundId) => api.post(`rounds/${roundId}/share_round/`);
export const getSharedRound = (shareableLink) => api.get(`shared_round/${shareableLink}/`);
export const getFriends = () => api.get('friendships/');
export const addFriend = (friendId) => api.post('friendships/', { friend: friendId });
export const removeFriend = (friendId) => api.delete('friendships/remove_friend/', { data: { friend_id: friendId } });
export const searchUsers = (searchTerm) => api.get('users/search_users/', { params: { search_term: searchTerm } }); 