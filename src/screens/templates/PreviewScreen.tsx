import React from 'react';
import { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native";
import { View, Text, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity, InteractionManager, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { width } = Dimensions.get('window');
const postHeight = width * 5 / 4;

export default function PreviewScreen({ navigation }: any) {
    const route = useRoute();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const { formData = {} } = route.params || {};
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [creci, setCreci] = useState('');
    const [celular, setCelular] = useState('');
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        const loadLogo = async () => {
            const savedLogo = await AsyncStorage.getItem('logo'); // mesma chave que você usou no cadastro
            if (savedLogo) {
                setLogoUri(savedLogo);
            }
        };
        loadLogo();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            const savedNome = await AsyncStorage.getItem("nome");
            const savedCreci = await AsyncStorage.getItem("creci");
            const savedCelular = await AsyncStorage.getItem("celular");
            const savedLogo = await AsyncStorage.getItem('logo');
            if (savedNome) setNome(savedNome);
            if (savedCreci) setCreci(savedCreci);
            if (savedCelular) setCelular(savedCelular);
            if (savedLogo) setLogoUri(savedLogo);
        };
        loadUserData();
    }, []);

    const pickImage = async () => {
        console.log('tapped')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: false,
            selectionLimit: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setMainImage(uri);
        }
    }

    console.log("formData --------", JSON.stringify(formData, null, 2));

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
            <TouchableOpacity onPress={pickImage}>
                <ImageBackground
                    // source={require('../../../assets/default-image.jpeg')} // sua imagem local aqui
                    source={
                        mainImage
                            ? { uri: mainImage } // imagem escolhida
                            : require('../../../assets/default-image.jpeg') // fallback local
                    }
                    style={[styles.background, { width: width, height: postHeight }]}
                    resizeMode="cover"
                >
                    {logoUri && (
                        <View style={styles.logoContainer}>
                            <Image
                                source={{ uri: logoUri }}
                                style={styles.logoImage}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                </ImageBackground>
            </TouchableOpacity>
            <View style={styles.rectangle}>
                {/* Topo: Tipo, Bairro e Valor */}
                <View style={styles.topSection}>
                    {formData.type && <Text style={styles.typeText}>{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</Text>}
                    {formData.bairro && <Text style={styles.bairroText}>{formData.bairro}</Text>}
                    {formData.valor && <Text style={styles.valorText}>{formData.valor}</Text>}
                </View>

                {/* Meio: Informações do imóvel */}
                <View style={styles.middleSection}>
                    {formData.quartos != null && <Text style={styles.infoItem}>{formData.quartos} dormitórios</Text>}
                    {formData.suites != null && <Text style={styles.infoItem}>{formData.suites} suítes</Text>}
                    {formData.banheiros != null && <Text style={styles.infoItem}>{formData.banheiros} banheiros</Text>}
                    {formData.vagas != null && <Text style={styles.infoItem}>{formData.vagas} vagas</Text>}
                </View>

                {/* Base: Dados do usuário */}
                <View style={styles.bottomSection}>
                    <Text style={styles.userName}>{nome}</Text>
                    <Text style={styles.userCreci}>CRECI: {creci}</Text>
                    <Text style={styles.userPhone}>{celular}</Text>
                </View>
                {/* Logo na base do retângulo */}
                {logoUri && (
                    <Image
                        source={{ uri: logoUri }}
                        style={styles.logoImageBase}
                        resizeMode="cover"
                    />
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
        alignItems: 'center',
        backgroundColor: '#eee',
        marginTop: 60,
    },
    rectangle: {
        width: width * 0.4,
        height: postHeight,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 24,
        justifyContent: 'space-between', // divide topo, meio e base
        position: 'absolute',
        left: 0,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    logoContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    topSection: {
        alignItems: 'flex-start',
    },
    typeText: {
        fontSize: 22,
        fontWeight: '500',
        letterSpacing: 3,
        color: '#fff',
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    bairroText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 4,
    },
    valorText: {
        fontSize: 15,
        fontWeight: '300',
        color: '#fff',
        marginBottom: 8,
    },
    middleSection: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    infoItem: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    bottomSection: {
        alignItems: 'flex-start',
    },
    userName: {
        fontWeight: '400',
        fontSize: 18,
        letterSpacing: 1.5,
        color: '#fff',
        marginBottom: 2,
    },
    userCreci: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
    },
    userPhone: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        alignSelf: 'center',
    },
    logoImageBase: {
        width: 150,           // tamanho da logo
        height: 80,
        marginTop: 8,        // espaço acima da logo
        alignSelf: 'center', // ou 'center' se quiser centralizar
        borderRadius: 8
    }

});


