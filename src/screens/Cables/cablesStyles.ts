import { StyleSheet } from "react-native";

export const cablesStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B2D42',
    },
    listArea: {
        flex: 1,
        backgroundColor: '#EDF2F4',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: -35,
        paddingTop: 10,
    },
    header: {
        backgroundColor: '#2B2D42',
        paddingHorizontal: 20,
        paddingBottom: 50, // Increased for overlap
        paddingTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginTop: 15,
        height: 40,
    },
    searchBar: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        marginLeft: 8,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 15,
    },
    categoryButton: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        width: '48.5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF1F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 14,
        color: '#2B2D42',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
