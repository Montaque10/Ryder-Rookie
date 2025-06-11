import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getAchievements, getUserAchievements } from '../services/api';

const AchievementsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [achievementsRes, userAchievementsRes] = await Promise.all([
        getAchievements(),
        getUserAchievements(),
      ]);
      setAchievements(achievementsRes.data);
      setUserAchievements(userAchievementsRes.data);
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAchievementEarned = (achievementId) => {
    return userAchievements.some(ua => ua.achievement.id === achievementId);
  };

  const renderAchievement = ({ item }) => {
    const earned = isAchievementEarned(item.id);
    const dateAchieved = userAchievements.find(ua => ua.achievement.id === item.id)?.date_achieved;

    return (
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.header}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: theme.accent }]} />
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
            {earned && (
              <Text style={[styles.dateAchieved, { color: theme.accent }]}>
                Achieved: {new Date(dateAchieved).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
        <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
        {earned && (
          <View style={[styles.badge, { backgroundColor: theme.accent }]}>
            <Text style={styles.badgeText}>✓ Earned</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.accent }]}
          onPress={fetchData}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateAchieved: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementsScreen; 