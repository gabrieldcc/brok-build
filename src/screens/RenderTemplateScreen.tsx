
import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, InteractionManager, Dimensions, Text, ActivityIndicator } from "react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useRoute } from "@react-navigation/native";
import logoImage from "./../../assets/remax-logo.png"
import remaxNameImage from "./../../assets/remax-name.png"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';


// Tamanho da tela
const { width, height } = Dimensions.get('window');

export default function RenderTemplateScreen({ navigation }: any) {
    const viewRef = useRef<View>(null);
    const route = useRoute();
    const { images, profilePic } = route.params;
    const [creci, setCreci] = useState("")
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true)
        InteractionManager.runAfterInteractions(async () => {
            if (viewRef.current) {
                try {
                    await delay(500);
                    const uri = await captureScreenAfterRender();
                    if (uri) {
                        const fileUri = await saveCapturedImage(uri);
                        await shareCapturedImage(fileUri);
                    }
                } catch (error) {
                    handleCaptureError(error);
                } finally {
                    setIsLoading(false);
                    restoreNavigationBar();
                }
            }
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

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    return (

        <View style={styles.container}>

            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Gerando imagem...</Text>
                </View>
            )}

            <View ref={viewRef} style={styles.captureArea}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
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

                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
                            <Text style={styles.brokerName}>{name}</Text>
                        </View>

                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <Ionicons name="document-text-outline" size={20} color="#999" style={styles.icon} />
                            <Text style={styles.brokerCreci}>{`Creci: ${creci}`}</Text>
                        </View>

                        <View style={[styles.row, { alignItems: 'center' }]}>
                            <Ionicons name="call-outline" size={20} color="#999" style={styles.icon} />
                            <Text style={styles.brokerCellphone}>{`${creci}`}</Text>
                        </View>

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
        height: height * 0.35,
        resizeMode: "cover",
        marginTop: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
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
        marginTop: 4
    },
    smallImage: {
        width: 100,
        height: 100,
        margin: 5,
        resizeMode: "cover",
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
        resizeMode: "cover",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#fff',
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
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    brokerCreci: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },
    brokerCellphone: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
    },

    brokerInfoContainer: {
        flexDirection: 'column',
        padding: 10,
    },
    icon: {
        marginTop: 8,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 16,
    }

});