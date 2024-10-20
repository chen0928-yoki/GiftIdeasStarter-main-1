import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PeopleProvider } from './PeopleContext';
import AppNavigator from './AppNavigator'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <PeopleProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PeopleProvider>
  );
}
