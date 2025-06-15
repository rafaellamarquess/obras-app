import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { saveFiscalizacao } from '../services/storage';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';

const FiscalizacaoCadastroScreen = () => {
  const { obraId } = useRoute().params;
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [status, setStatus] = useState('Em Dia');
  const [observacoes, setObservacoes] = useState('');
  const [localizacao, setLocalizacao] = useState(null);
  const [foto, setFoto] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

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
      }
    })();
  }, []);

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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Fiscalização</Text>
        <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={data} onChangeText={setData} />
        <TextInput style={styles.input} placeholder="Status (Em Dia, Atrasada, Parada)" value={status} onChangeText={setStatus} />
        <TextInput style={styles.input} placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
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
          <Text style={styles.buttonText}>Usar Latitude e Longitude</Text>
        </TouchableOpacity>
        {localizacao && <Text style={styles.locationText}>Lat: {localizacao.latitude}, Long: {localizacao.longitude}</Text>}
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
    flexGrow: 1,
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

export default FiscalizacaoCadastroScreen;