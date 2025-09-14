import React from 'react';
import { useRoute } from "@react-navigation/native";
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ChooseTemplateScreen({ navigation }: any) {
    const route = useRoute();
    const { images, profilePic } = route.params ?? {}; // imagens enviadas pelo SelectImagesScreen

    const templateImages = [
        { id: '1', source: require('../../assets/temp1.jpeg') },
        { id: '2', source: require('../../assets/temp2.jpeg') },
        { id: '3', source: require('../../assets/temp3.jpeg') },
        { id: '4', source: require('../../assets/temp4.jpeg') },
        { id: '4', source: require('../../assets/temp5.jpeg') },
    ];

    const handlePress = (index: number) => {
        // Alert.alert(`Você clicou na imagem ${index + 1}`);
        navigation.navigate('PropertyForm')
    };

    const renderItem = ({ item, index }: { item: typeof templateImages[0], index: number }) => (
    <TouchableOpacity onPress={() => handlePress(index)} style={styles.imageContainer}>
        <Image source={item.source} style={styles.image} resizeMode='contain'/>
    </TouchableOpacity>
);

    return (
        <View style={styles.container}>
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
});
