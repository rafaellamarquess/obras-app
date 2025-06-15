import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getObras } from '../services/storage';

const HomeScreen = () => {
  const [obras, setObras] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadObras = async () => {
      setObras(await getObras());
    };
    loadObras();
  }, []);

  const renderObra = ({ item }) => (
    <TouchableOpacity
      style={styles.obraItem}
      onPress={() => navigation.navigate('ObraDetalhes', { obraId: item.id })}
    >
      <Text style={styles.obraTitle}>{item.nome}</Text>
      <Text>{item.responsavel}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ObraCadastro')}
      >
        <Text style={styles.buttonText}>Cadastrar Obra</Text>
      </TouchableOpacity>
      <FlatList data={obras} renderItem={renderObra} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  obraItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  obraTitle: { fontSize: 18, fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default HomeScreen;