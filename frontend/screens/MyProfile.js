import React from "react";
import {
  Avatar,
  HStack,
  VStack,
  Center,
  Heading,
  Button,
  Text,
  Flex,
  Box,
} from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";

export default function MyProfile(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HamburgerMenu />

      <VStack justifyContent="center" alignItems="center">
        <Heading size="xl" mb={5}>
          Mon compte
        </Heading>
        <Text mb={10} fontSize="md">
          xX_JeanDu75_Xx
        </Text>

        <HStack justifyContent="center" alignItems="center" mb="10%">
          <VStack space={2} alignItems="center" mr={20}>
            <Avatar
              me="10"
              bg="amber.500"
              size="2xl"
              source={{
                uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
            ></Avatar>
            <Text fontSize="md">30 ans</Text>
            <Text fontSize="md">666 amis</Text>
          </VStack>

          <VStack space={2} alignItems="center">
            <Text fontSize="md">Jean-Luc</Text>
            <Text fontSize="md">Mélenchon</Text>
          </VStack>
        </HStack>

        <Flex direction="row" alignSelf="center" mb={5}>
          <AntDesign name="star" size={30} color="#FFFF00" />
          <AntDesign name="star" size={30} color="#FFFF00" />
          <AntDesign name="star" size={30} color="#FFFF00" />
          <AntDesign name="star" size={30} color="#FFFF00" />
          <AntDesign name="star" size={30} color="#FFFF00" />
        </Flex>
        <Text fontSize="xl" mb="10%">
          Note moyenne des randos: 0.5
        </Text>

        <Button mt="2" w="80%" bg="#78E08F">
          Voir mes randos
        </Button>
        <Button mt="2" w="80%" bg="#BBBBBB">
          Voir mes amis
        </Button>
        <Button mt="2" w="80%" bg="#BBBBBB">
          Editer mes informations
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
