import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { saveObra } from '../services/storage';
import { TouchableOpacity } from 'react-native';


const ObraCadastroScreen = () => {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoTermino, setPrevisaoTermino] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [foto, setFoto] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert('Erro', 'Permissões de câmera e localização necessárias.');
      }
    })();
  }, []);

  const getLocalizacao = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setLocalizacao({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!nome || !responsavel || !dataInicio || !previsaoTermino || !localizacao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    const obra = {
      nome,
      responsavel,
      dataInicio,
      previsaoTermino,
      localizacao,
      foto,
      descricao,
    };
    await saveObra(obra);
    Alert.alert('Sucesso', 'Obra cadastrada!');
    navigation.navigate('ObraDetalhes', { obraId: obra.id }); // Navega para detalhes
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da Obra"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Responsável"
        value={responsavel}
        onChangeText={setResponsavel}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Início (DD/MM/AAAA)"
        value={dataInicio}
        onChangeText={setDataInicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Previsão de Término (DD/MM/AAAA)"
        value={previsaoTermino}
        onChangeText={setPrevisaoTermino}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TouchableOpacity style={styles.button} onPress={getLocalizacao}>
        <Text style={styles.buttonText}>Obter Localização</Text>
      </TouchableOpacity>
      {localizacao && (
        <Text>Lat: {localizacao.latitude}, Long: {localizacao.longitude}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Tirar Foto</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.foto} />}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  foto: { width: 100, height: 100, marginBottom: 10, borderRadius: 5 },
});

export default ObraCadastroScreen;