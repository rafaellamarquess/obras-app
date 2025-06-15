import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ObraCadastroScreen from './src/screens/ObraCadastroScreen';
import ObraDetalhesScreen from './src/screens/ObraDetalhesScreen';
import FiscalizacaoCadastroScreen from './src/screens/FiscalizacaoCadastroScreen';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Obras em Andamento' }} />
      <Stack.Screen name="ObraCadastro" component={ObraCadastroScreen} options={{ title: 'Cadastrar Obra' }} />
      <Stack.Screen name="ObraDetalhes" component={ObraDetalhesScreen} options={{ title: 'Detalhes da Obra' }} />
      <Stack.Screen name="FiscalizacaoCadastro" component={FiscalizacaoCadastroScreen} options={{ title: 'Cadastrar Fiscalização' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;