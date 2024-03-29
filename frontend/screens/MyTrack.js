import React from "react";
import { Avatar, VStack, Center, Heading, Button, Text, Flex, Stack, } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";



function Detail(props) {




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <HamburgerMenu navigation={props.navigation} />

        <VStack space={2} alignItems="center">
          <Heading size="xl">Ma rando</Heading>
          <Heading size="lg">Data / Lieu </Heading>
          <MapView style={styles.map}></MapView>
          <Heading size="lg">Organisé par: </Heading>
          <Button w={"80%"} h={10} bg="#bbbbbb">
            Toto1: Voir profil
          </Button>
          <Heading size="lg">Nombre de participant: 2/14 </Heading>
        </VStack>
        <VStack space={2} alignItems="center">
          <Heading size="lg">Liste des participants: </Heading>
          {/* User profil box */}
          <Center
            w={"90%"}
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
      <Stack
        p={0}
        mb="5"
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
        <Button w="42%" h={10} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
          <Text color="#38ADA9">Retour</Text>
        </Button>

      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
  map: {
    width: '90%',
    marginTop: 10,
    height: 200,
  },
});

export default Detail;
