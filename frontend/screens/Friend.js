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
import HamburgerMenu from "../components/HamburgerMenu";       

function Friend(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <HStack justifyContent="space-between" mb={4}>
          <HamburgerMenu />
          <Button
            w={90}
            h={8}
            p={0}
            mt={2}
            mr={2}
            variant="outline"
            borderColor="#38ADA9"
          >
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>
        <VStack space={2} alignItems="center">
          <Heading size="lg" mb={10}>
            Mes amis{" "}
          </Heading>
          {/* User profil box */}
          <Center
            w={350}
            h={62}
            p={0}
            mb={2}
            bg="#079992"
            rounded="lg"
            shadow={8}
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Avatar
              me="10"
              bg="amber.500"
              source={{
                uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
              }}
            ></Avatar>
            <VStack space={2} alignItems="flex-start">
              <Heading style={styles.contentText} size="xs">
                Toto
              </Heading>
              <Flex direction="row" alignSelf="center">
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
              </Flex>
            </VStack>
            <Button
              size="xs"
              backgroundColor="#BBBBBB"
              alignSelf="center"
              onPress={() => console.log("I'm Pressed")}
            >
              <Text style={styles.contentText} fontSize="xs">
                Voir Profil
              </Text>
            </Button>
            
          </Center>
        </VStack>
      </ScrollView>
      {/* To prevent leaving the content area */}
      <Box w={320} h={60} alignSelf="center" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
});

export default Friend;
