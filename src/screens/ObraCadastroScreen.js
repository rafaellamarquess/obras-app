import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { saveObra } from '../services/storage';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';

const ObraCadastroScreen = () => {
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoTermino, setPrevisaoTermino] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [foto, setFoto] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [locationName, setLocationName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (cameraStatus !== 'granted' || locationStatus !== 'granted') {
        Alert.alert('Erro', 'Permissões de câmera e localização necessárias.');
      } else {
        const initialLocation = await Location.getCurrentPositionAsync({});
        setLocalizacao({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        });
        setMapRegion({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        await updateLocationName(initialLocation.coords.latitude, initialLocation.coords.longitude);
      }
    })();
  }, []);

  const updateLocationName = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const { name, city, region } = geocode[0];
        setLocationName(`${name || ''}, ${city || ''}, ${region || ''}`.trim());
      }
    } catch (error) {
      console.error('Erro ao obter nome do local:', error);
      setLocationName('Localização não identificada');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      await updateLocationName(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao obter localização.');
    }
  };

  const setFixedLocation = () => {
    const fixedLat = -8.0378705;
    const fixedLong = -34.959609;
    setLocalizacao({ latitude: fixedLat, longitude: fixedLong });
    setMapRegion({
      latitude: fixedLat,
      longitude: fixedLong,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    updateLocationName(fixedLat, fixedLong);
  };

  const onMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocalizacao({ latitude, longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    updateLocationName(latitude, longitude);
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
    try {
      await saveObra(obra);
      Alert.alert('Sucesso', 'Obra cadastrada!');
      navigation.navigate('ObraDetalhes', { obraId: obra.id });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar obra.');
    }
  };

  return (
    <LinearGradient colors={['#3498db', '#8e44ad']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Nova Obra</Text>
        <TextInput style={styles.input} placeholder="Nome da Obra" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Responsável" value={responsavel} onChangeText={setResponsavel} />
        <TextInput style={styles.input} placeholder="Data de Início (DD/MM/AAAA)" value={dataInicio} onChangeText={setDataInicio} />
        <TextInput style={styles.input} placeholder="Previsão de Término (DD/MM/AAAA)" value={previsaoTermino} onChangeText={setPrevisaoTermino} />
        <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} />
        <View style={styles.mapContainer}>
          {mapRegion && (
            <MapView
              style={styles.map}
              region={mapRegion}
              onPress={onMapPress}
            >
              {localizacao && <Marker coordinate={localizacao} />}
            </MapView>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Obter Localização Atual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={setFixedLocation}>
          <Text style={styles.buttonText}>Usar Lat: -8.0378705, Long: -34.959609</Text>
        </TouchableOpacity>
        {localizacao && <Text style={styles.locationText}>{locationName || 'Obtendo nome do local...'}</Text>}
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.foto} />}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
    marginBottom: 20,
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
  mapContainer: {
    height: 200,
    marginBottom: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default ObraCadastroScreen;