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
} from "native-base";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "./HamburgerMenu";

// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";

function Detail() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <HamburgerMenu />
      <ScrollView>
        <VStack space={2} alignItems="center">
          <Heading size="xl">Rando 1</Heading>
          <Heading size="lg">Data / Lieu</Heading>
          <Box w="250" h="200" bg="#BBBBBB">
            Map
          </Box>
          <Heading size="lg">Organisé par: </Heading>
          <Button 
            w={80}
            h={10}
            bg="#bbbbbb">
            Toto1: Voir profil
          </Button>
          <Heading size="lg">Nombre de participant: 2/14 </Heading>
        </VStack>
        <VStack space={2} alignItems="center">
          <Heading size="lg">Liste des participants: </Heading>
          {/* User profil box */}
          <Center
            w={80}
            h={20}
            bg="#079992"
            rounded="lg"
            shadow={3}
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
          <Center
            w={80}
            h={20}
            bg="#079992"
            rounded="lg"
            shadow={3}
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
          <Center
            w={80}
            h={20}
            bg="#079992"
            rounded="lg"
            shadow={3}
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
      <Stack
        mb="20"
        mt="1.5"
        direction={{
          base: "row",
          md: "row",
        }}
        space={5}
        mx={{
          base: "auto",
          md: "0",
        }}
      >
        <Button w={170} h={10} variant="outline" borderColor="#38ADA9">
          <Text color="#38ADA9">Retour</Text>
        </Button>
        <Button w={170} h={10} bg="#78E08F">
          Participer
        </Button>
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
});

// map
// Organisé par:
// Toto1: Voir profil
// Nombre de participant: 2/14
// Liste des participants:

// 프로필

// 리턴버튼 참여
// <div class="row">
// <img class="avatar" src="avatar-3.jpg">
// <div>
//     <h6>Adam Keval</h6>
//     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae unde vel magni possimus libero, alias suscipit nobis officia accusantium. Laborum ipsam accusamus iusto deserunt mollitia. Repudiandae alias sequi nobis ipsum.</p>
// </div>
// <img class="trash" src="trash.png">
// </div>
export default Detail;
