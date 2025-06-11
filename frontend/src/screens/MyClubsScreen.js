import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getClubs, deleteClub } from '../services/api';
import { ThemeContext } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import ClubForm from '../components/ClubForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyClubsScreen = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const isFocused = useIsFocused();
  const theme = React.useContext(ThemeContext);
  const { colors, spacing, borderRadius, shadows, typography } = theme;

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getClubs();
      setClubs(response.data);
    } catch (err) {
      setError('Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchClubs();
  }, [isFocused]);

  const handleDelete = (clubId) => {
    Alert.alert('Delete Club', 'Are you sure you want to delete this club?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteClub(clubId);
            setSuccessMsg('Club deleted!');
            fetchClubs();
          } catch (err) {
            setError('Failed to delete club.');
          }
        }
      }
    ]);
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingClub(null);
    setModalVisible(true);
  };

  const handleFormClose = (refresh = false) => {
    setModalVisible(false);
    setEditingClub(null);
    if (refresh) {
      setSuccessMsg(editingClub ? 'Club updated!' : 'Club added!');
      fetchClubs();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.lg,
      marginTop: spacing.md,
    },
    title: {
      ...typography.h1,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    clubCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...shadows.light,
    },
    clubInfo: {
      flex: 1,
    },
    clubType: {
      ...typography.h3,
      color: colors.secondary,
    },
    clubDistance: {
      ...typography.body,
      color: colors.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
    fab: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.lg,
      backgroundColor: colors.accent,
      borderRadius: 32,
      width: 64,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.medium,
      zIndex: 10,
    },
    fabIcon: {
      color: '#fff',
      fontSize: 32,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    msg: {
      textAlign: 'center',
      color: colors.success,
      marginBottom: spacing.sm,
    },
    error: {
      textAlign: 'center',
      color: colors.error,
      marginBottom: spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clubs</Text>
      </View>
      {successMsg ? <Text style={styles.msg}>{successMsg}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.clubCard}>
              <View style={styles.clubInfo}>
                <Text style={styles.clubType}>{item.club_type}</Text>
                <Text style={styles.clubDistance}>{item.average_distance_yards ? `${item.average_distance_yards} yds` : 'No distance set'}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Icon name="pencil" size={24} color={colors.primary} style={{ marginRight: 12 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icon name="delete" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textSecondary }}>No clubs yet. Add your first club!</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleAdd} activeOpacity={0.8}>
        <Icon name="plus" style={styles.fabIcon} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ClubForm
          visible={modalVisible}
          onClose={handleFormClose}
          club={editingClub}
        />
      </Modal>
    </View>
  );
};

export default MyClubsScreen; 