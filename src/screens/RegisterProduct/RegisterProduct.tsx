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
import { CameraView, Camera } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../config/storage";

const CATEGORIES = [
    "Óleos e lubrificantes",
    "Freios e suspensão",
    "Bateria e elétrica",
    "Filtros e peças mecânicas",
    "Acessórios"
];

export default function RegisterProduct() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const [barcode, setBarcode] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            setCategory(existing.category);
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
        if (!name || !category || !barcode) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const products = await storage.getProducts();
            const existingIndex = products.findIndex(p => p.barcode === barcode);

            if (existingIndex > -1) {
                const id = products[existingIndex].id;
                await storage.updateProduct(id, {
                    name,
                    category,
                    quantity,
                    barcode,
                    imageUrl: imageUri || undefined
                });
                Alert.alert("Sucesso", "Produto atualizado com sucesso!");
            } else {
                await storage.saveProduct({
                    name,
                    category,
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Novo Item</Text>

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
                    <Text style={styles.label}>Quantidade em Estoque</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => adjustQuantity(-1)}
                        >
                            <Ionicons name="remove" size={24} color="#2B2D42" />
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
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
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

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
        </KeyboardAvoidingView>
    );
}
