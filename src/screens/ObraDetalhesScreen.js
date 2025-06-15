import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import { getObra, getObras, getFiscalizacoes, updateObra, deleteObra } from '../services/storage';
import { LinearGradient } from 'expo-linear-gradient';

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
        try {
          console.log('Carregando obra com ID:', obraId);
          const obraData = await getObra(obraId);
          if (!obraData) {
            Alert.alert('Erro', 'Obra não encontrada.');
            navigation.navigate('Home');
            return;
          }
          setObra(obraData);
          setNome(obraData.nome);
          setResponsavel(obraData.responsavel);
          setDataInicio(obraData.dataInicio);
          setPrevisaoTermino(obraData.previsaoTermino);
          setDescricao(obraData.descricao);
          const fiscalizacoesData = await getFiscalizacoes(obraId);
          setFiscalizacoes(fiscalizacoesData);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
          Alert.alert('Erro', 'Falha ao carregar os dados da obra.');
          navigation.navigate('Home');
        }
      };
      loadData();
    }, [obraId, navigation])
  );

  const handleEdit = async () => {
    if (isEditing) {
      if (!nome || !responsavel || !dataInicio || !previsaoTermino) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }
      try {
        const updatedObra = { ...obra, nome, responsavel, dataInicio, previsaoTermino, descricao };
        await updateObra(updatedObra);
        setObra(updatedObra);
        setIsEditing(false);
        Alert.alert('Sucesso', 'Obra atualizada!');
      } catch (error) {
        console.error('Erro ao atualizar obra:', error);
        Alert.alert('Erro', 'Falha ao atualizar obra.');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    console.log('ID da obra para exclusão:', obraId);
    Alert.alert('Confirmação', 'Deseja excluir a obra?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('Tentando excluir obra com ID:', obraId);
            if (!obraId) {
              Alert.alert('Erro', 'ID da obra inválido.');
              return;
            }
            const obrasAntes = await getObras();
            console.log('Obras antes da exclusão:', obrasAntes);
            await deleteObra(obraId);
            const obrasDepois = await getObras();
            console.log('Obras depois da exclusão:', obrasDepois);
            Alert.alert('Sucesso', 'Obra excluída!');
            navigation.navigate('Home');
          } catch (error) {
            console.error('Erro ao excluir obra:', error);
            Alert.alert('Erro', 'Falha ao excluir a obra. Detalhes:', error.message);
          }
        },
      },
    ]);
  };

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite um e-mail.');
      return;
    }
    if (!obra) {
      Alert.alert('Erro', 'Dados da obra não disponíveis.');
      return;
    }
    try {
      const fiscalizacoesText = fiscalizacoes
        .map((f) => `Fiscalização: ${f.data}, Status: ${f.status}, Observações: ${f.observacoes}`)
        .join('\n');
      await MailComposer.composeAsync({
        recipients: [email],
        subject: `Obra: ${obra.nome}`,
        body: `Nome: ${obra.nome}\nResponsável: ${obra.responsavel}\nData de Início: ${obra.dataInicio}\nPrevisão de Término: ${obra.previsaoTermino}\nDescrição: ${obra.descricao}\nLocalização: Lat ${obra.localizacao.latitude}, Long ${obra.localizacao.longitude}\n\nFiscalizações:\n${fiscalizacoesText}`,
      });
      Alert.alert('Sucesso', 'E-mail enviado!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      Alert.alert('Erro', 'Falha ao enviar e-mail.');
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const renderFiscalizacao = ({ item }) => (
    <View style={styles.fiscalizacaoItem}>
      {item.foto && <Image source={{ uri: item.foto }} style={styles.fiscalizacaoImage} />}
      <View style={styles.fiscalizacaoInfo}>
        <Text style={styles.fiscalizacaoText}>Data: {item.data}</Text>
        <Text style={styles.fiscalizacaoText}>Status: {item.status}</Text>
        <Text style={styles.fiscalizacaoText}>Observações: {item.observacoes}</Text>
      </View>
    </View>
  );

  if (!obra) return <View style={styles.loading}><Text style={styles.loadingText}>Carregando...</Text></View>;

  return (
    <LinearGradient colors={['#3498db', '#8e44ad']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Detalhes da Obra</Text>
        {isEditing ? (
          <>
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />
            <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} placeholder="Responsável" />
            <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="Data de Início" />
            <TextInput style={styles.input} value={previsaoTermino} onChangeText={setPrevisaoTermino} placeholder="Previsão de Término" />
            <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Descrição" />
          </>
        ) : (
          <>
            {obra.foto && <Image source={{ uri: obra.foto }} style={styles.obraImage} />}
            <Text style={styles.label}>Nome: {obra.nome}</Text>
            <Text style={styles.label}>Responsável: {obra.responsavel}</Text>
            <Text style={styles.label}>Data de Início: {obra.dataInicio}</Text>
            <Text style={styles.label}>Previsão de Término: {obra.previsaoTermino}</Text>
            <Text style={styles.label}>Descrição: {obra.descricao}</Text>
            <Text style={styles.label}>Localização: Lat {obra.localizacao.latitude}, Long {obra.localizacao.longitude}</Text>
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FiscalizacaoCadastro', { obraId })}>
          <Text style={styles.buttonText}>Cadastrar Fiscalização</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
          <Text style={styles.buttonText}>Voltar à Home</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Fiscalizações</Text>
        <FlatList
          data={fiscalizacoes}
          renderItem={renderFiscalizacao}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma fiscalização cadastrada.</Text>}
        />
        <TextInput style={styles.input} placeholder="E-mail para envio" value={email} onChangeText={setEmail} />
        <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
          <Text style={styles.buttonText}>Enviar por E-mail</Text>
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
  label: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
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
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 15,
  },
  fiscalizacaoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  fiscalizacaoImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  fiscalizacaoInfo: {
    flex: 1,
  },
  fiscalizacaoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  obraImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#2c3e50',
    fontSize: 16,
  },
});

export default ObraDetalhesScreen;