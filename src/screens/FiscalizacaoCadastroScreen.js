import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { saveFiscalizacao } from '../services/storage';
import { LinearGradient } from 'expo-linear-gradient';

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
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao obter localização.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
      if (!result.canceled) setFoto(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao tirar foto.');
    }
  };

  const handleSave = async () => {
    if (!data || !status || !localizacao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    try {
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
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar fiscalização.');
    }
  };

  return (
    <LinearGradient colors={['#3498db', '#8e44ad']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cadastrar Fiscalização</Text>
        <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={data} onChangeText={setData} />
        <TextInput style={styles.input} placeholder="Status (Em Dia, Atrasada, Parada)" value={status} onChangeText={setStatus} />
        <TextInput style={styles.input} placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
        <TouchableOpacity style={styles.button} onPress={getLocalizacao}>
          <Text style={styles.buttonText}>Obter Localização</Text>
        </TouchableOpacity>
        {localizacao && <Text style={styles.locationText}>Lat: {localizacao.latitude}, Long: {localizacao.longitude}</Text>}
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.foto} />}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
  locationText: {
    color: '#2c3e50',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default FiscalizacaoCadastroScreen;