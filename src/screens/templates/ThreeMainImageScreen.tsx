import React, { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native";
import {
  View, Text, ImageBackground, Dimensions, StyleSheet,
  Image, TouchableOpacity, InteractionManager
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { width } = Dimensions.get('window');

export default function ThreeMainImageScreen({ navigation }) {
  const route = useRoute();
  const { formData = {} } = route.params || {};

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(true);

  const [nome, setNome] = useState('');
  const [creci, setCreci] = useState('');
  const [celular, setCelular] = useState('');

  const [imageMain, setImageMain] = useState<string | null>(null);
  const [imageTop, setImageTop] = useState<string | null>(null);
  const [imageBottom, setImageBottom] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const savedNome = await AsyncStorage.getItem("nome");
      const savedCreci = await AsyncStorage.getItem("creci");
      const savedCelular = await AsyncStorage.getItem("celular");
      const savedLogo = await AsyncStorage.getItem('logo');
      const savedProfileImage = await AsyncStorage.getItem('foto');

      if (savedNome) setNome(savedNome);
      if (savedCreci) setCreci(savedCreci);
      if (savedCelular) setCelular(savedCelular);
      if (savedLogo) setLogoUri(savedLogo);
      if (savedProfileImage) setProfileImage(savedProfileImage);
    };
    loadUserData();
  }, []);

  const pickImage = async (slot: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (slot === 1) setImageMain(uri);
      if (slot === 2) setImageTop(uri);
      if (slot === 3) setImageBottom(uri);
    }
  };

  const handleTemplate = () => {
    setShowButton(false);
    navigation.setOptions({ headerStyle: { opacity: 0 } });
    InteractionManager.runAfterInteractions(async () => {
      try {
        const uri = await captureScreenAfterRender();
        if (uri) {
          const fileUri = await saveCapturedImage(uri);
          await shareCapturedImage(fileUri);
        }
      } catch (error) {
        handleCaptureError(error);
      } finally {
        setShowButton(true);
        navigation.setOptions({ headerStyle: { opacity: 1 } });
      }
    });
  };

  const captureScreenAfterRender = async () => {
    try {
      const uri = await captureScreen({
        format: "png",
        quality: 1,
      });
      return uri;
    } catch (error) {
      console.error("Erro ao capturar a tela:", error);
      throw error;
    }
  };

  const saveCapturedImage = async (uri: string) => {
    const fileUri = FileSystem.cacheDirectory + "montagem.png";
    await FileSystem.copyAsync({ from: uri, to: fileUri });
    return fileUri;
  };

  const shareCapturedImage = async (fileUri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("O compartilhamento não é suportado neste dispositivo.");
    }
  };

  const handleCaptureError = (error: any) => {
    console.error("Erro ao capturar e compartilhar a imagem:", error);
    alert("Ocorreu um erro ao tentar capturar ou compartilhar a imagem.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        {/* Topo: localização central e logo no canto superior direito */}
        <View style={styles.topRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#192847" />
            <Text style={styles.locationText}>{formData.bairro}</Text>
          </View>
          {/* {logoUri && (
            <Image source={{ uri: logoUri }} style={styles.logoTop} />
          )} */}
        </View>

        {/* Centro: imagem grande esquerda + duas menores direita */}
        <View style={styles.imagesRow}>
          <TouchableOpacity style={styles.imageMain} onPress={() => pickImage(1)}>
            <ImageBackground
              source={imageMain ? { uri: imageMain } : require('../../../assets/default-image.jpeg')}
              style={styles.imageFill}
            />
          </TouchableOpacity>
          <View style={styles.imageColumn}>
            <TouchableOpacity style={styles.imageHalf} onPress={() => pickImage(2)}>
              <ImageBackground
                source={imageTop ? { uri: imageTop } : require('../../../assets/default-image.jpeg')}
                style={styles.imageFill}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageHalf} onPress={() => pickImage(3)}>
              <ImageBackground
                source={imageBottom ? { uri: imageBottom } : require('../../../assets/default-image.jpeg')}
                style={styles.imageFill}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Abaixo das imagens: preço à esquerda + dados do imóvel à direita */}
        <View style={styles.bottomInfoRow}>
          <Text style={styles.priceText}>{formData.valor}</Text>
          <Text style={styles.customText}>{formData.textoCustomizado}</Text>
        </View>

        {/* Rodapé: foto do usuário canto inferior esquerdo + dados ao lado */}
        <View style={styles.footerRow}>
          {profileImage && (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nome}</Text>
            <Text style={styles.userCreci}>CRECI: {creci}</Text>
            <Text style={styles.userCreci}>{celular}</Text>
          </View>
          {/* Logo no canto inferior direito */}
          {logoUri && (
            <Image source={{ uri: logoUri }} style={styles.logoBottom} />
          )}
        </View>
      </View>

      {showButton && (
        <TouchableOpacity style={styles.button} onPress={handleTemplate}>
          <Text style={styles.buttonText}>Gerar Arte</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  postContainer: {
    width: width * 0.95,
    aspectRatio: 1, // formato post IG
    backgroundColor: '#fff',
    position: 'relative',
    padding: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    marginLeft: 4,
    color: '#192847'
  },
  logoTop: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 30,
    resizeMode: 'cover'
  },
  imagesRow: {
    flexDirection: 'row',
    height: '65%',
  },
  imageMain: {
    flex: 2,
    marginRight: 4,
  },
  imageColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageHalf: {
    flex: 1,
    marginBottom: 4,
  },
  imageFill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '400',
    letterSpacing: 1.5,
    color: '#192847'
  },
  customText: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '400',
    letterSpacing: 1.5,
    color: '#192847',
    textAlign: 'right'
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
    marginTop: 6
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#192847'
  },
  userCreci: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '300',
    color: '#555',
    marginTop: 1
  },
  logoBottom: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    bottom: 32,
    width: '95%',
    backgroundColor: '#192847',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center'
  },
});
