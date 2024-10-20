import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { PeopleContext } from '../PeopleContext';
import { useNavigation } from '@react-navigation/native';

const AddPersonScreen = () => {
  const { addPerson } = useContext(PeopleContext); // Access the addPerson function from context
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const navigation = useNavigation();

  // Handler for saving the new person
  const handleSavePerson = () => {
    if (name && dob) {
      addPerson(name, dob); // Add person to the global state
      navigation.navigate('PeopleScreen'); // Navigate back to PeopleScreen
    } else {
      Alert.alert('Error', 'Please provide both a name and date of birth.');
    }
  };

  // Handler for cancel button
  const handleCancel = () => {
    navigation.navigate('PeopleScreen');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <DatePicker
          mode="calendar"
          selected={dob}
          onDateChange={setDob}
          maximumDate={new Date().toISOString().split('T')[0]} // Restrict future dates
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSavePerson} />
        <Button title="Cancel" onPress={handleCancel} color="red" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddPersonScreen;
