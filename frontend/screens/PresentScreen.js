import React from "react";
import { Button } from "native-base";
import { Text,Image,View } from "react-native";
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
       <Image
        style={{ width: 260, height: 101, marginBottom: '20%'}}
        source={require('../assets/logo_large.png')}
      />

      <Text style={{ fontSize: 20, marginBottom: 20 }}>Bienvenue !</Text>

      <Button
        style={{backgroundColor: '#78E08F'}}
        shadow="9" 
        onPress={() => props.navigation.replace('SignUp')}>
        Suivant
      </Button>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
