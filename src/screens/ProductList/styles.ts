import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EDF2F4",
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#8D99AE",
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFF",
        flex: 1,
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginBottom: 15,
        flexDirection: 'row',
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    cardOutItem: {
        opacity: 0.8,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#EDF2F4',
    },
    imageGrayscale: {
        tintColor: 'gray',
        opacity: 0.6,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#EDF2F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2B2D42',
        marginBottom: 4,
    },
    outOfStockText: {
        color: '#D90429',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    productBarcode: {
        fontSize: 12,
        color: '#8D99AE',
    },
    stockControls: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    stockValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2B2D42',
        marginVertical: 4,
    },
    controlButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EDF2F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#8D99AE',
        marginTop: 10,
    },
});
