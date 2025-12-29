import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

type CardProps = {
    title: string;
    image: any;
    navigateTo: string;
};

export default function Card({ title, image, navigateTo }: CardProps) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => (navigation as any).navigate('ProductList', { category: title })}
        >
            <Image source={image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}
