import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { storage, Product } from "../../config/storage";
import { styles } from "./styles";

export default function ProductList() {
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params as { category: string };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        const data = await storage.getProductsByCategory(category);
        setProducts(data);
        setLoading(false);
    }, [category]);

    useFocusEffect(
        useCallback(() => {
            loadProducts();
        }, [loadProducts])
    );

    const updateQuantity = async (id: string, amount: number) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const newQuantity = Math.max(0, product.quantity + amount);
        const success = await storage.updateProduct(id, { quantity: newQuantity });

        if (success) {
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, quantity: newQuantity } : p
            ));
        }
    };

    const renderItem = ({ item }: { item: Product }) => {
        const isOutOfStock = item.quantity === 0;

        return (
            <View style={[styles.card, isOutOfStock && styles.cardOutItem]}>
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={[styles.productImage, isOutOfStock && styles.imageGrayscale]}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons
                            name="image-outline"
                            size={30}
                            color={isOutOfStock ? "#8D99AE" : "#2B2D42"}
                        />
                    </View>
                )}

                <View style={styles.infoContainer}>
                    <Text style={[styles.productName, isOutOfStock && { color: '#8D99AE' }]}>
                        {item.name}
                    </Text>
                    {isOutOfStock ? (
                        <Text style={styles.outOfStockText}>Acabou no Estoque</Text>
                    ) : (
                        <Text style={styles.productBarcode}>EAN: {item.barcode}</Text>
                    )}
                </View>

                <View style={styles.stockControls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => updateQuantity(item.id, 1)}
                    >
                        <Ionicons name="add" size={20} color="#2B2D42" />
                    </TouchableOpacity>

                    <Text style={[styles.stockValue, isOutOfStock && { color: '#D90429' }]}>
                        {item.quantity}
                    </Text>

                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => updateQuantity(item.id, -1)}
                    >
                        <Ionicons name="remove" size={20} color="#2B2D42" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{category}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("RegisterProduct" as never)}>
                    <Ionicons name="add-circle" size={32} color="#FFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#D90429" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={60} color="#8D99AE" />
                            <Text style={styles.emptyText}>Nenhum produto nesta categoria</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
