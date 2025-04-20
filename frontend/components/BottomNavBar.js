import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BottomNavBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        }}
        style={[
          styles.navButton,
          currentRoute === "Dashboard" && styles.activeButton,
        ]}
      >
        <Image
          source={require("../assets/home.png")}
          style={[
            styles.navIcon,
            currentRoute === "Dashboard" && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Results" }],
          });
        }}
        style={[
          styles.navButton,
          currentRoute === "Results" && styles.activeButton,
        ]}
      >
        <Image
          source={require("../assets/camera.png")}
          style={[
            styles.navIcon,
            currentRoute === "Results" && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Logs" }],
          });
        }}
        style={[
          styles.navButton,
          currentRoute === "Logs" && styles.activeButton,
        ]}
      >
        <Image
          source={require("../assets/logs.png")}
          style={[styles.navIcon, currentRoute === "Logs" && styles.activeIcon]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Profile" }],
          });
        }}
        style={[
          styles.navButton,
          currentRoute === "Profile" && styles.activeButton,
        ]}
      >
        <Image
          source={require("../assets/user.png")}
          style={[
            styles.navIcon,
            currentRoute === "Profile" && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1f1f1f",
    paddingVertical: 5,
    borderRadius: 30,
    marginHorizontal: 4,
    marginBottom: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  activeButton: {
    backgroundColor: "#F28322",
  },
  activeIcon: {
    tintColor: "#000",
  },
});
