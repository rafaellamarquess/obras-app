import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const OBRAS_KEY = '@ObrasApp:Obras';
const FISCALIZACOES_KEY = '@ObrasApp:Fiscalizacoes';

export const saveObra = async (obra) => {
  try {
    const obras = await getObras();
    const id = uuid.v4();
    obra.id = id;
    await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify([...obras, obra]));
    return id;
  } catch (error) {
    console.error('Erro ao salvar obra:', error);
    throw error;
  }
};

export const getObras = async () => {
  try {
    const data = await AsyncStorage.getItem(OBRAS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao obter obras:', error);
    return [];
  }
};

export const getObra = async (id) => {
  try {
    const obras = await getObras();
    return obras.find((obra) => obra.id === id) || null;
  } catch (error) {
    console.error('Erro ao obter obra:', error);
    return null;
  }
};

export const updateObra = async (updatedObra) => {
  try {
    const obras = await getObras();
    const updatedObras = obras.map((obra) => (obra.id === updatedObra.id ? updatedObra : obra));
    await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify(updatedObras));
  } catch (error) {
    console.error('Erro ao atualizar obra:', error);
    throw error;
  }
};

export const deleteObra = async (id) => {
  try {
    console.log('Tentando excluir obra com ID:', id);
    const obras = await getObras();
    const fiscalizacoes = await getFiscalizacoes();
    if (!obras.some((obra) => obra.id === id)) {
      console.warn('Obra com ID', id, 'não encontrada.');
      throw new Error('Obra não encontrada');
    }
    const filteredObras = obras.filter((obra) => obra.id !== id);
    const filteredFiscalizacoes = fiscalizacoes.filter((f) => f.obraId !== id);
    console.log('Obras antes da exclusão:', obras.length, 'Obras após:', filteredObras.length);
    await AsyncStorage.setItem(OBRAS_KEY, JSON.stringify(filteredObras));
    await AsyncStorage.setItem(FISCALIZACOES_KEY, JSON.stringify(filteredFiscalizacoes));
    console.log('Exclusão concluída para ID:', id);
  } catch (error) {
    console.error('Erro ao excluir obra:', error);
    throw error;
  }
};

export const saveFiscalizacao = async (fiscalizacao) => {
  try {
    const fiscalizacoes = await getFiscalizacoes();
    fiscalizacao.id = uuid.v4();
    await AsyncStorage.setItem(FISCALIZACOES_KEY, JSON.stringify([...fiscalizacoes, fiscalizacao]));
  } catch (error) {
    console.error('Erro ao salvar fiscalização:', error);
    throw error;
  }
};

export const getFiscalizacoes = async (obraId) => {
  try {
    const data = await AsyncStorage.getItem(FISCALIZACOES_KEY);
    const fiscalizacoes = data ? JSON.parse(data) : [];
    return obraId ? fiscalizacoes.filter((f) => f.obraId === obraId) : fiscalizacoes;
  } catch (error) {
    console.error('Erro ao obter fiscalizações:', error);
    return [];
  }
};