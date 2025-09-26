import React from 'react';
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChooseTemplateScreen({ navigation }: any) {
    const route = useRoute();
    // const { images, profilePic } = route.params ?? {};
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const templateImages = [
        { id: '1', source: require('../../assets/temp1.jpeg') },
        { id: '2', source: require('../../assets/temp2.jpeg') },
        { id: '3', source: require('../../assets/temp3.jpeg') },
        { id: '4', source: require('../../assets/temp4.jpeg') },
        { id: '5', source: require('../../assets/temp5.jpeg') },
    ];

    const handlePress = (templateId: string) => {
        // Alert.alert(`Você clicou na imagem ${index + 1}`);
        navigation.navigate('PropertyForm', { templateId })
    };

    // Navegar para a tela de edição de perfil
    const goToEditProfile = () => {
        navigation.navigate("ProfileScreen", { profileImage, setProfileImage });
        //navigation.navigate("ProfileScreen");
    };


    const renderItem = ({ item, index }: { item: typeof templateImages[0], index: number }) => (
        <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.imageContainer}>
            <Image source={item.source} style={styles.image} resizeMode='contain' />
        </TouchableOpacity>
    );

    useFocusEffect(
        React.useCallback(() => {
            const loadUserData = async () => {
                const savedProfileImage = await AsyncStorage.getItem("foto");
                console.log(`profilepic: ${savedProfileImage}`);
                setProfileImage(savedProfileImage);
            };
            loadUserData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={goToEditProfile} style={styles.profileButton}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profilePic} />
                ) : (
                    <Text style={styles.profileText}>+</Text>
                )}
            </TouchableOpacity>
            <FlatList
                data={templateImages.filter(Boolean)} // remove nulls
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                numColumns={1}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    spacer: {
        paddingTop: 30,
    },
    imageContainer: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 450,
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
        shadowColor: '#000',           // cor da sombra
        shadowOffset: { width: 0, height: 2 }, // deslocamento
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: "cover",
    },
    profileButton: {
        position: "absolute",
        top: 10,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ddd",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 10,       // <-- adiciona
        elevation: 10,
    },
    profileText: {
        fontSize: 20,
        color: "#aaa",
    },
});
