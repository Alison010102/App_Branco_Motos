import React, { useState, useCallback } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, FlatList, LayoutAnimation, Platform, UIManager } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";
import Card from "../screens/Cards/Cards";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { storage, Product } from "../config/storage";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function Home() {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (text: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSearch(text);
        if (text.length > 0) {
            setLoading(true);
            try {
                const results = await storage.searchProducts(text);
                setSearchResults(results);
            } catch (error) {
                console.error("Error searching:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (search.length > 0) {
                handleSearch(search);
            }
        }, [search])
    );

    const renderSearchResult = ({ item }: { item: Product }) => {
        const isOutOfStock = item.quantity === 0;
        return (
            <TouchableOpacity
                style={[styles.card, isOutOfStock && { opacity: 0.7 }, { width: '92%', alignSelf: 'center', marginBottom: 12, flexDirection: 'row', padding: 12 }]}
                onPress={() => (navigation as any).navigate('ProductList', { category: item.category })}
            >
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12, tintColor: isOutOfStock ? 'gray' : undefined }}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={{ width: 60, height: 60, borderRadius: 8, backgroundColor: '#EDF2F4', marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="cube-outline" size={30} color="#8D99AE" />
                    </View>
                )}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.title, { fontSize: 16, marginVertical: 0, textAlign: 'left' }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#8D99AE' }}>{item.category}</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: isOutOfStock ? '#D90429' : '#2B2D42' }}>
                        {isOutOfStock ? 'ESGOTADO' : `${item.quantity} em estoque`}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8D99AE" style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.topBar}>
                <Image
                    source={require("../../assets/branco1.png")}
                    style={styles.topImage}
                    resizeMode="contain"
                />
            </SafeAreaView>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#8D99AE" />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Nome ou código de barras..."
                    value={search}
                    onChangeText={handleSearch}
                    placeholderTextColor="#8D99AE"
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                        <Ionicons name="close-circle" size={20} color="#8D99AE" />
                    </TouchableOpacity>
                )}
            </View>

            {search.length > 0 ? (
                loading ? (
                    <ActivityIndicator size="large" color="#D90429" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSearchResult}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Ionicons name="search-outline" size={50} color="#8D99AE" />
                                <Text style={{ color: '#8D99AE', marginTop: 10 }}>Nenhum produto encontrado</Text>
                            </View>
                        }
                    />
                )
            ) : (
                <ScrollView contentContainerStyle={[styles.cardsContainer, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Categorias</Text>

                    <View style={styles.cardsRow}>
                        <Card
                            title="Óleos e lubrificantes"
                            image={require("../../assets/oleo.gif")}
                            navigateTo="Oleo"
                        />
                        <Card
                            title="Freios e suspensão"
                            image={require("../../assets/disc-brake.gif")}
                            navigateTo="Freios"
                        />
                    </View>
                    <View style={styles.cardsRow}>
                        <Card
                            title="Bateria e elétrica"
                            image={require("../../assets/renewable-energy.gif")}
                            navigateTo="Bateria"
                        />
                        <Card
                            title="Filtros e peças mecânicas"
                            image={require("../../assets/toolbox.gif")}
                            navigateTo="Filtros"
                        />
                    </View>
                    <View style={styles.cardsRow}>
                        <Card
                            title="Acessórios"
                            image={require("../../assets/helmet.gif")}
                            navigateTo="Acessorios"
                        />
                    </View>
                </ScrollView>
            )}

            <TouchableOpacity
                style={[styles.addButton, { position: 'absolute', bottom: 30, left: 20, right: 20 }]}
                onPress={() => navigation.navigate("RegisterProduct" as never)}
            >
                <Ionicons name="add" size={24} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Cadastrar Produto</Text>
            </TouchableOpacity>
        </View>
    );
}
