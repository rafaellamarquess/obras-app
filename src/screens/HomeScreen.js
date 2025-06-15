import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
      {item.foto && <Image source={{ uri: item.foto }} style={styles.obraImage} />}
      <View style={styles.obraInfo}>
        <Text style={styles.obraTitle}>{item.nome}</Text>
        <Text style={styles.obraSubtitle}>{item.responsavel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ObraCadastro')}>
        <Text style={styles.addButtonText}>+ Cadastrar Obra</Text>
      </TouchableOpacity>
      <FlatList
        data={obras}
        renderItem={renderObra}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma obra cadastrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  addButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  obraItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    alignItems: 'center',
  },
  obraImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  obraInfo: {
    flex: 1,
  },
  obraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  obraSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 20,
  },
});

export default HomeScreen;