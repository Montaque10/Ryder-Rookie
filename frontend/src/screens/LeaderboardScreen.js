import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getLeaderboard } from '../services/api';
import { Picker } from '@react-native-picker/picker';

const LeaderboardScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('average_score');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedMetric]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeaderboard(selectedMetric);
      setLeaderboardData(response.data);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderLeaderboardItem = ({ item, index }) => {
    const isCurrentUser = item.username === 'current_user'; // Replace with actual current user check
    const value = selectedMetric === 'average_score' 
      ? `${item.value} strokes`
      : `${item.value} rounds`;

    return (
      <View style={[
        styles.row,
        { backgroundColor: isCurrentUser ? theme.accent + '20' : theme.cardBackground }
      ]}>
        <Text style={[styles.rank, { color: theme.text }]}>#{item.rank}</Text>
        <Text style={[styles.username, { color: theme.text }]}>{item.username}</Text>
        <Text style={[styles.value, { color: theme.accent }]}>{value}</Text>
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
          onPress={fetchLeaderboard}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.pickerContainer, { backgroundColor: theme.cardBackground }]}>
        <Picker
          selectedValue={selectedMetric}
          onValueChange={setSelectedMetric}
          style={[styles.picker, { color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label="Average Score" value="average_score" />
          <Picker.Item label="Total Rounds" value="total_rounds" />
        </Picker>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
        keyExtractor={item => item.username}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.headerText, { color: theme.text }]}>Rank</Text>
            <Text style={[styles.headerText, { color: theme.text }]}>Player</Text>
            <Text style={[styles.headerText, { color: theme.text }]}>
              {selectedMetric === 'average_score' ? 'Score' : 'Rounds'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  list: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  rank: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    flex: 2,
    fontSize: 16,
    textAlign: 'center',
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default LeaderboardScreen; 