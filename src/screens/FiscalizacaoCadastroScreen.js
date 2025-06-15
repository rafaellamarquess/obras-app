import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet, TouchableOpacity  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { saveFiscalizacao } from '../services/storage';

const FiscalizacaoCadastroScreen = () => {
  const { obraId } = useRoute().params;
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [status, setStatus] = useState('Em Dia');
  const [observacoes, setObservacoes] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [foto, setFoto] = useState(null);

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
    if (!data || !status || !localizacao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    await saveFiscalizacao({
      obraId,
      data,
      status,
      observacoes,
      localizacao,
      foto,
    });
    Alert.alert('Sucesso', 'Fiscalização cadastrada!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Data (DD/MM/AAAA)"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Status (Em Dia, Atrasada, Parada)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={observacoes}
        onChangeText={setObservacoes}
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

export default FiscalizacaoCadastroScreen;