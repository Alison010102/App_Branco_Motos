import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../Home/home";
import RegisterProduct from "../screens/RegisterProduct/RegisterProduct";
import ProductList from "../screens/ProductList/ProductList";
import CablesSub from "../screens/Cables/CablesSub";

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="RegisterProduct" component={RegisterProduct} />
                <Stack.Screen name="ProductList" component={ProductList} />
                <Stack.Screen name="CablesSub" component={CablesSub} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
