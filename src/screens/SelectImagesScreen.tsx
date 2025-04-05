import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

export default function SelectImagesScreen() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [smallImageOne, setSmallImageOne] = useState<string | null>(null);
  const [smallImageTwo, setSmallImageTwo] = useState<string | null>(null);
  const [smallImageThree, setSmallImageThree] = useState<string | null>(null);
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
  const pickImage = async (target: "main" | "one" | "two" | "three") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      switch (target) {
        case "main":
          setMainImage(uri);
          break;
        case "one":
          setSmallImageOne(uri);
          break;
        case "two":
          setSmallImageTwo(uri);
          break;
        case "three":
          setSmallImageThree(uri);
          break;
      }

    }
  }

  // Navegar para a tela de edição de perfil
  const goToEditProfile = () => {
    navigation.navigate("ProfileScreen", { profilePic, setProfilePic });
    //navigation.navigate("ProfileScreen");
  };

  // Navegar para a tela de montagem do template
  const goToSecondScreen = () => {
    const imageArray = [mainImage, smallImageOne, smallImageTwo, smallImageThree];
    console.log(`Número de imagens na lista -------------------- ${imageArray.length}`)
    navigation.navigate("RenderTemplate", {images: imageArray, profilePic });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToEditProfile} style={styles.profileButton}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <Text style={styles.profileText}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => pickImage("main")} style={styles.mainImageContainer}>
      {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.mainImage} />
          ) : (
            <View style={[styles.mainImage, styles.placeholder]}>
              <Ionicons name="camera" size={32} color="#aaa" />
            </View>
          )}
      </TouchableOpacity>

      <View style={styles.row}>

        <TouchableOpacity onPress={() => pickImage("one")}>
          {smallImageOne ? (
            <Image source={{ uri: smallImageOne }} style={styles.smallImage} />
          ) : (
            <View style={[styles.smallImage, styles.placeholder]}>
              <Ionicons name="camera" size={32} color="#aaa" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage("two")}>
          {smallImageTwo ? (
            <Image source={{ uri: smallImageTwo }} style={styles.smallImage} />
          ) : (
            <View style={[styles.smallImage, styles.placeholder]}>
              <Ionicons name="camera" size={32} color="#aaa" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickImage("three")}>
          {smallImageThree ? (
            <Image source={{ uri: smallImageThree }} style={styles.smallImage} />
          ) : (
            <View style={[styles.smallImage, styles.placeholder]}>
              <Ionicons name="camera" size={32} color="#aaa" />
            </View>
          )}
        </TouchableOpacity>
        

      </View>

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
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
    backgroundColor: "#192847",
    borderRadius: 5,
    height: 44,
    width: width * 0.9,
  },
  mainImageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  smallImage: {
    width: 100,
    height: 100,
    margin: 5,
    resizeMode: "cover",
    borderRadius: 10
  },
  placeholder: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  }

});