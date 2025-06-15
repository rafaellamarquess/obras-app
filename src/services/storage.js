import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const OBRAS_KEY = '@ObrasApp:Obras';
const FISCALIZACOES_KEY = '@ObrasApp:Fiscalizacoes';

export const saveObra = async (obra) => {
  const obras = await getObras();
  const id = uuid.v4();
  obra.id = id;
  await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify([...obras, obra]));
  return id;
};


export const getObras = async () => {
  const data = await AsyncStorage.getItem(OBRAS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getObra = async (id) => {
  const obras = await getObras();
  return obras.find((obra) => obra.id === id) || null;
};

export const updateObra = async (updatedObra) => {
  const obras = await getObras();
  const updatedObras = obras.map((obra) => (obra.id === updatedObra.id ? updatedObra : obra));
  await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify(updatedObras));
};

export const deleteObra = async (id) => {
  const obras = await getObras();
  const fiscalizacoes = await getFiscalizacoes();
  const filteredObras = obras.filter((obra) => obra.id !== id);
  const filteredFiscalizacoes = fiscalizacoes.filter((f) => f.obraId !== id);
  await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify(filteredObras));
  await AsyncStorage.setItem(FISCALIZACOES_KEY, JSON.stringify(filteredFiscalizacoes));
};

export const saveFiscalizacao = async (fiscalizacao) => {
  const fiscalizacoes = await getFiscalizacoes();
  fiscalizacao.id = uuid.v4();
  await AsyncStorage.setItem(FISCALIZACOES_KEY, JSON.stringify([...fiscalizacoes, fiscalizacao]));
};

export const getFiscalizacoes = async (obraId) => {
  const data = await AsyncStorage.getItem(FISCALIZACOES_KEY);
  const fiscalizacoes = data ? JSON.parse(data) : [];
  return obraId ? fiscalizacoes.filter((f) => f.obraId === obraId) : fiscalizacoes;
};
