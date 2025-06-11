import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getFriends, searchUsers, addFriend, removeFriend } from '../services/api';
import CustomButton from '../components/CustomButton';

const FriendsScreen = () => {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const data = await getFriends();
      setFriends(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchTerm(text);
    if (text.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await searchUsers(text);
      setSearchResults(results);
    } catch (err) {
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await addFriend(userId);
      Alert.alert('Success', 'Friend added successfully');
      fetchFriends();
      setSearchResults([]);
      setSearchTerm('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      Alert.alert('Success', 'Friend removed successfully');
      fetchFriends();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to remove friend');
    }
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image
        source={
          item.friend_profile_picture
            ? { uri: item.friend_profile_picture }
            : require('../../assets/default-avatar.png')
        }
        style={styles.profilePicture}
      />
      <Text style={styles.username}>{item.friend_username}</Text>
      <CustomButton
        title="Remove"
        onPress={() => handleRemoveFriend(item.id)}
        style={styles.removeButton}
      />
    </View>
  );

  const renderSearchResult = ({ item }) => (
    <View style={styles.searchItem}>
      <Image
        source={
          item.profile_picture
            ? { uri: item.profile_picture }
            : require('../../assets/default-avatar.png')
        }
        style={styles.profilePicture}
      />
      <Text style={styles.username}>{item.username}</Text>
      <CustomButton
        title="Add"
        onPress={() => handleAddFriend(item.id)}
        style={styles.addButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        {searchLoading && <ActivityIndicator style={styles.searchLoader} />}
      </View>

      {searchTerm.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No users found</Text>
            }
          />
        </View>
      )}

      <View style={styles.friendsContainer}>
        <Text style={styles.sectionTitle}>My Friends</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No friends yet</Text>
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  searchLoader: {
    position: 'absolute',
    right: 32,
    top: 24,
  },
  searchResultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  friendsContainer: {
    flex: 2,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    width: 80,
  },
  removeButton: {
    width: 80,
    backgroundColor: '#ff4444',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});

export default FriendsScreen; 