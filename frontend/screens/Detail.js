import React, { useEffect, useState } from "react";
import { Avatar, VStack, Center, Heading, Box, Button, Text, Flex, Stack, } from "native-base";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";
import backendConfig from '../backend.config.json';
import { connect } from "react-redux";

const backendAdress = backendConfig.address;


function Detail(props) {

  const [isParticipant, setIsParticipant] = useState(false)
  const [listUsers, setListUsers] = useState([])
  const [rando, setRando] = useState(props.route.params.rando)
  // console.log(props.rando)

  //let rando=props.route.params.rando
  useEffect(() => {

    async function searchUsersTrack() {
      try {
        // on initialise le composant en récupérant la randonnées dans la BDD avec la liste des participants à jour
        let rawresponse = await fetch(backendAdress + '/search-user-track?userid=' + props.user._id + '&trackid=' + props.route.params.rando._id);
        let response = await rawresponse.json()
        setRando(response.rando)

        if (response) {

          for (let userItem of response.rando.users) {

            let userRawResponse = await fetch(backendAdress + '/users/user/' + userItem)
            if (userRawResponse.ok) {
              let userResponse = await userRawResponse.json()

              setListUsers((state) => [...state, userResponse.user])
              response.rando.users.find((item) => item === props.user._id) ? setIsParticipant(true) : setIsParticipant(false)
            } else {
              console.log('Erreur récupération utilisateur')
              Alert.alert('Erreur', 'Erreur récupération utilisateur. Serveur pas connecté.')
            }

          }
        }

      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des données')
        console.log(error)
      }
    }
    searchUsersTrack()

  }, [props.route.params.rando])

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
      props.navigation.navigate('OtherProfile', { user: response.user })
    }
  }


  let userStars = props.user.averageRating
  //Rando rating stars display




  var participateClick = async function (dataRando) {
    // console.log(props.user._id)
    //*** Ajout de l'id du randonneur dans la base de donnée de la radonnée */
    let rawresponse = await fetch(backendAdress + '/add-user-track?userid=' + props.user._id + '&trackid=' + rando._id);
    props.navigation.navigate( 'Randos', {screen:'Chat',params: {rando} } )
  }

  let listUsersDisplay = listUsers.map((item, i) => {
    let tabGlobalRating = [];
    for (let j = 0; j < 5; j++) {
      let color = "black";
      if (j < item.averageRating) {
        color = "#f1c40f";
      }
      tabGlobalRating.push(<AntDesign key={j} color={color} name="star" size={24} />);
    }



    return (<Center
      key={i}
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
          {item.username}
        </Heading>
        <Flex direction="row" alignSelf="center">
          {tabGlobalRating}
        </Flex>
      </VStack>
      <Button
        size="xs"
        backgroundColor="#BBBBBB"
        alignSelf="center"
        onPress={() => searchUser(item._id)}>
        <Text style={styles.contentText} fontSize="xs">
          Voir Profil
        </Text>
      </Button>
    </Center>)
  })


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView>
        <HamburgerMenu navigation={props.navigation} />
        <VStack space={2} alignItems="center">
          <VStack style={{ width:"100%" ,borderBottomWidth: 1, borderColor: '#CCCCCC', alignItems:"center", paddingBottom:"1.5%",}}>
          <Heading size="xl">{rando.name}</Heading>
          <Heading size="lg"> Le {dateFormat.replace(' ', ' à ')} à {rando.departure.nom}</Heading>
          </VStack>
          <MapView style={styles.map}
            initialRegion={{
              latitude: rando.coordinate.latitude,
              longitude: rando.coordinate.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            title={rando.name}>

            <Marker

              pinColor='green'
              coordinate={{
                latitude: rando.coordinate.latitude,
                longitude: rando.coordinate.longitude,
              }} />
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
          {listUsersDisplay}
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
        <Button w="42%" h={10} bg="#78E08F" onPress={() => participateClick(rando)}>
          {isParticipant === true ? "Aller au Chat" : "Pariticper"}
        </Button>
      </Stack>
    </SafeAreaView >
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


