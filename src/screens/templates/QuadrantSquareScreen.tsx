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

export default function QuadrantScreen({navigation}) {
    const route = useRoute();
    const { formData = {} } = route.params || {};
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showButton, setShowButton] = useState(true);

    const [nome, setNome] = useState('');
    const [creci, setCreci] = useState('');
    const [celular, setCelular] = useState('');

    const [image2, setImage2] = useState<string | null>(null);
    const [image3, setImage3] = useState<string | null>(null);
    const [image4, setImage4] = useState<string | null>(null);

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
            if (slot === 2) setImage2(uri);
            if (slot === 3) setImage3(uri);
            if (slot === 4) setImage4(uri);
        }
    };


    const handleTemplate = () => {
        // setIsLoading(true)
        // Esconde o botão antes da captura
        setShowButton(false);
        navigation.setOptions({
            headerStyle: { opacity: 0 },
        });
        InteractionManager.runAfterInteractions(async () => {
            // if (viewRef.current) {
            try {
                // await delay(500);
                const uri = await captureScreenAfterRender();
                if (uri) {
                    const fileUri = await saveCapturedImage(uri);
                    await shareCapturedImage(fileUri);
                }
            } catch (error) {
                handleCaptureError(error);
            } finally {
                setShowButton(true);
                navigation.setOptions({
                    headerStyle: { opacity: 1 },
                });
                // setIsLoading(false);
                // restoreNavigationBar();
            }
            // }
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
    

    return (
        <View style={styles.container}>
            {/* container do post */}
            <View style={styles.postContainer}>
                <View style={styles.grid}>
                    {/* 1º quadrado com info */}
                    <View style={[styles.box, styles.infoBox]}>
                        <Text style={styles.customText}>{formData.textoCustomizado}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={16} color="#192847" />
                            <Text style={styles.locationText}>{formData.bairro}</Text>
                        </View>
                        <Text style={styles.priceText}>{formData.valor}</Text>
                    </View>

                    {/* 2º quadrado */}
                    <TouchableOpacity style={styles.box} onPress={() => pickImage(2)}>
                        <ImageBackground
                            source={image2 ? { uri: image2 } : require('../../../assets/default-image.jpeg')}
                            style={styles.image}
                        />
                    </TouchableOpacity>

                    {/* 3º quadrado */}
                    <TouchableOpacity style={styles.box} onPress={() => pickImage(3)}>
                        <ImageBackground
                            source={image3 ? { uri: image3 } : require('../../../assets/default-image.jpeg')}
                            style={styles.image}
                        />
                    </TouchableOpacity>

                    {/* 4º quadrado */}
                    <TouchableOpacity style={styles.box} onPress={() => pickImage(4)}>
                        <ImageBackground
                            source={image4 ? { uri: image4 } : require('../../../assets/default-image.jpeg')}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>

                {/* dados do usuário */}
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{nome}</Text>
                    <Text style={styles.userCreci}>CRECI: {creci}</Text>
                    <Text style={styles.userCreci}>{celular}</Text>
                </View>

                {/* sobreposições */}
                {profileImage && (
                    <Image source={{ uri: profileImage }} style={styles.profilePic} />
                )}
                {logoUri && (
                    <Image source={{ uri: logoUri }} style={styles.companyLogoCorner} />
                )}
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
        aspectRatio: 1,
        backgroundColor: '#fff',
        position: 'relative' // permite posicionar absolutos dentro
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        height: '80%', // parte superior do post
        padding: 4,
    },
    box: {
        width: '48%',
        height: '48%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: '4%',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    infoBox: {
        padding: 10,
        justifyContent: 'flex-start',
    },
    customText: {
        fontSize: 20,
        fontFamily: 'serif',
        fontWeight: '400',
        letterSpacing: 2.5,
        textAlign: 'center',
        marginBottom: 6,
        color: '#192847'
    },
    locationWrapper: {
        backgroundColor: '#ddd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'center',
        marginBottom: 6,
        borderRadius: 4
    },
    locationText: {
        fontSize: 14,
        color: '#333'
    },
    priceText: {
        fontSize: 18,
        fontWeight: '400',
        letterSpacing: 1.5,
        color: '#192847',
        textAlign: 'center',
        marginTop: 6
    },
    userInfo: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        left: 20
    },
    userName: {
        fontSize: 13,
        fontWeight: '400',
        textTransform: 'uppercase',
        color: '#192847',
    },
    userCreci: {
        fontSize: 12,
        color: '#555',
    },
    profilePic: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 10
    },
    companyLogoCorner: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 50,
        height: 50,
        resizeMode: 'contain',
        zIndex: 10
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // centraliza horizontalmente
        backgroundColor: '#ddd',  // fundo cinza de destaque
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'center',
        marginBottom: 6,
        borderRadius: 4,
        width: '100%'
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
    // locationText: {
    //     fontSize: 14,
    //     color: '#333',
    //     marginLeft: 4 // espaçamento entre ícone e texto
    // }

});
