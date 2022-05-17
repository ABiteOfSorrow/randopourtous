import React from "react";
import { Button } from "native-base";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function PresentScreen(props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Bienvenue à RandoPourTous!</Text>

      <Button
<<<<<<< HEAD
        style={{backgroundColor: '#78E08F'}}
        onPress={() => props.navigation.navigate('SignUp')}>
=======
        style={{ backgroundColor: "#78E08F" }}
        onPress={() => props.navigation.navigate("Home")}
      >
>>>>>>> e7006e7f4bbf200ef78c959c7a73f675f6876192
        Suivant
      </Button>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
