import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { WEATHER_API_KEY, YOUTUBE_API_KEY } from '@env';

const ApiTest = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApis();
  }, []);

  const testApis = async () => {
    try {
      // Test Weather API
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);

      // Test YouTube API
      const youtubeResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=golf+tips&type=video&key=${YOUTUBE_API_KEY}&maxResults=1`
      );
      const youtubeResult = await youtubeResponse.json();
      setYoutubeData(youtubeResult);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Testing APIs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Test Results</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather API Test</Text>
        {weatherData ? (
          <>
            <Text>City: {weatherData.name}</Text>
            <Text>Temperature: {weatherData.main?.temp}°C</Text>
            <Text>Weather: {weatherData.weather?.[0]?.description}</Text>
          </>
        ) : (
          <Text>No weather data received</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YouTube API Test</Text>
        {youtubeData?.items?.[0] ? (
          <>
            <Text>Title: {youtubeData.items[0].snippet.title}</Text>
            <Text>Channel: {youtubeData.items[0].snippet.channelTitle}</Text>
            <Text>Published: {youtubeData.items[0].snippet.publishedAt}</Text>
          </>
        ) : (
          <Text>No YouTube data received</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ApiTest; 