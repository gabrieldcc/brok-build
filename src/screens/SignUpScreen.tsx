
import React, { useState, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

export default function SignUpScreen() {

    const [nome, setNome] = useState<string>("");
    const [creci, setCreci] = useState<string>("");
    const [celular, setCelular] = useState<string>("");
    const [foto, setFoto] = useState<string | null>(null);
    const navigation = useNavigation();
    const [isFormValid, setIsFormValid] = useState(false);


    // Carregar os dados do AsyncStorage ao iniciar
    useEffect(() => {

        const isValid =
        nome.trim() !== "" &&
        creci.trim() !== "" &&
        celular.trim() !== "" &&
        foto !== null
        console.log(`foto----${foto}`)

        setIsFormValid(isValid);

        const loadUserData = async () => {
            const savedNome = await AsyncStorage.getItem("nome");
            const savedCreci = await AsyncStorage.getItem("creci");
            const savedFoto = await AsyncStorage.getItem("foto");
            const savedCelular = await AsyncStorage.getItem("celular");

            if (savedNome && savedCreci && savedFoto) {
                // Se já houver um cadastro, redireciona para SelectImages
                navigation.replace("SelectImages");
            }
        };

        loadUserData();
    }, [nome, creci, celular, foto]);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!nome || !creci || !foto) {
            Alert.alert("Erro ao efetuar cadastro", "Por favor, preencha todos os campos");
            return;
        }

        // Salvar os dados no AsyncStorage
        await AsyncStorage.setItem("nome", nome);
        await AsyncStorage.setItem("creci", creci);
        await AsyncStorage.setItem("foto", foto);
        await AsyncStorage.setItem("celular", celular);

        Alert.alert("Cadastro realizado", `Nome: ${nome}\nCRECI: ${creci}`, [
            {
                text: "OK",
                onPress: handleSignUpSuccess,
            },
        ]);
    };

    const handleSignUpSuccess = () => {
        console.log("ok pressed")
        navigation.navigate("SelectImages");
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} 
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.container}>
                            <Text style={styles.title}>Cadastro</Text>
                            <Text style={{ color: "#666", fontSize: 16, marginBottom: 20 }}>
                                Insira seus dados para começar
                            </Text>

                            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                                {foto ? (
                                    <Image source={{ uri: foto }} style={styles.imagePreview} />
                                ) : (
                                    <Ionicons name="camera" size={24} color="#fff" />
                                )}
                            </TouchableOpacity>

                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome"
                                    value={nome}
                                    onChangeText={setNome}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="document-text-outline" size={20} color="#999" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="CRECI"
                                    keyboardType="numeric"
                                    value={creci}
                                    onChangeText={setCreci}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#999" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Celular"
                                    keyboardType="numeric"
                                    value={celular}
                                    onChangeText={setCelular}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View >
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[
                                styles.button,
                                { backgroundColor: isFormValid ? "#192847" : "#999" },
                            ]}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>


                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );




}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f4f4f4",
        marginTop: 50
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#192847",
        marginBottom: 10,
        textAlign: "center",
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginVertical: 15,
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: "#192847",
        borderRadius: 5,
        height: 44,
        width: width * 0.9,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    imagePicker: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    imagePickerText: {
        fontSize: 36,
        color: "#888",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: "#fff",
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
});