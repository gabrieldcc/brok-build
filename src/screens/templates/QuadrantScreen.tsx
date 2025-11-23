import React, { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import {
    View, Text, ImageBackground, Dimensions, StyleSheet,
    Image, TouchableOpacity, InteractionManager
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { width, height } = Dimensions.get('window');
// proporção story 9:16 -> usamos a altura do device para manter a proporção
const storyHeight = height;

export default function QuadrantScreen({ navigation }: any) {
    const route = useRoute();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const { formData = {} } = route.params || {};
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [creci, setCreci] = useState('');
    const [celular, setCelular] = useState('');
    const [showButton, setShowButton] = useState(true);
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [image3, setImage3] = useState<string | null>(null);
    const [image4, setImage4] = useState<string | null>(null);

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

    const handleTemplate = () => {
        // setIsLoading(true)
        // Esconde o botão antes da captura
        setShowButton(false);
        navigation.setOptions({ headerShown: false });
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
                navigation.setOptions({ headerShown: true });
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

    // const pickImage = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: "images",
    //         allowsMultipleSelection: false,
    //         selectionLimit: 1,
    //     });
    //     if (!result.canceled) {
    //         const uri = result.assets[0].uri;
    //         setMainImage(uri);
    //     }
    // };

    const pickImage = async (slot: number) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsMultipleSelection: false,
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            if (slot === 1) setImage1(uri);
            if (slot === 2) setImage2(uri);
            if (slot === 3) setImage3(uri);
            if (slot === 4) setImage4(uri);
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
            <View style={styles.grid}>
                {/* superior esquerdo */}
                <TouchableOpacity style={[styles.box, styles.topLeft]} onPress={() => pickImage(1)}>
                    <ImageBackground
                        source={image1 ? { uri: image1 } : require('../../../assets/default-image.jpeg')}
                        style={styles.image}
                    />
                </TouchableOpacity>

                {/* superior direito */}
                <TouchableOpacity style={[styles.box, styles.bottomRight, styles.topLeft]} onPress={() => pickImage(2)}>
                    <ImageBackground
                        source={image2 ? { uri: image2 } : require('../../../assets/default-image.jpeg')}
                        style={styles.image}
                    />
                </TouchableOpacity>

                {/* inferior esquerdo com dados */}
                <View style={[styles.box, styles.bottomRight, styles.topLeft, styles.infoBox]}>
                    <Text style={styles.customText}>{formData.textoCustomizado}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={18} color="#333" />
                        <Text style={styles.infoText}>{formData.bairro}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="bed-outline" size={18} color="#333" />
                        <Text style={styles.infoText}>{formData.quartos} dormitórios</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="home-outline" size={18} color="#333" />
                        <Text style={styles.infoText}>{formData.suites} suítes</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="water-outline" size={18} color="#333" />
                        <Text style={styles.infoText}>{formData.banheiros} banheiros</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="car-outline" size={18} color="#333" />
                        <Text style={styles.infoText}>{formData.vagas} vagas</Text>
                    </View>

                    <Text style={styles.priceText}>R$ {formData.valor}</Text>
                </View>


                {/* inferior direito */}
                <TouchableOpacity style={[styles.box, styles.bottomRight, styles.topLeft
                ]} onPress={() => pickImage(4)}>
                    <ImageBackground
                        source={image4 ? { uri: image4 } : require('../../../assets/default-image.jpeg')}
                        style={styles.image}
                    />
                </TouchableOpacity>
            </View>

            {/* Logo centralizada */}
            {logoUri && (
                <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="cover" />
            )}

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
        padding: 16,
        justifyContent: 'center',
    },
    grid: {
        width: '95%',
        height: storyHeight * 0.6, // ocupa 80% da altura do story
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center',
        gap: 12
    },
    box: {
        width: '48%',
        height: '48%', // metade da altura do grid para cada linha
        marginBottom: '4%',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    topLeft: {
        borderTopLeftRadius: 30,
    },
    topRight: {},
    bottomLeft: {},
    bottomRight: {
        borderBottomRightRadius: 30,
    },
    logo: {
        width: 150,
        height: 70,
        alignSelf: 'center',
        marginTop: 16,
        borderRadius: 6,
        overflow: 'hidden',
        // resizeMode: 'cover'
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
    infoBox: {
        padding: 16,
        justifyContent: 'flex-start',
    },

    customText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#192847'
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },

    infoText: {
        fontSize: 14,
        marginLeft: 6,
        color: '#333'
    },

    priceText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#192847'
    }
});
