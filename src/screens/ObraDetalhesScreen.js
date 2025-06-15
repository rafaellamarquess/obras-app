import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native'; // Corrigir importação
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import { getObra, getFiscalizacoes, updateObra, deleteObra } from '../services/storage';

const ObraDetalhesScreen = () => {
  const { obraId } = useRoute().params;
  const navigation = useNavigation();
  const [obra, setObra] = useState(null);
  const [fiscalizacoes, setFiscalizacoes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoTermino, setPrevisaoTermino] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');

 
  
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const obraData = await getObra(obraId);
        setObra(obraData);
        setNome(obraData.nome);
        setResponsavel(obraData.responsavel);
        setDataInicio(obraData.dataInicio);
        setPrevisaoTermino(obraData.previsaoTermino);
        setDescricao(obraData.descricao);
        const fiscalizacoesData = await getFiscalizacoes(obraId);
        setFiscalizacoes(fiscalizacoesData);
      };
  
      loadData();
    }, [obraId])
  );
  

  const handleEdit = async () => {
    if (isEditing) {
      const updatedObra = { ...obra, nome, responsavel, dataInicio, previsaoTermino, descricao };
      await updateObra(updatedObra);
      setObra(updatedObra);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Obra atualizada!');
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmação', 'Deseja excluir a obra?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteObra(obraId);
          navigation.navigate('ObraCadastro'); // <- Garanta que volta pra tela certa
        },
      },
    ]);
  };
  

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite um e-mail.');
      return;
    }
    const fiscalizacoesText = fiscalizacoes
      .map((f) => `Fiscalização: ${f.data}, Status: ${f.status}, Observações: ${f.observacoes}`)
      .join('\n');
    await MailComposer.composeAsync({
      recipients: [email],
      subject: `Obra: ${obra.nome}`,
      body: `Nome: ${obra.nome}\nResponsável: ${obra.responsavel}\nData de Início: ${obra.dataInicio}\nPrevisão de Término: ${obra.previsaoTermino}\nDescrição: ${obra.descricao}\nLocalização: Lat ${obra.localizacao.latitude}, Long ${obra.localizacao.longitude}\n\nFiscalizações:\n${fiscalizacoesText}`,
    });
  };

  const renderFiscalizacao = ({ item }) => (
    <View style={styles.fiscalizacaoItem}>
      <Text>Data: {item.data}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Observações: {item.observacoes}</Text>
      {item.foto && <Image source={{ uri: item.foto }} style={styles.foto} />}
    </View>
  );

  if (!obra) return null;

  return (
    <View style={styles.container}>
      {isEditing ? (
        <>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} />
          <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} />
          <TextInput style={styles.input} value={previsaoTermino} onChangeText={setPrevisaoTermino} />
          <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />
        </>
      ) : (
        <>
          <Text style={styles.label}>Nome: {obra.nome}</Text>
          <Text style={styles.label}>Responsável: {obra.responsavel}</Text>
          <Text style={styles.label}>Data de Início: {obra.dataInicio}</Text>
          <Text style={styles.label}>Previsão de Término: {obra.previsaoTermino}</Text>
          <Text style={styles.label}>Descrição: {obra.descricao}</Text>
          <Text style={styles.label}>Localização: Lat {obra.localizacao.latitude}, Long {obra.localizacao.longitude}</Text>
          {obra.foto && <Image source={{ uri: obra.foto }} style={styles.foto} />}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FiscalizacaoCadastro', { obraId })}
      >
        <Text style={styles.buttonText}>Cadastrar Fiscalização</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Fiscalizações</Text>
      <FlatList
        data={fiscalizacoes}
        renderItem={renderFiscalizacao}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail para envio"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Enviar por E-mail</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  fiscalizacaoItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  foto: { width: 100, height: 100, marginVertical: 10, borderRadius: 5 },
});

export default ObraDetalhesScreen;