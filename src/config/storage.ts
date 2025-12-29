import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@stock_app_products';

export interface Product {
    id: string;
    name: string;
    category: string;
    barcode: string;
    quantity: number;
    imageUrl?: string;
    createdAt: number;
}

export const storage = {
    async getProducts(): Promise<Product[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async saveProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> {
        try {
            const products = await this.getProducts();
            const newProduct: Product = {
                ...product,
                id: Date.now().toString(),
                createdAt: Date.now(),
            };
            const updatedProducts = [newProduct, ...products];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
            return newProduct;
        } catch (error) {
            console.error('Error saving product:', error);
            return null;
        }
    },

    async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
        try {
            const products = await this.getProducts();
            const updatedProducts = products.map(p =>
                p.id === id ? { ...p, ...updates } : p
            );
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    },

    async deleteProduct(id: string): Promise<boolean> {
        try {
            const products = await this.getProducts();
            const filteredProducts = products.filter(p => p.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    },

    async getProductsByCategory(category: string): Promise<Product[]> {
        const products = await this.getProducts();
        return products.filter(p => p.category === category);
    },

    async searchProducts(query: string): Promise<Product[]> {
        const products = await this.getProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.barcode.includes(query)
        );
    }
};
