import React from "react";
import { Avatar, HStack, VStack, Center, Heading, Box, Button, Text, Flex, Stack } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";

function Resume() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>

        <HStack justifyContent="space-between" mb={4}>
          <HamburgerMenu />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>

        <Button w={"80%"} size="md" backgroundColor="#E55039" alignSelf="center" mb={10} onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="md">
                Nom de la Rando
                </Text>
              </Button>
        {/* contents container for Demandes de partipation */}
        <VStack space={2} mb={20} alignItems="center">
          <Heading mb={10} size="md">À: Lieu de la Rando </Heading>
          <Heading size="md">Historique des photos partagées </Heading>
        </VStack>





        <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" mb={10} onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="md">
                Partager des photos
                </Text>
              </Button>



        <VStack space={5} alignItems="flex-start">
                <Flex direction="row" alignSelf="center">
                <Heading mr={5} size="md">Note globale</Heading>
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
                <Flex direction="row" alignSelf="center">
                <Heading mr={5} size="md">Paysage</Heading>
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
                <Flex direction="row" alignSelf="center">
                <Heading mr={5} size="md">Ambiance</Heading>
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
                <Flex direction="row" alignSelf="center">
                <Heading mr={5} size="md">Difficulté</Heading>
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
              </VStack>


      {/* To prevent leaving the content area */}
      <Box w="100%" h="8.5%" alignSelf="center" bg="#fff" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
  map: {
    width: "90%",
    marginTop: 10,
    height: 200,
  },
});

export default Resume;
