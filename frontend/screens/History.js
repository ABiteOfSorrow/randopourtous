import React, { useEffect, useState } from "react";
import { HStack, VStack, Heading, Box, Button, Text, Alert } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  let user = props.route.params ? props.route.params : props.user

  useEffect(() => {

    //console.log(tracksFilterAdmin)

    //Récupérations des randos dans la BDD
    async function loadData() {
      //****** si on vient du screen OtherProfile, on a le param props.params.user sinon on vient du screen MyProfile donc c'est l'user du store */

      try {
        var rawResponse = await fetch(backendAdress + '/get-tracks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });



        //console.log("props.user.tracks", props.user.tracks)

        var response = await rawResponse.json();

        //Filtrage dynamique
        if (tracksFilterAdmin) {
          setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter && track.userId == props.user._id))

        } else {
          setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter))
        }
      } catch (e) {
        Alert.alert('Erreur...', 'Une erreur est survenue lors de la récupération des données.')
        console.log(e);
      }
    }
    if (isFocused) {
      loadData()
    }

  }, [tracksFilter, tracksFilterAdmin, isFocused, props.route.params]);


  var sourceCard = allTracks.map((rando, i) => {

    //Condition qui adapte la couleur et le status des cartes selon les randos
    if (rando.finished == true) {
      var colorBg = "#ededed"
      var colorText = "black"
      var etat = "Achevée"
    }
    else {
      var colorBg = "#FFFFFF"
      var colorText = "black"
      var etat = "En cours..."
    }
    //Modèle des box adaptatif à l'affichage des rando selon leurs infos
    return (
      <Box key={i} w={"90%"} alignSelf="center" bg={colorBg} p={2} style={styles.allBox} shadow={4} mb={2}>
        <Box
          alignSelf="center"
          _text={{
            fontSize: "lg",
            color: colorText,
            letterSpacing: "lg",
          }}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          w='100%'
        >
          {rando.name.length > 15 ? rando.name.slice(0, 15) + '...' : rando.name}
          <Button w={'25%'} h={8} p={0} mt={2} mr={2} shadow="9" style={{ backgroundColor: "#78E08F", }} onPress={() => rando.finished === false ? props.navigation.navigate('BottomMenuTabs', { screen: 'Randos', params: { screen: 'Detail', params:{ rando }, initial: false}}) : props.navigation.navigate('Chercher', { screen: 'Resume', params: { rando }, initial: false })}>
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              Voir
            </Text>
          </Button>
        </Box>
        <Box style={{ margintTop: 2, width: '100%', flexDirection: "row", justifyContent: "space-between" }}>
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
      </Box>
    );
  })

  //Affichage
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <HStack style={{ justifyContent: "space-between", alignItems: 'center', borderBottomWidth: 1, borderColor: '#CCCCCC' }} mb={'1%'} >
        <Box w='20%' my={3} h={7} />
        <Heading fontSize={16} textAlign="center">
          {user._id === props.user._id ? (<Text>Mes Randonnées</Text>) : (<Text>Randonnées de {user.name}</Text>)}
        </Heading>
        <Box w='20%' />
      </HStack>
      <VStack space={2} >
        {/* Buttons Filter */}
        <Box style={styles.menu} mx={"auto"} mt={2} mb={2}>
          <Button w={'22%'} h={8} p={0} mr={2} shadow="7" bg={tracksFilter === null ? "#78E08F" : "grey"} onPress={() => setTracksFilter(null)}>
            <Text fontSize="xs" style={{ color: "white", fontWeight: 'bold' }} >
              Toutes
            </Text>
          </Button>
          <Button w={'22%'} h={8} p={0} mr={2} shadow="7" bg={tracksFilter === true ? "#78E08F" : "grey"} onPress={() => setTracksFilter(true)} >
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              En cours
            </Text>
          </Button>
          <Button w={'22%'} h={8} p={0} mr={2} shadow="7" bg={tracksFilter === false ? "#78E08F" : "grey"} onPress={() => setTracksFilter(false)} >
            <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
              Achevées
            </Text>
          </Button>
          <Button w={'22%'} h={8} p={0} shadow="7" style={tracksFilterAdmin ? { backgroundColor: "#78E08F" } : { backgroundColor: "grey" }} onPress={() => { setTracksFilterAdmin(!tracksFilterAdmin) }} >
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
    borderRadius: 5,


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
