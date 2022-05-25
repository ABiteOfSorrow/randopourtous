import React, { useEffect, useState } from "react";
import { HStack, VStack, Heading, Box, Button, Text } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { connect } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

import backendConfig from '../backend.config.json'
const backendAdress = backendConfig.address

function History(props) {
  //Vérifie si l'utilisateur est bien sur cette page
  const isFocused = useIsFocused();

  const [allTracks, setAllTracks] = useState([]);
  const [tracksFilter, setTracksFilter] = useState(null)
  const [tracksFilterAdmin, setTracksFilterAdmin] = useState(false)


  //Initialisation de toutes les randos de l'utilisateur à l'ouverture de composant et dès le changement de la variable d'état "tracksFilter"
  let user = props.route.params
  console.log('parames: ',props.route.params._id, 'iduserStore: ', props.user._id)
  console.log('parames: ',props.route.params.username, 'iduserStore: ', props.user.username)
  useEffect(() => {

    //console.log(tracksFilterAdmin)

    //Récupérations des randos dans la BDD
    async function loadData() {
      //****** si on vient du screen OtherProfile, on a le param props.params.user sinon on vient du screen MyProfile donc c'est l'user du store */


      var rawResponse = await fetch(backendAdress + '/get-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });



      //console.log("props.user.tracks", props.user.tracks)

      var response = await rawResponse.json();
      //console.log(response)
      //console.log("response ", tracksFilterAdmin)
      //console.log("response ", tracksFilter)

      //Filtrage dynamique
      if (tracksFilterAdmin) {
        setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter && track.userId == props.user._id))
        //console.log(response.fullInfoTracks[4].userId)
        //console.log(props.user._id)
      } else {
        setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter))
      }

    }
    if (isFocused) {
      loadData()
    }

  }, [tracksFilter, tracksFilterAdmin, isFocused, props.route.params]);

  //console.log("csl allTarcks ", allTracks)
  var sourceCard = allTracks.map((rando, i) => {
    //console.log(allTracks.length)
    //console.log('boucle sur i :' + i)

    //Condition qui adapte la couleur et le status des cartes selon les randos
    if (rando.finished == true) {
      var colorBg = "#bbbbbb"
      var colorText = "black"
      var etat = "Achevée"
    }
    else {
      var colorBg = "#079992"
      var colorText = "white"
      var etat = "En cours..."
    }
    //Modèle des box adaptatif à l'affichage des rando selon leurs infos
    return (
      <Box key={i} w={"90%"} alignSelf="center" bg={colorBg} p={2} style={styles.allBox} shadow={2} mb={2}>
        <Box
          alignSelf="center"
          _text={{
            fontSize: "lg",
            fontWeight: "medium",
            color: colorText,
            letterSpacing: "lg",
          }}
        >
          {rando.name}
        </Box>
        <Box style={{ width: '100%', flexDirection: "row", justifyContent: "space-between" }}>
          <Box
            alignSelf="center"
            _text={{
              fontSize: "lg",
              fontWeight: "light",
              color: colorText,
              letterSpacing: "lg",
            }}
          >
            {rando.departure.nom}
          </Box>
          <Box
            alignSelf="center"
            _text={{
              fontSize: "sm",
              fontWeight: "light",
              color: colorText,
              letterSpacing: "lg",
            }}
          >
            {etat}
          </Box>
        </Box>
        <Button w={100} h={8} p={0} mt={2} mr={2} shadow="9" style={{ backgroundColor: "green", marginLeft: "65%" }} onPress={() => rando.finished === false ? props.navigation.navigate('Detail', { rando }) : props.navigation.navigate('Chercher', { screen: 'Resume', params: { rando } })}>
          <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
            Voir
          </Text>
        </Button>
      </Box>
    );
  })

  //Affichage
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HStack style={{ justifyContent: "space-between" }} mb={'1%'}>
        <HamburgerMenu navigation={props.navigation} />

      </HStack>
      <Heading size="md" mt='2' textAlign="center" mb={'1%'}>
        {props.route.params._id===props.user._id ? (<Text>Mes Randonnées</Text>) : (<Text>Randonnées de {props.route.params.name}</Text>)}
      </Heading>
      <VStack space={2} >
        {/* Buttons Filter */}
        <Box style={styles.menu} mx={"auto"} mb={2}>
          <Button w={90} h={8} p={0} mt={2} mr={2} shadow="9" bg={tracksFilter === null ? "#78E08F" : "grey"} onPress={() => setTracksFilter(null)}>
            <Text fontSize="xs" style={{ color: "white", fontWeight: 'bold' }} >
              Toutes
            </Text>
          </Button>
          <Button w={90} h={8} p={0} mt={2} mr={2} shadow="9" style={tracksFilter === true ? { backgroundColor: "#78E08F" } : { backgroundColor: "grey" }} onPress={() => setTracksFilter(true)} >
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              En cours
            </Text>
          </Button>
          <Button w={90} h={8} p={0} mt={2} mr={2} bg="#bbb" shadow="9" style={tracksFilter === false ? { backgroundColor: "#78E08F" } : { backgroundColor: "grey" }} onPress={() => setTracksFilter(false)} >
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              Achevées
            </Text>
          </Button>
          <Button w={90} h={8} p={0} mt={2} shadow="9" style={tracksFilterAdmin ? { backgroundColor: "#78E08F" } : { backgroundColor: "grey" }} onPress={() => { setTracksFilterAdmin(!tracksFilterAdmin) }} >
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              Créées
            </Text>
          </Button>
        </Box>
      </VStack>
      <ScrollView style={{ width: '100%', flex: 1 }} >
        {/* Titre */}

        {/* History contents Line */}
        {sourceCard}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentText: {
    color: "white",
  },
  allBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    color: '#000',
    borderRadius: 15,
    alignItems: 'center'
  },
  menu: {
    justifyContent: "center",
    flexDirection: "row",
    display: "flex",
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    paddingBottom: "2.5%",
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch({ type: 'USER_LOGIN', user: user })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(History);
