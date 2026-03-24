import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    ScrollView
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { storage, Product } from "../../config/storage";
import { styles } from "./styles";

export default function ProductList() {
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params as { category: string };

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [tempQuantity, setTempQuantity] = useState<number>(0);
    const [modalVisible, setModalVisible] = useState(false);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        const data = await storage.getProductsByCategory(category);
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
    }, [category]);

    const handleSearch = (text: string) => {
        setSearch(text);
        const lowerText = text.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(lowerText) || 
            p.barcode.includes(text) ||
            p.brand.toLowerCase().includes(lowerText)
        );
        setFilteredProducts(filtered);
    };

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
            const updateList = (prev: Product[]) => prev.map(p =>
                p.id === id ? { ...p, quantity: newQuantity } : p
            );
            setProducts(updateList);
            setFilteredProducts(updateList);
            if (selectedProduct?.id === id) {
                setSelectedProduct(prev => prev ? { ...prev, quantity: newQuantity } : null);
            }
        }
    };

    const handleQuantityAction = async (action: 'add' | 'withdraw') => {
        if (!selectedProduct) return;
        
        const change = action === 'add' ? tempQuantity : -tempQuantity;
        const newTotal = Math.max(0, selectedProduct.quantity + change);
        const success = await storage.updateProduct(selectedProduct.id, { quantity: newTotal });

        if (success) {
            const updateList = (prev: Product[]) => prev.map(p =>
                p.id === selectedProduct.id ? { ...p, quantity: newTotal } : p
            );
            setProducts(updateList);
            setFilteredProducts(updateList);
            setSelectedProduct(prev => prev ? { ...prev, quantity: newTotal } : null);
            setTempQuantity(0);
            Alert.alert("Sucesso", `Estoque atualizado para ${newTotal} unidades!`);
        } else {
            Alert.alert("Erro", "Não foi possível atualizar a quantidade.");
        }
    };

    const handleProductPress = (product: Product) => {
        setSelectedProduct(product);
        setTempQuantity(0); // Start at 0 for additive input
        setModalVisible(true);
    };

    const handleDelete = async (id: string, name: string) => {
        Alert.alert(
            "Confirmar exclusão",
            `Tem certeza que deseja excluir o item "${name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive",
                    onPress: async () => {
                        const success = await storage.deleteProduct(id);
                        if (success) {
                            const filterOut = (prev: Product[]) => prev.filter(p => p.id !== id);
                            setProducts(filterOut);
                            setFilteredProducts(filterOut);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Product }) => {
        const isOutOfStock = item.quantity === 0;

        return (
            <TouchableOpacity 
                style={[styles.card, isOutOfStock && styles.cardOutItem]}
                onPress={() => handleProductPress(item)}
            >
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={[styles.productImage, isOutOfStock && { opacity: 0.5 }]}
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
                    <Text style={[styles.productName, isOutOfStock && { color: '#8D99AE' }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#D90429', fontWeight: 'bold' }}>
                        {item.brand}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#2B2D42', marginTop: 2 }}>
                        R$ {item.price?.toFixed(2).replace('.', ',')}
                    </Text>
                    <Text style={{ fontSize: 13, marginTop: 4, color: isOutOfStock ? '#D90429' : '#8D99AE' }}>
                        {isOutOfStock ? 'Esgotado' : `${item.quantity} un`}
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.miniControlButton}
                        onPress={() => (navigation as any).navigate("RegisterProduct", { barcode: item.barcode })}
                    >
                        <Ionicons name="create-outline" size={16} color="#2B2D42" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.miniControlButton}
                        onPress={() => handleDelete(item.id, item.name)}
                    >
                        <Ionicons name="trash-outline" size={16} color="#D90429" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: '#2B2D42' }]}>
            <StatusBar style="light" backgroundColor="#2B2D42" translucent={true} />
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#2B2D42' }}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{category}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("RegisterProduct" as never)}>
                        <Ionicons name="add-circle" size={32} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#FFF" />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Pesquisar..."
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
            </SafeAreaView>
            
            <View style={styles.listArea}>
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator size="large" color="#D90429" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="cube-outline" size={60} color="#8D99AE" />
                                <Text style={styles.emptyText}>
                                    {search ? "Nenhum resultado" : "Nenhum produto nesta categoria"}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="#2B2D42" />
                        </TouchableOpacity>

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                        >
                            {selectedProduct?.imageUrl ? (
                                <Image
                                    source={{ uri: selectedProduct.imageUrl }}
                                    style={styles.detailImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.detailPlaceholder}>
                                    <Ionicons name="image-outline" size={80} color="#8D99AE" />
                                </View>
                            )}

                            <View style={styles.detailInfo}>
                                <Text style={styles.detailName}>{selectedProduct?.name}</Text>
                                <Text style={styles.detailBrand}>{selectedProduct?.brand}</Text>
                                
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Código de Barras (EAN)</Text>
                                    <Text style={styles.detailValue}>{selectedProduct?.barcode}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Estoque Atual</Text>
                                    <Text style={[styles.detailValue, selectedProduct?.quantity === 0 && { color: '#D90429' }]}>
                                        {selectedProduct?.quantity} unidades
                                    </Text>
                                </View>

                                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                                    <Text style={styles.detailLabel}>Preço de Venda</Text>
                                    <Text style={styles.detailValue}>
                                        R$ {selectedProduct?.price?.toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>

                                <View style={styles.modalQuantityControls}>
                                    <TouchableOpacity
                                        style={styles.modalControlButton}
                                        onPress={() => setTempQuantity(prev => Math.max(0, prev - 1))}
                                    >
                                        <Ionicons name="remove" size={30} color="#2B2D42" />
                                    </TouchableOpacity>

                                    <TextInput
                                        style={styles.modalStockValue}
                                        value={tempQuantity.toString()}
                                        onChangeText={(text) => setTempQuantity(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                                        keyboardType="numeric"
                                        selectTextOnFocus
                                    />

                                    <TouchableOpacity
                                        style={styles.modalControlButton}
                                        onPress={() => setTempQuantity(prev => prev + 1)}
                                    >
                                        <Ionicons name="add" size={30} color="#2B2D42" />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity 
                                    style={styles.confirmButton}
                                    onPress={() => handleQuantityAction('add')}
                                >
                                    <Text style={styles.confirmButtonText}>Adicionar ao Estoque</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={[styles.confirmButton, { backgroundColor: '#2B2D42', marginTop: 12 }]}
                                    onPress={() => handleQuantityAction('withdraw')}
                                >
                                    <Text style={styles.confirmButtonText}>Vendido / Retirar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
