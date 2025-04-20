// navigation/navigation.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "../screens/Login";
import Home from "../screens/Home";
import Dashboard from "../screens/Dashboard";
import Logs from "../screens/Logs";
import Results from "../screens/Results";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
        {/*
        <Stack.Screen name="Logs" component={Logs} />
        <Stack.Screen name="Results" component={Results} />  */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
