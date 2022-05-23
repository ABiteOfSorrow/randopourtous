import React from "react";
import {
  Avatar,
  VStack,
  Center,
  Heading,
  Box,
  Button,
  Text,
  Flex,
  Stack,
} from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";
import backendConfig from '../backend.config.json';
import { connect } from "react-redux";

const backendAdress = backendConfig.address;


function Detail(props) {

  var rando = props.route.params.e
  var date = new Date(rando.date)

  //***** formatage de la date *****
  /****** rajoute d'un 0 si minute<10 */
  var minutes = date.getMinutes() < 10 ? '0' : ''

  /****** mise au format dd/mm/yy */
  var day = date.toLocaleDateString('fr').split('/')
  var newDay = day[1] + '/' + day[0] + '/' + day[2]


  //let dateFormat= rando.date.toLocaleDateString('fr') + ' ' + rando.date.getHours() + ':' +rando.date.getMinutes()
  let dateFormat = newDay + ' ' + date.getHours() + 'h' + minutes + date.getMinutes()

  //****** fonction de recherche d'un utilisateur */

  var searchUser = async function (user) {


    // si la personne connectée est l'organisateur, alors on affiche MyProfil
    if (props.user._id === user) {
      props.navigation.navigate('Profil')
    } else {

      // si la personne connectée n'est pas l'organisateur alors on affiche OtherProfile
      let result = await fetch(backendAdress + '/users/user/' + user)
      let response = await result.json()
      props.navigation.navigate('Otherprofile', { user: response.user })
    }

  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <HamburgerMenu navigation={props.navigation} />

        <VStack space={2} alignItems="center">
          <Heading size="xl">{rando.name}</Heading>
          <Heading size="lg">{dateFormat} / {rando.departure.nom}</Heading>
          <MapView style={styles.map}
            initialRegion={{
              latitude: rando.coordinate.latitude,
              longitude: rando.coordinate.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}>
            <Marker pinColor='green'
              coordinate={{
                latitude: rando.coordinate.latitude,
                longitude: rando.coordinate.longitude,
              }}
              title={rando.name} />



          </MapView>
          <Heading size="lg">Organisé par: </Heading>
          <Button w={"80%"} h={10} bg="#bbbbbb" onPress={() => searchUser(rando.userId)}>
            {rando.organisator}
          </Button>
          <Heading size="lg">Nombre de participant: {rando.users.length}/{rando.maxUsers} </Heading>
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
        <Button w="42%" h={10} bg="#78E08F" onPress={() => props.navigation.navigate('Chat', { rando })}>
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
  map: {
    width: '90%',
    marginTop: 10,
    height: 200,
  },
});


function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, null)(Detail)


