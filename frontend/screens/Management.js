import React, {useState} from "react";
import { Avatar, HStack, VStack, Center, Heading, Box, Button, Text, Flex, Stack } from "native-base";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";

import backendConfig from '../backend.config.json'
import { StatusBar } from "expo-status-bar";
const backendAdress = backendConfig.address

function Management(props) {
  //console.log("props.rando",props.route.params.params.rando.users.length)
  
  //******* Statu d'acceptation pour faker */
  const [acceptStatus, setAcceptStatus]=useState(false)

  async function handleSubmit() {

    let rando = props.route.params.params.rando
    //console.log(rando)
    try {
      var rawResponse = await fetch(backendAdress + '/finish-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rando)
      });
      if (!rawResponse.ok) {
        Alert.alert("Erreur", "Problème de connexion au serveur")
        return ;
      }
      //var response = await rawResponse.json();
      if (rawResponse.ok) {
        props.navigation.navigate("Chercher", { screen: 'Resume', params: { user: props.user, rando } });
      } else {
        Alert.alert("Erreur", "Problème de connexion au serveur")
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView style={{ flex:1 }}>
        <HStack justifyContent="space-between" mb={4} style={{ borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
          <HamburgerMenu navigation={props.navigation} />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>

        <VStack space={2} alignItems="center" mb={5}>
          <Heading size="lg">Gestion Rando</Heading>
          <Box w={"80%"} mb={0} borderRadius="10" bg="#079992" shadow="7" >
            <Text color="white" fontSize="md" textAlign="center">
              {props.route.params.params.rando.users.length} / {props.route.params.params.rando.maxUsers} Participants
            </Text>
          </Box>
        </VStack>
        {/* contents container for Demandes de partipation */}
        <VStack space={2} mb={20} alignItems="center">
          <Heading size="lg">Demandes de participation</Heading>
          {/* User profil box */}
          {acceptStatus===false? 
          <Box w={"90%"} h={110} bg={"#bbbbbb"} borderRadius={15} p={0} shadow="9" justifyContent={"center"} alignItems={"center"}>
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
                  Laura
                </Heading>
                <Flex direction="row" alignSelf="center">
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
              </VStack>
              <Button size="xs" backgroundColor="#BBBBBB" alignSelf="center" shadow="9" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="xs">
                  Voir Profil
                </Text>
              </Button>
            </Center>
            

            {/* Accepter & Refuser buttons */}
            <HStack>
              <Button w={"30%"} h={25} p={0} mr={10} borderRadius={15} bg={"#079992"} shadow="9" onPress={()=>  setAcceptStatus(true)} >
                {" "}
                Accepter{" "}
              </Button>
              <Button w={"30%"} h={25} p={0} borderRadius={15} bg={"#E55039"} shadow="6" >
                {" "}
                Refuser{" "}
              </Button>
            </HStack>
          </Box>
          :<Text></Text>}
        </VStack>

        {/* contents container for Liste des participants */}
        <VStack space={2} mb={2} alignItems="center">
          <Heading size="lg">Liste des participants </Heading>
          {/* User profil box */}
          
            {acceptStatus===true?          
          <Box w={"90%"} h={110} bg={"#bbbbbb"} borderRadius={15} p={0} shadow="5" justifyContent={"center"} alignItems={"center"}>
          <Center w={"95%"} h={62} p={0} mb={2} bg="#079992" rounded="lg" shadow={4} display="flex" flexDirection="row" justifyContent="space-around">
                     <Avatar
                       me="10"
                       bg="amber.500"
                       source={{
                         uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                       }}
                     ></Avatar>
                     <VStack space={2} alignItems="flex-start">
                       <Heading style={styles.contentText} size="xs">
                         Laura
                       </Heading>
                       <Flex direction="row" alignSelf="center">
                         <AntDesign name="star" size={24} color="yellow" />
                         <AntDesign name="star" size={24} color="yellow" />
                         <AntDesign name="star" size={24} color="yellow" />
                         <AntDesign name="star" size={24} color="yellow" />
                         <AntDesign name="star" size={24} color="yellow" />
                       </Flex>
                     </VStack>
                     <Button size="xs" backgroundColor="#BBBBBB" alignSelf="center" shadow="9" onPress={() => console.log("I'm Pressed")}>
                       <Text style={styles.contentText} fontSize="xs">
                         Voir Profil
                       </Text>
                     </Button>
                   </Center>
                   
       
                   {/* Accepter & Refuser buttons */}

           {/* Ban buttons */}
           <Button w={"30%"} ml='auto' mr='4%'  p={0} borderRadius={15} bg={"#E55039"} shadow="4" >
              Exclure
            </Button>

                 </Box>
            :<Text></Text>}

            
          <Box w={"90%"} h={110} bg={"#bbbbbb"} borderRadius={15} p={0} shadow="5" justifyContent={"center"} alignItems={"center"}>
            <Center w={"95%"} h={62} p={0} mb={2} bg="#079992" rounded="lg" shadow={4} display="flex" flexDirection="row" justifyContent="space-around">
              <Avatar
                me="10"
                bg="amber.500"
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Macaca_nigra_self-portrait_large.jpg/800px-Macaca_nigra_self-portrait_large.jpg",
                }}
              ></Avatar>
              <VStack space={2} alignItems="flex-start">
                <Heading style={styles.contentText} size="xs">
                  {props.user.username}
                </Heading>
                <Flex direction="row" alignSelf="center">
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                  <AntDesign name="star" size={24} color="yellow" />
                </Flex>
              </VStack>
              <Button size="xs" backgroundColor="#BBBBBB" alignSelf="center" shadow="9" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="xs">
                  Voir Profil
                </Text>
              </Button>
            </Center>
            {/* Ban buttons */}
            <Button w={"30%"} ml='auto' mr='4%'  p={0} borderRadius={15} bg={"#E55039"} shadow="4" >
              Exclure
            </Button>
          </Box>
        </VStack>
      </ScrollView>
      <Button w={"70%"} p={2} mb={2} mt={3} borderRadius={15} bg={"#E55039"} alignSelf={"center"} shadow="4" onPress={() => handleSubmit()}>
        <Text color="#ffffff">Terminer cette Rando</Text>
      </Button>
      {/* To prevent leaving the content area */}
      <StatusBar style="auto" />
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
