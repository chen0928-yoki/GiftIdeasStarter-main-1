import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image, Modal } from 'react-native';
import { PeopleContext } from '../PeopleContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FloatingAction } from 'react-native-floating-action';

const IdeaScreen = () => {
  const { people, deleteIdea } = useContext(PeopleContext); // Access global state and delete function
  const route = useRoute();
  const navigation = useNavigation();
  const { personId } = route.params; // Get the personId passed from PeopleScreen
  const person = people.find((p) => p.id === personId);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Delete an idea
  const handleDeleteIdea = (ideaId) => {
    deleteIdea(personId, ideaId);
  };

  // Open modal with full-size image
  const openImageModal = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderIdea = ({ item }) => {
    const { text, img, id } = item;
    return (
      <View style={styles.ideaItem}>
        <TouchableOpacity onPress={() => openImageModal(img)}>
          <Image source={{ uri: img }} style={styles.ideaImage} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.ideaText}>{text}</Text>
          <Button title="Delete" onPress={() => handleDeleteIdea(id)} color="red" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gift Ideas for {person.name}</Text>
      {person.ideas.length === 0 ? (
        <Text style={styles.emptyText}>No ideas yet. Add a new idea!</Text>
      ) : (
        <FlatList
          data={person.ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderIdea}
        />
      )}

      {/* Full-size image modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullSizeImage} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>

      <FloatingAction // Floating action button to add a new idea
        onPressMain={() => navigation.navigate('AddIdeaScreen', { personId })}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ideaItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    borderRadius: 8,
  },
  ideaImage: {
    width: 50,
    height: 75, // Maintain a 2:3 aspect ratio
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ideaText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullSizeImage: {
    width: 300,
    height: 450, // Maintain the 2:3 aspect ratio
  },
});

export default IdeaScreen;
