import React from "react";
import {
  Avatar,
  HStack,
  VStack,
  Center,
  Heading,
  Menu,
  Box,
  HamburgerIcon,
  Divider,
  Button,
  Text,
  Flex,
  Spacer,
  Stack,
  Switch,
} from "native-base";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "./HamburgerMenu";

function List() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
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
        {/* List Body */}
        <VStack space={2} alignItems="center">
          <Heading size="lg" mb={5}>
            Liste des Randonnées
          </Heading>
          {/* Switch Line */}
          <Box display="flex" flexDirection="row" alignItems="center" mb={5}>
            <Switch offTrackColor="#C4C4C4" onTrackColor="#78E08F" mr={4} />
            <Heading size="md">Vue carte</Heading>
          </Box>
        </VStack>
        <VStack space={2} alignItems="center">
          {/* Journey List */}
          <Center
            w={350}
            h={62}
            p={0}
            mb={2}
            bg="#FAFAFA"
            rounded="lg"
            shadow={8}
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <VStack space={2} alignItems="center">
              <Heading size="md">Rando 1</Heading>
              <Text fontSize="sm" bold>
                Sportif
              </Text>
            </VStack>
            <VStack space={2} alignItems="flex-start">
              <Heading size="md">Vincennes</Heading>
              <Text fontSize="sm" bold>
                12 particpants
              </Text>
            </VStack>
            <Button
              size="md"
              backgroundColor="#78E08F"
              alignSelf="center"
              onPress={() => console.log("I'm Pressed")}
            >
              <Text style={styles.contentText} fontSize="md">
                Voir
              </Text>
            </Button>
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
});

export default List;
