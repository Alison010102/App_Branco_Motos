import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { styles } from "./styles";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CameraView, Camera } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { storage } from "../../config/storage";

const CATEGORIES = [
    "Filtro",
    "Kit tração",
    "Kit embreagem",
    "Rolamento",
    "Cabos"
];

const SUB_CATEGORIES: { [key: string]: string[] } = {
    "Cabos": [
        "Cabo do acelerador A",
        "Cabo do acelerador B",
        "Cabo da embreagem",
        "Cabo do velocímetro"
    ]
};

export default function RegisterProduct() {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as { barcode?: string } | undefined;
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);

    useEffect(() => {
        loadBrands();
        if (params?.barcode) {
            setBarcode(params.barcode);
            checkIfProductExists(params.barcode);
        }
    }, [params]);

    const loadBrands = async () => {
        const brands = await storage.getBrands();
        setAvailableBrands(brands);
    };

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getPermissions();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setShowCamera(false);
        setBarcode(data);
        checkIfProductExists(data);
    };

    const checkIfProductExists = async (code: string) => {
        if (!code) return;
        const products = await storage.getProducts();
        const existing = products.find(p => p.barcode === code);

        if (existing) {
            setName(existing.name);
            setBrand(existing.brand || "");
            setPrice(existing.price ? existing.price.toString() : "");
            
            // Check if it's a sub-category
            let foundMainCategory = existing.category;
            let foundSubCategory = "";
            
            for (const mainCat in SUB_CATEGORIES) {
                if (SUB_CATEGORIES[mainCat].includes(existing.category)) {
                    foundMainCategory = mainCat;
                    foundSubCategory = existing.category;
                    break;
                }
            }
            
            setCategory(foundMainCategory);
            setSubCategory(foundSubCategory);
            setQuantity(existing.quantity);
            if (existing.imageUrl) setImageUri(existing.imageUrl);
            Alert.alert("Produto encontrado", "Os dados foram preenchidos para edição.");
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        const finalCategory = category === "Cabos" ? subCategory : category;

        if (!name || !finalCategory || !barcode || !price || !brand) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const products = await storage.getProducts();
            const existingIndex = products.findIndex(p => p.barcode === barcode);
            const numericPrice = parseFloat(price.replace(',', '.'));

            if (existingIndex > -1) {
                const id = products[existingIndex].id;
                await storage.updateProduct(id, {
                    name,
                    brand,
                    price: numericPrice,
                    category: finalCategory,
                    quantity,
                    barcode,
                    imageUrl: imageUri || undefined
                });
                Alert.alert("Sucesso", "Produto atualizado com sucesso!");
            } else {
                await storage.saveProduct({
                    name,
                    brand,
                    price: numericPrice,
                    category: finalCategory,
                    quantity,
                    barcode,
                    imageUrl: imageUri || undefined
                });
                Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar o produto.");
        } finally {
            setLoading(false);
        }
    };

    const adjustQuantity = (amount: number) => {
        setQuantity(prev => Math.max(0, prev + amount));
    };

    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
                <TouchableOpacity style={styles.closeCameraButton} onPress={() => setShowCamera(false)}>
                    <Ionicons name="close" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { padding: 0, backgroundColor: '#2B2D42' }]}>
            <StatusBar style="light" backgroundColor="#2B2D42" translucent={true} />
            <SafeAreaView edges={['top']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Novo Item</Text>
                    <View style={{ width: 32 }} />
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.scanButton} onPress={() => {
                    setScanned(false);
                    setShowCamera(true);
                }}>
                    <Ionicons name="barcode-outline" size={24} color="#FFF" />
                    <Text style={styles.scanButtonText}>Escanear Código</Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Código de Barras</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="789..."
                        value={barcode}
                        onChangeText={setBarcode}
                        onBlur={() => checkIfProductExists(barcode)}
                        keyboardType="numeric"
                        placeholderTextColor="#8D99AE"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Produto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Óleo de Motor X"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#8D99AE"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Marca</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Honda, Yamaha..."
                        value={brand}
                        onChangeText={setBrand}
                        placeholderTextColor="#8D99AE"
                    />
                    {availableBrands.length > 0 && brand.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                            {availableBrands.filter(b => b.toLowerCase().includes(brand.toLowerCase())).map((b) => (
                                <TouchableOpacity
                                    key={b}
                                    style={[styles.categoryChip, { marginRight: 8, backgroundColor: '#EDF2F4' }]}
                                    onPress={() => setBrand(b)}
                                >
                                    <Text style={{ color: '#2B2D42' }}>{b}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Preço (R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0,00"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholderTextColor="#8D99AE"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantidade em Estoque</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => adjustQuantity(-1)}
                        >
                            <Ionicons name="remove" size={24} color="#2B2D42" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.quantityValue}
                            value={quantity.toString()}
                            onChangeText={(text) => setQuantity(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                            keyboardType="numeric"
                            selectTextOnFocus
                        />
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => adjustQuantity(1)}
                        >
                            <Ionicons name="add" size={24} color="#2B2D42" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.categoryContainer}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                                onPress={() => {
                                    setCategory(cat);
                                    setSubCategory("");
                                }}
                            >
                                <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {category === "Cabos" && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de Cabo</Text>
                        <View style={styles.categoryContainer}>
                            {SUB_CATEGORIES["Cabos"].map((sub) => (
                                <TouchableOpacity
                                    key={sub}
                                    style={[styles.categoryChip, subCategory === sub && styles.categoryChipSelected]}
                                    onPress={() => setSubCategory(sub)}
                                >
                                    <Text style={[styles.categoryText, subCategory === sub && styles.categoryTextSelected]}>
                                        {sub}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <Text style={styles.label}>Foto do Produto</Text>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.productImage} />
                    ) : (
                        <>
                            <Ionicons name="camera-outline" size={40} color="#8D99AE" />
                            <Text style={styles.imagePlaceholderText}>Toque para adicionar foto</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveButton, loading && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Confirmar Cadastro</Text>
                    )}
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}
