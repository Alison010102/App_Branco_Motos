import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { cablesStyles as styles } from "./cablesStyles";

const categories = [
    "Cabo do acelerador A",
    "Cabo do acelerador B",
    "Cabo da embreagem",
    "Cabo do velocímetro"
];

export default function CablesSub() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");

    const filteredCategories = categories.filter(cat => 
        cat.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: '#2B2D42' }]}>
            <StatusBar style="light" backgroundColor="#2B2D42" translucent={true} />
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#2B2D42' }}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cabos</Text>
                    <View style={{ width: 32 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#FFF" />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Pesquisar..."
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </SafeAreaView>

            <View style={styles.listArea}>
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={styles.content}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() => (navigation as any).navigate('ProductList', { category: item })}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons name="git-commit-outline" size={24} color="#D90429" />
                            </View>
                            <Text style={styles.categoryText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <Ionicons name="search-outline" size={50} color="#8D99AE" />
                            <Text style={{ color: '#8D99AE', marginTop: 10 }}>Nenhuma subcategoria encontrada</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}
