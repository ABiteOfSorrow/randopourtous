import React from "react";
import { HStack, VStack, Heading, Box, Button, Text } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";

function History(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView h="80%">
        <HStack style={{ justifyContent:"space-between" }} mb={4}>
          <HamburgerMenu />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" style={{ borderColor:"#38ADA9" }} onPress={() => props.navigation.goBack()}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#38ADA9" }} >
              Retour
            </Text>
          </Button>
        </HStack>
        {/* List Body */}

        <VStack space={2} style={{ alignItems:"center" }} >
          <Heading size="md" mb={4}>
            Mes randonnées créées
          </Heading>
          {/* Button Line */}
          <Box style={{ alignItems:"center", flexDirection:"row", display:"flex" }} mb={5}>
            <Button w={100} h={8} p={0} mt={2} mr={2} style={{ borderColor:"#38ADA9" }} >
              <Text fontSize="xs" style={{ color:"white", fontWeight: 'bold' }} >
                Toutes
              </Text>
            </Button>
            <Button w={100} h={8} p={0} mt={2} mr={2} style={{ backgroundColor:"green" }} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                En cours
              </Text>
            </Button>
            <Button w={100} h={8} p={0} mt={2} mr={2} bg="#bbb">
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                Achevées
              </Text>
            </Button>
          </Box>
        </VStack>

        {/* History contents Line (Proceeding)*/}
        <Box w={"80%"} alignSelf="center" bg="#78E08F" p={3} style={{ borderRadius: 15 }} shadow={8} mb={2}>
          <Box
            alignSelf="center"
            _text={{
              fontSize: "xl",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "lg",
            }}
          >
            Toto's Rando Pour Tous
          </Box>
          <Box style={{ flex:1, flexDirection:"row", justifyContent:"space-between" }} >
            <Box
              alignSelf="center"
              _text={{
                fontSize: "lg",
                fontWeight: "medium",
                color: "white",
                letterSpacing: "lg",
              }}
            >
              Vincennes
            </Box>
            <Box
              alignSelf="center"
              _text={{
                fontSize: "md",
                fontWeight: "medium",
                color: "white",
                letterSpacing: "lg",
              }}
            >
              En cours...
            </Box>
          </Box>
        </Box>
        {/* History contents Line (Finished)*/}
        <Box w={"80%"} alignSelf="center" bg="#bbbbbb" p={3} borderRadius="15" shadow={8} mb={2}>
          <Box
            alignSelf="center"
            _text={{
              fontSize: "xl",
              fontWeight: "bold",
              color: "black",
              letterSpacing: "lg",
            }}
          >
            Toto's Rando Pour Tous
          </Box>
          <Box style={{ flex:1, flexDirection:"row", justifyContent:"space-between" }} >
            <Box
              alignSelf="center"
              _text={{
                fontSize: "lg",
                fontWeight: "medium",
                color: "black",
                letterSpacing: "lg",
              }}
            >
              Paris
            </Box>
            <Box
              alignSelf="center"
              _text={{
                fontSize: "md",
                fontWeight: "medium",
                color: "black",
                letterSpacing: "lg",
              }}
            >
              Achevée
            </Box>
          </Box>
        </Box>
      </ScrollView>
      {/* To prevent leaving the content area */}
      <Box w={"100%"} h={60} alignSelf="center" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
});

export default History;
