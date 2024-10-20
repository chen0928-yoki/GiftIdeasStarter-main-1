import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { PeopleContext } from '../PeopleContext';
import { useNavigation } from '@react-navigation/native';
import { FloatingAction } from 'react-native-floating-action';
import { Swipeable } from 'react-native-gesture-handler';

const PeopleScreen = () => {
  const { people, deletePerson } = useContext(PeopleContext); // Access global state and delete function
  const navigation = useNavigation();

  // Navigate to AddPersonScreen
  const goToAddPerson = () => {
    navigation.navigate('AddPersonScreen');
  };

  // Navigate to IdeaScreen with personId passed as param
  const goToIdeaScreen = (personId) => {
    navigation.navigate('IdeaScreen', { personId });
  };

  // Delete a person
  const handleDeletePerson = (personId) => {
    Alert.alert(
      'Delete Person',
      'Are you sure you want to delete this person?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deletePerson(personId) }, // Make sure deletePerson exists
      ],
      { cancelable: true }
    );
  };

  // Render the swipeable delete button
  const renderRightActions = (personId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePerson(personId)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderPerson = ({ item }) => {
    const { name, dob, id } = item;
    return (
      <Swipeable renderRightActions={() => renderRightActions(id)}>
        <TouchableOpacity style={styles.personItem} onPress={() => goToIdeaScreen(id)}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.dob}>DOB: {dob}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {people.length === 0 ? (
        <Text style={styles.emptyText}>No people yet. Add your first person!</Text>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={renderPerson}
        />
      )}
      <FloatingAction // Floating action button to add a new person
        onPressMain={goToAddPerson}
        showBackground={false}
        color="#6200EE"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  personItem: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dob: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PeopleScreen;
