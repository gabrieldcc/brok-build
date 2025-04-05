import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

export default function SelectImagesScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        const savedProfilePic = await AsyncStorage.getItem("foto");
        console.log(`profilepic: ${savedProfilePic}`);
        setProfilePic(savedProfilePic);
      };
      loadUserData();
    }, [])
  );

  // Selecionar imagens do imóvel
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 4,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  // Navegar para a tela de edição de perfil
  const goToEditProfile = () => {
    navigation.navigate("ProfileScreen", { profilePic, setProfilePic });
    //navigation.navigate("ProfileScreen");
  };

  // Navegar para a tela de montagem do template
  const goToSecondScreen = () => {
    navigation.navigate("RenderTemplate", { images, profilePic });
  };

  return (
    <View style={styles.container}>
      {/* Botão no canto superior direito com a foto de perfil */}
      <TouchableOpacity onPress={goToEditProfile} style={styles.profileButton}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <Text style={styles.profileText}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Selecionar Fotos do Imóvel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToSecondScreen} style={styles.buttonGenerate}>
        <Text style={styles.buttonText}>Gerar template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  profileButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  profileText: {
    fontSize: 20,
    color: "#aaa",
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
  buttonGenerate: {
    margin: 10,
    padding: 10,
    backgroundColor: "#008000",
    borderRadius: 5,
    height: 44,
    width: width * 0.9,
  },
});