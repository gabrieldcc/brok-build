import React, { useEffect, useState } from "react";
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert,
    TouchableWithoutFeedback, Keyboard
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [creci, setCreci] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            const savedName = await AsyncStorage.getItem("nome");
            const savedCreci = await AsyncStorage.getItem("creci");
            const savedProfilePic = await AsyncStorage.getItem("foto");

            setName(savedName)
            setCreci(savedCreci)
            setProfilePic(savedProfilePic)
        };

        loadUserData();
    }, []);

    // // Selecionar nova foto de perfil
    const pickProfileImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            const selectedProfilePic = result.assets[0].uri
            setProfilePic(selectedProfilePic);
            const savedProfilePic = await AsyncStorage.setItem("foto", selectedProfilePic);
        }
    };

    const handleSaveProfile = async () => {
        const savedName = await AsyncStorage.setItem("nome", name);
        const savedCreci = await AsyncStorage.setItem("creci", creci);
        const savedProfilePic = await AsyncStorage.setItem("profilePic", profilePic);

        Alert.alert("Dados atualizados com sucesso!", `Nome: ${name}\nCRECI: ${creci}`, [
            {
                text: "OK",
                onPress: () => {
                    navigation.goBack()
                },
            },
        ]);
    }

    // // Simular logout
    const handleLogout = () => {
        cleanProfile()
        navigation.reset({
            index: 0,
            routes: [{ name: "SignUpScreen" }],
        });
    };

    const cleanProfile = async () => {
        // Limpar os dados no AsyncStorage
        await AsyncStorage.removeItem("nome");
        await AsyncStorage.removeItem("creci");
        await AsyncStorage.removeItem("foto");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <TouchableOpacity onPress={pickProfileImage} style={styles.profileContainer}>
                    {profilePic ? (
                        <Image source={{ uri: profilePic }} style={styles.profilePic} />
                    ) : (
                        <Text style={styles.profileText}>+</Text>
                    )}
                </TouchableOpacity>

                {/* <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        /> */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={name}
                        onChangeText={setName}
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

                {/* <TextInput
                    style={styles.input}
                    placeholder="CRECI"
                    value={creci}
                    onChangeText={setCreci}
                    keyboardType="numeric"
                /> */}

                <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f0f0f0",
        marginTop: 10
    },
    profileContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        overflow: "hidden",
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: "cover",
    },
    profileText: {
        fontSize: 30,
        color: "#aaa",
    },
    input: {
        width: "90%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#192847",
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    logoutButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#d9534f",
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
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
});