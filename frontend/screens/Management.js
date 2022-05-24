import React from "react";
import { Avatar, HStack, VStack, Center, Heading, Box, Button, Text, Flex, Stack } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";

function Management(props) {
  console.log(props.user)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <HStack justifyContent="space-between" mb={4}>
          <HamburgerMenu navigation={props.navigation} />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>

        <VStack space={2} alignItems="center" mb={5}>
          <Heading size="lg">Gestion Rando</Heading>
          <Box w={"75%"} mb={0} borderRadius="15" bg="#079992">
            <Text color="white" fontSize="md" textAlign="center">
              8 / 15 Participants
            </Text>
          </Box>
        </VStack>
        {/* contents container for Demandes de partipation */}
        <VStack space={2} mb={20} alignItems="center">
          <Heading size="lg">Demandes de partipation </Heading>
          {/* User profil box */}
          <Box w={"90%"} h={110} bg={"#bbbbbb"} borderRadius={15} p={0} justifyContent={"center"} alignItems={"center"}>
            <Center w={"95%"} h={62} p={0} mb={2} bg="#079992" rounded="lg" shadow={8} display="flex" flexDirection="row" justifyContent="space-around">
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
              <Button size="xs" backgroundColor="#BBBBBB" alignSelf="center" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="xs">
                  Voir Profil
                </Text>
              </Button>
            </Center>
            {/* Accepter & Refuser buttons */}
            <HStack>
              <Button w={"30%"} h={25} p={0} mr={10} borderRadius={15} bg={"#079992"}>
                {" "}
                Accepter{" "}
              </Button>
              <Button w={"30%"} h={25} p={0} borderRadius={15} bg={"#E55039"}>
                {" "}
                Refuser{" "}
              </Button>
            </HStack>
          </Box>
        </VStack>

        {/* contents container for Liste des participants */}
        <VStack space={2} mb={2} alignItems="center">
          <Heading size="lg">Liste des participants </Heading>
          {/* User profil box */}
          <Box w={"90%"} h={110} bg={"#bbbbbb"} borderRadius={15} p={0} justifyContent={"center"} alignItems={"center"}>
            <Center w={"95%"} h={62} p={0} mb={2} bg="#079992" rounded="lg" shadow={8} display="flex" flexDirection="row" justifyContent="space-around">
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
              <Button size="xs" backgroundColor="#BBBBBB" alignSelf="center" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="xs">
                  Voir Profil
                </Text>
              </Button>
            </Center>
            {/* Ban buttons */}
            <Button w={"30%"} h={25} p={0} borderRadius={15} bg={"#E55039"}>
              {" "}
              Ban{" "}
            </Button>
          </Box>
        </VStack>
      </ScrollView>
      <Button w={"50%"} h={25} p={0} mb={3} mt={3} borderRadius={15} bg={"#E55039"} alignSelf={"center"} onPress={() => props.navigation.navigate("Chercher", {screen:'Resume', params:{user: props.user}  })}>
        <Text color="#ffffff">Terminer cette Rando</Text>
      </Button>
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

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(Management);
