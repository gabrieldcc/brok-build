import React, { useState } from "react";
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import MaskInput, { Masks } from 'react-native-mask-input';


export default function PropertyFormScreen({ navigation }) {
  const [type, setType] = useState<"venda" | "aluguel" | null>(null);
  const [bairro, setBairro] = useState("");
  const [valor, setValor] = useState("");
  const [quartos, setQuartos] = useState("");
  const [suites, setSuites] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [areaGourmet, setAreaGourmet] = useState<"sim" | "nao" | null>(null);
  const [diasVenda, setDiasVenda] = useState("");
  const [textoCustomizado, setTextoCustomizado] = useState("");

  const route = useRoute();
  // const navigation = useNavigation();
  const { templateId } = route.params ?? {};
  console.log(`templateID ----> ${templateId}`)

  const handleSubmit = () => {
    const formData = {
      type,
      bairro,
      valor,
      quartos,
      suites,
      banheiros,
      vagas,
      areaGourmet,
      diasVenda,
      textoCustomizado,
    };
    // Alert.alert("Dados do formulário", JSON.stringify(formData, null, 2));

    switch (templateId) {
      case '1':
        navigation.navigate('PreviewScreen', { formData })
        break;
      case '2':
        navigation.navigate('SoldOutDays', { formData })
        break;
      case '3':
        navigation.navigate('Quadrant', { formData })
        break;
      case '4':
        navigation.navigate('QuadrantSquare', { formData })
        break;
      case '5':
        navigation.navigate('ThreeMainImage', { formData })
        break;
      default:
        navigation.navigate('TemplateDefaultScreen');
    }

    // navigation.navigate('PreviewScreen', { formData })
    // console.log("formData formulario--------", JSON.stringify(formData, null, 2));

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Venda ou Aluguel</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.radio, type === "venda" && styles.radioSelected]}
          onPress={() => setType("venda")}
        >
          <Text style={styles.radioText}>Venda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radio, type === "aluguel" && styles.radioSelected]}
          onPress={() => setType("aluguel")}
        >
          <Text style={styles.radioText}>Aluguel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Bairro</Text>
      <TextInput
        style={styles.input}
        value={bairro}
        onChangeText={setBairro}
        placeholder="Digite o bairro"
      />

      <Text style={styles.label}>Valor do imóvel</Text>
      <MaskInput
        style={styles.input}
        keyboardType="numeric"
        mask={Masks.BRL_CURRENCY}            
        // options={{
        //   prefix: 'R$ ',              
        //   decimalSeparator: ',',      
        //   groupSeparator: '.',       
        //   precision: 2,               
        // }}
        value={valor}
        onChangeText={setValor}
        placeholder="Digite o valor"
      />

      <Text style={styles.label}>Quantidade de quartos</Text>
      <TextInput
        style={styles.input}
        value={quartos}
        onChangeText={setQuartos}
        placeholder="Ex: 3"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantidade de suítes</Text>
      <TextInput
        style={styles.input}
        value={suites}
        onChangeText={setSuites}
        placeholder="Ex: 1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantidade de banheiros</Text>
      <TextInput
        style={styles.input}
        value={banheiros}
        onChangeText={setBanheiros}
        placeholder="Ex: 2"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantidade de vagas de garagem</Text>
      <TextInput
        style={styles.input}
        value={vagas}
        onChangeText={setVagas}
        placeholder="Ex: 2"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Possui área gourmet?</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.radio, areaGourmet === "sim" && styles.radioSelected]}
          onPress={() => setAreaGourmet("sim")}
        >
          <Text style={styles.radioText}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radio, areaGourmet === "nao" && styles.radioSelected]}
          onPress={() => setAreaGourmet("nao")}
        >
          <Text style={styles.radioText}>Não</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Vendido em quantos dias?</Text>
      <TextInput
        style={styles.input}
        value={diasVenda}
        onChangeText={setDiasVenda}
        placeholder="Ex: 30"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Texto customizado</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={textoCustomizado}
        onChangeText={setTextoCustomizado}
        placeholder="Digite um texto"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  radio: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#192847",
    borderColor: "#192847",
  },
  radioText: {
    color: "#000",
  },
  button: {
    backgroundColor: "#192847",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
