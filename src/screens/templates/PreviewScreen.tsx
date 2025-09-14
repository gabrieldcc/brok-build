import React from 'react';
import { useState } from 'react';
import { useRoute } from "@react-navigation/native";
import { View, Text, ImageBackground, Dimensions, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const postHeight = width * 5 / 4;

export default function PreviewScreen({ navigation }: any) {
    const route = useRoute();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const { formData = {} } = route.params || {};

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
                ></ImageBackground>
            </TouchableOpacity>
            <View style={styles.rectangle}>
                {Object.entries(formData)
                    .filter(([_, value]) => value !== null && value !== "")
                    .map(([key, value], index) => (
                        <Text key={index} style={styles.textField}>
                            {key}: {value}
                        </Text>
                    ))
                }
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    rectangle: {
        width: width * 0.3,          // 30% da largura da tela
        height: postHeight,
        backgroundColor: 'rgba(0,0,0,0.5)', // preto translúcido
        padding: 5,
        justifyContent: 'flex-start', // empilha de cima para baixo
        position: 'absolute',
        left: 0, // encosta na lateral esquerda

    },
    textField: {
        color: '#fff',
        fontSize: 10,
        marginVertical: 1,
    },
    image: {
        width: width * 0.3,          // 30% da largura da tela
        height: postHeight,
    },
    background: {
        // width e height são definidas dinamicamente acima
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

