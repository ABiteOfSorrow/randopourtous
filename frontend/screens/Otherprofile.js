import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button } from "native-base";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfile(props) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Sign up page</Text>
      <Button onPress={() => props.navigation.navigate("Home")}>Go home</Button>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
