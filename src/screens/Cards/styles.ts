import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        width: "45%",
        backgroundColor: "#EDF2F4",
        margin: 10,
        borderRadius: 10,
        alignItems: "center",
        padding: 10,
        shadowColor: "#D90429",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 10,
        resizeMode: "contain",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#2B2D42",
        textAlign: "center",
    },
});
