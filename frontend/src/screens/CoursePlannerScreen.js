import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getWeather, searchCourses } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const CoursePlannerScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getWeather({ city });
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchCoursesByQuery = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await searchCourses({ search: searchQuery });
      setCourses(response.data);
    } catch (err) {
      setError('Failed to search courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Weather Check
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.card }]}
            placeholder="Enter city name"
            placeholderTextColor={theme.colors.textSecondary}
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={fetchWeather}
          >
            <Text style={styles.buttonText}>Check Weather</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator color={theme.colors.primary} />}
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
        
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cityName, { color: theme.colors.text }]}>
              {weather.city_name}
            </Text>
            <View style={styles.weatherInfo}>
              <Image
                source={{ uri: getWeatherIcon(weather.icon_code) }}
                style={styles.weatherIcon}
              />
              <View>
                <Text style={[styles.temperature, { color: theme.colors.text }]}>
                  {weather.temperature}°C
                </Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {weather.description}
                </Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Feels like: {weather.feels_like}°C
              </Text>
              <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Humidity: {weather.humidity}%
              </Text>
              <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Wind: {weather.wind_speed} m/s
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Find a Course
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.card }]}
            placeholder="Search courses by name or location"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={searchCoursesByQuery}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator color={theme.colors.primary} />}
        {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={[styles.courseCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.courseInfo}>
              <Text style={[styles.courseName, { color: theme.colors.text }]}>
                {course.name}
              </Text>
              <Text style={[styles.courseLocation, { color: theme.colors.textSecondary }]}>
                {course.city}, {course.state}
              </Text>
              <Text style={[styles.courseDetails, { color: theme.colors.textSecondary }]}>
                {course.number_of_holes} holes • Par {course.par}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  button: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  weatherCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherIcon: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  courseDetails: {
    fontSize: 14,
  },
  error: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default CoursePlannerScreen; 