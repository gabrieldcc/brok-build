import React, { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native";
import {
    View, Text, ImageBackground, Dimensions, StyleSheet,
    Image, TouchableOpacity, InteractionManager
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { width } = Dimensions.get('window');
const postHeight = width * 5 / 4;

export default function SoldOutDaysScreen({ navigation }: any) {
    const route = useRoute();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const { formData = {} } = route.params || {};
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [creci, setCreci] = useState('');
    const [celular, setCelular] = useState('');
    const [showButton, setShowButton] = useState(true);
    const [profilePic, setProfilePic] = useState("");


    useEffect(() => {
        const loadUserData = async () => {
            const savedNome = await AsyncStorage.getItem("nome");
            const savedCreci = await AsyncStorage.getItem("creci");
            const savedCelular = await AsyncStorage.getItem("celular");
            const savedLogo = await AsyncStorage.getItem('logo');
            const savedProfilePic = await AsyncStorage.getItem("foto");
            if (savedNome) setNome(savedNome);
            if (savedCreci) setCreci(savedCreci);
            if (savedCelular) setCelular(savedCelular);
            if (savedLogo) setLogoUri(savedLogo);
            if (savedProfilePic) setProfilePic(savedProfilePic)
        };
        loadUserData();
    }, []);

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: false,
            selectionLimit: 1,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setMainImage(uri);
        }
    };

    // labels do formulário
    const labels: Record<string, string> = {
        type: 'Tipo do imóvel',
        bairro: 'Bairro',
        valor: 'Valor',
        quartos: 'Quartos',
        suites: 'Suítes',
        banheiros: 'Banheiros',
        vagas: 'Vagas de garagem',
        areaGourmet: 'Área gourmet',
        diasVenda: 'Dias à venda',
        textoCustomizado: 'Informações adicionais',
    };

    return (
        <View style={styles.container}>
            {/* fundo com imagem */}
            <TouchableOpacity onPress={pickImage}>
                <ImageBackground
                    source={
                        mainImage
                            ? { uri: mainImage }
                            : require('../../../assets/default-image.jpeg')
                    }
                    style={[styles.background, { width: width, height: postHeight }]}
                    resizeMode="cover"
                >

                    {/* TOPO - retângulo branco */}
                    <View style={styles.topBar}>
                        <View style={styles.topTextsContainer}>
                            <Text style={styles.plusText}>+1</Text>
                            <View style={styles.negocioContainer}>
                                <Text style={styles.negocioText}>Negócio</Text>
                                <Text style={styles.negocioText}>realizado</Text>
                            </View>
                        </View>
                    </View>

                    {/* Retângulo diagonal central */}
                    <View style={styles.diagonalContainer}>
                        <Text style={styles.diagonalText}>
                            {formData.textoCustomizado || 'Seu texto aqui'}
                        </Text>
                    </View>

                    {/* BASE - retângulo branco com dados */}
                    <View style={styles.bottomBar}>
                        {/* foto do usuário */}
                        <View style={styles.userPhotoContainer}>
                            <Image
                                source={
                                    logoUri
                                        ? { uri: profilePic }
                                        : require('../../../assets/default-image.jpeg')
                                }
                                style={styles.userPhoto}
                            />
                        </View>

                        {/* dados do usuário */}
                        <View style={styles.userData}>
                            <Text style={styles.userName}>{nome}</Text>
                            <Text style={styles.userPhone}>{celular}</Text>
                            <Text style={styles.userCreci}>CRECI: {creci}</Text>
                        </View>

                        {/* logo da empresa */}
                        {logoUri && (
                            <Image source={{ uri: logoUri }} style={styles.companyLogo} resizeMode="cover" />
                        )}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
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
        marginTop: 60,
        // paddingBottom: 32

    },
    background: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    /* TOPO */
    topBar: {
        position: 'absolute',
        top: 20,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        justifyContent: 'space-between',
        opacity: 0.7
    },
    topLogo: {
        width: 40,
        height: 40,
    },
    topText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },

    /* Retângulo diagonal */
    diagonalContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        width: width * 0.8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        transform: [{ rotate: '-15deg' }],
        padding: 20,
    },
    diagonalText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },

    /* BASE */
    bottomBar: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        backgroundColor: '#fff',
        // borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        opacity: 0.9
    },
    userPhotoContainer: {
        marginRight: 10,
    },
    userPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userData: {
        flex: 1,
        paddingHorizontal: 10,
    },
    userName: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    userPhone: {
        fontSize: 12,
        color: '#000',
        fontWeight: '300',
        marginTop: 4
    },
    userCreci: {
        fontSize: 12,
        fontWeight: '300',
        color: '#000',
        marginTop: 4
    },
    companyLogo: {
        width: 50,
        height: 50,
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
    topTextsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    plusText: {
        fontSize: 40,          
        fontWeight: 'bold',
        color: '#000',
        marginRight: 8,
    },
    negocioContainer: {
        justifyContent: 'flex-end',
    },
    negocioText: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 1.5,
        color: '#000',
        textTransform: 'uppercase'
    },

});
