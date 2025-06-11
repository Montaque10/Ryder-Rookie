import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getSharedRound } from '../services/api';
import CustomButton from '../components/CustomButton';

const RoundShareScreen = () => {
  const route = useRoute();
  const { shareableLink } = route.params;
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRound();
  }, []);

  const fetchRound = async () => {
    try {
      const data = await getSharedRound(shareableLink);
      setRound(data);
    } catch (err) {
      setError(err.message || 'Failed to load round');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `https://rookie-ryder.app/shared-round/${shareableLink}`;
    Clipboard.setString(shareUrl);
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  const handleOpenMap = () => {
    if (round?.course?.latitude && round?.course?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${round.course.latitude},${round.course.longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Course location not available');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!round) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Round not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Shared Round</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Player:</Text>
          <Text style={styles.value}>{round.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Course:</Text>
          <Text style={styles.value}>{round.course_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(round.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Score:</Text>
          <Text style={styles.value}>{round.total_score}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Copy Share Link"
            onPress={handleCopyLink}
            style={styles.button}
          />
          <CustomButton
            title="Open in Maps"
            onPress={handleOpenMap}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});

export default RoundShareScreen; 