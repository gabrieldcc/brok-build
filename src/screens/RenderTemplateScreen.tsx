
import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, InteractionManager, Dimensions, Text } from "react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRoute } from "@react-navigation/native";
import logoImage from "./../../assets/remax-logo.png"
import remaxNameImage from "./../../assets/remax-name.png"
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tamanho da tela
const { width, height } = Dimensions.get('window');

export default function RenderTemplateScreen({ navigation }: any) {
  const viewRef = useRef<View>(null);
  const route = useRoute();
  const { images, profilePic } = route.params;
  const [creci, setCreci] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    handleProfileInfo()
    hideNavigationBar()
    handleTemplate()
  }, [images, profilePic, navigation]);

  const hideNavigationBar = () => {
    // Oculta a barra de navegação temporariamente
    navigation.setOptions({ headerShown: false });
  }

  const handleProfileInfo = async () => {
    const savedName = await AsyncStorage.getItem("nome");
    const savedCreci = await AsyncStorage.getItem("creci");
    setCreci(savedCreci)
    setName(savedName)
  }

  const handleTemplate = () => {
    InteractionManager.runAfterInteractions(async () => {
      if (viewRef.current) {
        try {
          const uri = await captureScreenAfterRender();
          if (uri) {
            const fileUri = await saveCapturedImage(uri);
            await shareCapturedImage(fileUri);
          }
        } catch (error) {
          handleCaptureError(error);
        }
      }
      restoreNavigationBar();
    });
  };

  // Função para capturar a tela após a renderização completa
  const captureScreenAfterRender = async () => {
    try {
      const uri = await captureScreen({
        format: "png",
        quality: 1,
      });
      console.log("Imagem capturada:", uri);
      return uri;
    } catch (error) {
      console.error("Erro ao capturar a tela:", error);
      throw error;
    }
  };

  // Função para salvar a imagem capturada em um local acessível
  const saveCapturedImage = async (uri: string) => {
    const fileUri = FileSystem.cacheDirectory + "montagem.png";
    await FileSystem.copyAsync({ from: uri, to: fileUri });
    return fileUri;
  };

  // Função para compartilhar a imagem
  const shareCapturedImage = async (fileUri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("O compartilhamento não é suportado neste dispositivo.");
    }
  };

  // Função para lidar com erros durante o processo de captura e compartilhamento
  const handleCaptureError = (error: any) => {
    console.error("Erro ao capturar e compartilhar a imagem:", error);
    alert("Ocorreu um erro ao tentar capturar ou compartilhar a imagem.");
  };

  // Função para restaurar a barra de navegação após a captura
  const restoreNavigationBar = () => {
    navigation.setOptions({ headerShown: true });
  };

  return (
    <View style={styles.container}>
      {/* Renderiza a imagem conforme o template, ocupando toda a tela */}
      <View ref={viewRef} style={styles.captureArea}>
        <View style={{ flexDirection: 'row'  }}>
          <Image source={logoImage} style={styles.logoImage} />
          <Image source={remaxNameImage} style={styles.remaxNameImage} />
        </View>
        {images.length > 0 && <Image source={{ uri: images[0] }} style={styles.mainImage} />}
        <View style={styles.row}>
          {images.slice(1, 4).map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.smallImage} />
          ))}
        </View>
        <View style={styles.brokerContainer}>
          {profilePic && <Image source={{ uri: profilePic }} style={styles.profileImage} />}
          <View style={styles.brokerInfoContainer}>
            <Text style={styles.brokerName}>{name}</Text>
            <Text style={styles.brokerCreci}>{`Creci: ${creci}`}</Text>
          </View>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#192847",
  },
  captureArea: {
    width: width,
    height: height,
    backgroundColor: "#192847",
    alignItems: "center",
    padding: 10,
    marginTop: 100,
  },
  mainImage: {
    width: width * 0.87,
    height: height * 0.4,
    resizeMode: "cover",
    marginTop: 40
  },
  logoImage: {
    resizeMode: "contain",
    height: 50,
    width: 50,
    backgroundColor: "#192847",
    resizeMode: 'cover',
  },
  remaxNameImage: {
    resizeMode: "contain",
    height: 50,
    width: 120,
    backgroundColor: "#192847",
    resizeMode: 'cover',
    marginLeft: 8
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
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 10,
    resizeMode: "cover",
  },
  brokerContainer: {
    position: 'absolute',
    top: height * 0.65,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  brokerName: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
    fontFamily: "Arial"
  },
  brokerCreci: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    marginTop: 8,
    fontFamily: "Arial"
  },
  brokerInfoContainer: {
    flexDirection: 'column',
    padding: 10,
  },
});