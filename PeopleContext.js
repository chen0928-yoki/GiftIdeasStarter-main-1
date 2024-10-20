import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'; // Import the new UUID package

export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);

  // Load people from AsyncStorage when the app starts
  useEffect(() => {
    loadPeople();
  }, []);

  // Load people data from AsyncStorage
  const loadPeople = async () => {
    try {
      const peopleData = await AsyncStorage.getItem('people');
      if (peopleData !== null) {
        setPeople(JSON.parse(peopleData));
      }
    } catch (e) {
      console.error('Failed to load people:', e);
    }
  };

  // Save people data to AsyncStorage
  const savePeople = async (newPeople) => {
    try {
      await AsyncStorage.setItem('people', JSON.stringify(newPeople));
      setPeople(newPeople);
    } catch (e) {
      console.error('Failed to save people:', e);
    }
  };

  // Add a new person
  const addPerson = (name, dob) => {
    const newPerson = {
      id: uuid.v4(), // Generate a new UUID for the person
      name,
      dob,
      ideas: [],
    };
    const updatedPeople = [...people, newPerson];
    savePeople(updatedPeople);
  };

  // Add a new idea to a person
  const addIdea = (personId, idea) => {
    const updatedPeople = people.map(person =>
      person.id === personId
        ? { ...person, ideas: [...person.ideas, { id: uuid.v4(), ...idea }] } // Generate UUID for the idea
        : person
    );
    savePeople(updatedPeople);
  };

  // Delete a person
  const deletePerson = (personId) => {
    const updatedPeople = people.filter((person) => person.id !== personId);
    savePeople(updatedPeople); // Persist the updated list to AsyncStorage
  };

  return (
    <PeopleContext.Provider value={{ people, addPerson, addIdea, deletePerson }}>
      {children}
    </PeopleContext.Provider>
  );
};
