import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import CustomButton from '../components/CustomButton';
import { getPracticeTips, getDrivingRanges } from '../services/api';

const PracticeGuidanceScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('tips');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [practiceTips, setPracticeTips] = useState([]);
  const [drivingRanges, setDrivingRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: '', label: 'All' },
    { id: 'DRIVING', label: 'Driving' },
    { id: 'PUTTING', label: 'Putting' },
    { id: 'CHIPPING', label: 'Chipping' },
    { id: 'IRON_PLAY', label: 'Iron Play' },
    { id: 'COURSE_MANAGEMENT', label: 'Course Management' },
  ];

  const difficulties = [
    { id: '', label: 'All Levels' },
    { id: '1', label: 'Beginner' },
    { id: '2', label: 'Beginner-Intermediate' },
    { id: '3', label: 'Intermediate' },
    { id: '4', label: 'Intermediate-Advanced' },
    { id: '5', label: 'Advanced' },
  ];

  const fetchPracticeTips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPracticeTips(selectedCategory, selectedDifficulty);
      setPracticeTips(response.data);
    } catch (err) {
      setError('Failed to fetch practice tips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivingRanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDrivingRanges(searchCity);
      setDrivingRanges(response.data);
    } catch (err) {
      setError('Failed to fetch driving ranges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tips') {
      fetchPracticeTips();
    }
  }, [activeTab, selectedCategory, selectedDifficulty]);

  const renderPracticeTip = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
      <View style={styles.metaInfo}>
        <Text style={[styles.category, { color: theme.accent }]}>{item.category_display}</Text>
        <Text style={[styles.difficulty, { color: theme.accent }]}>{item.difficulty_display}</Text>
      </View>
      {item.youtube_link && (
        <CustomButton
          title="Watch Video"
          onPress={() => Linking.openURL(item.youtube_link)}
          style={styles.videoButton}
        />
      )}
    </View>
  );

  const renderDrivingRange = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.address, { color: theme.text }]}>{item.address}</Text>
      <Text style={[styles.city, { color: theme.text }]}>{item.city}, {item.state}</Text>
      {item.phone_number && (
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone_number}`)}>
          <Text style={[styles.phone, { color: theme.accent }]}>{item.phone_number}</Text>
        </TouchableOpacity>
      )}
      {item.website && (
        <TouchableOpacity onPress={() => Linking.openURL(item.website)}>
          <Text style={[styles.website, { color: theme.accent }]}>Visit Website</Text>
        </TouchableOpacity>
      )}
      {item.latitude && item.longitude && (
        <CustomButton
          title="Open in Maps"
          onPress={() => Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
          )}
          style={styles.mapButton}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'tips' && { backgroundColor: theme.accent }
          ]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, { color: theme.text }]}>Practice Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'ranges' && { backgroundColor: theme.accent }
          ]}
          onPress={() => setActiveTab('ranges')}
        >
          <Text style={[styles.tabText, { color: theme.text }]}>Find Ranges</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'tips' ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  selectedCategory === category.id && { backgroundColor: theme.accent }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[styles.filterText, { color: theme.text }]}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {difficulties.map(difficulty => (
              <TouchableOpacity
                key={difficulty.id}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty.id && { backgroundColor: theme.accent }
                ]}
                onPress={() => setSelectedDifficulty(difficulty.id)}
              >
                <Text style={[styles.filterText, { color: theme.text }]}>{difficulty.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color={theme.accent} />
          ) : error ? (
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
          ) : (
            <FlatList
              data={practiceTips}
              renderItem={renderPracticeTip}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: theme.cardBackground, color: theme.text }]}
              placeholder="Enter city name"
              placeholderTextColor={theme.textSecondary}
              value={searchCity}
              onChangeText={setSearchCity}
            />
            <CustomButton
              title="Find Ranges"
              onPress={fetchDrivingRanges}
              style={styles.searchButton}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={theme.accent} />
          ) : error ? (
            <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
          ) : (
            <FlatList
              data={drivingRanges}
              renderItem={renderDrivingRange}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    width: 100,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
  },
  difficulty: {
    fontSize: 12,
  },
  address: {
    fontSize: 14,
    marginBottom: 4,
  },
  city: {
    fontSize: 14,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
  },
  website: {
    fontSize: 14,
    marginBottom: 8,
  },
  videoButton: {
    marginTop: 8,
  },
  mapButton: {
    marginTop: 8,
  },
  error: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PracticeGuidanceScreen; 