### 🏗️ ObrasApp

Um aplicativo mobile desenvolvido com **React Native** que permite o **gerenciamento de obras e fiscalizações**, armazenando os dados localmente no dispositivo utilizando **AsyncStorage**.

---

### Funcionalidades

* **Cadastro de Obras**
  Adicione obras com informações como nome, responsável, data ínicio, data previsão de término, localização por GPS, fotos e descrição.

* **Listagem de Obras**
  Visualize todas as obras cadastradas na Home do aplicativo.

* **Detalhes da Obra**
  Visualização detalhada das informações das obras, lista de fiscalizações, opções de editar e excluir obras e fiscalizações, e envio das informações por e-mail.

* **Cadastro de Fiscalizações**
  Adicione fiscalizações vinculadas a cada obra com campos como data da fiscalização, status da obra (Em dia, Atrasada, Parada), observações localização via GPS e fotos.

* **Armazenamento Offline**
  Todos os dados são armazenados localmente com **AsyncStorage**.

---

### Tecnologias Utilizadas

* React Native
* AsyncStorage (`@react-native-async-storage/async-storage`)
* UUID (`react-native-uuid`)

---

### Instalação e Execução do App

1. **Clone o repositório**:

```bash
git clone https://github.com/rafaellamarquess/obras-app.git
cd obras-app
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o projeto com Expo Go**

```bash
npm start
```

> Abra no navegador ou escaneie o QR Code com o app **Expo Go** no seu celular (Android ou iOS).
