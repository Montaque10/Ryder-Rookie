import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/api';
import CustomButton from '../components/CustomButton';

const ProfileSettingsScreen = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    handicap: '',
    bio: '',
    preferred_region: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        handicap: user.handicap?.toString() || '',
        bio: user.bio || '',
        preferred_region: user.preferred_region || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await updateUserProfile(user.id, formData, token);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            user.profile_picture
              ? { uri: user.profile_picture }
              : require('../../assets/default-avatar.png')
          }
          style={styles.profilePicture}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Handicap</Text>
          <TextInput
            style={styles.input}
            value={formData.handicap}
            onChangeText={(text) => setFormData({ ...formData, handicap: text })}
            keyboardType="decimal-pad"
            placeholder="Enter your handicap"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Region</Text>
          <TextInput
            style={styles.input}
            value={formData.preferred_region}
            onChangeText={(text) =>
              setFormData({ ...formData, preferred_region: text })
            }
            placeholder="Enter your preferred region"
          />
        </View>

        <CustomButton
          title={loading ? 'Updating...' : 'Save Changes'}
          onPress={handleUpdateProfile}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ProfileSettingsScreen; 