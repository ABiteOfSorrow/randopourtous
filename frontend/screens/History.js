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
  const [colorBtnAdmin, setColorBtnAdmin] = useState(false)


  //Initialisation de toutes les randos de l'utilisateur à l'ouverture de composant et dès le changement de la variable d'état "tracksFilter"
  useEffect(() => {

    console.log(colorBtnAdmin)

    //Récupérations des randos dans la BDD
    async function loadData() {

      var rawResponse = await fetch(backendAdress + '/get-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props.user)
      });

      //console.log("props.user.tracks", props.user.tracks)

      var response = await rawResponse.json();
      //console.log("response ", tracksFilterAdmin)
      //console.log("response ", tracksFilter)

      //Filtrage dynamique
      if(tracksFilterAdmin){
        setColorBtnAdmin(true)
        setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter && track.userId === props.user._id))
       

      }else{
        setColorBtnAdmin(false)
        setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter))
      }

    }
    if (isFocused) {
      loadData()
    }

  }, [tracksFilter, tracksFilterAdmin, isFocused]);

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
      var colorBg = "#38ADA9"
      var colorText = "white"
      var etat = "En cours..."
    }
    //Modèle des box adaptatif à l'affichage des rando selon leurs infos
    return( 
      <Box key={i} w={"80%"} alignSelf="center" bg={colorBg} p={3} style={styles.allBox} shadow={2} mb={2}>
      <Box
        alignSelf="center"
        _text={{
          fontSize: "xl",
          fontWeight: "bold",
          color: colorText,
          letterSpacing: "lg",
        }}
      >
        {rando.name}
      </Box>
      <Box style={{ flex:1, flexDirection:"row", justifyContent:"space-between" }}>
        <Box
          alignSelf="center"
          _text={{
            fontSize: "lg",
            fontWeight: "medium",
            color: colorText,
            letterSpacing: "lg",
          }}
        >
          {rando.departure.nom}
        </Box>
        <Box
          alignSelf="center"
          _text={{
            fontSize: "md",
            fontWeight: "medium",
            color: colorText,
            letterSpacing: "lg",
          }}
        >
          {etat}
        </Box>
      </Box>
      <Button w={100} h={8} p={0} mt={2} mr={2} style={{ backgroundColor:"green", marginLeft:"65%" }} onPress={()=> props.navigation.navigate('Detail', {rando})}>
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                Voir
              </Text>
            </Button>
    </Box>
    );
  })

  //Affichage
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView h="80%">
        <HStack style={{ justifyContent: "space-between" }} mb={4}>
          <HamburgerMenu navigation={props.navigation} />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" style={{ borderColor: "#38ADA9" }} onPress={() => props.navigation.goBack()}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#38ADA9" }} >
              Retour
            </Text>
          </Button>
        </HStack>

        {/* Titre */}
        <VStack space={2} >
          <Heading size="md" textAlign="center" mb={4}>
            Mes randonnées
          </Heading>

          {/* Buttons Filter */}
          <Box style={ styles.menu} mx={"auto"} mb={2}>
            <Button w={90} h={8} p={0} mt={2} mr={2} style={{ borderColor: "#38ADA9" }} onPress={() => setTracksFilter(null)}>
              <Text fontSize="xs" style={{ color: "white", fontWeight: 'bold' }} >
                Toutes
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} mr={2} style={{ backgroundColor: "#38ADA9" }} onPress={() => setTracksFilter(true)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
                En cours
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} mr={2} bg="#bbb" style={{ backgroundColor: "#38ADA9" }} onPress={() => setTracksFilter(false)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
                Achevées
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} style={tracksFilterAdmin ? {backgroundColor: "#bbb"} : {backgroundColor: "#FFFFF"}} onPress={() => {setTracksFilterAdmin(!tracksFilterAdmin)}} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
                Admin
              </Text>
            </Button>
          </Box>
        </VStack>


        {/* History contents Line */}
        {sourceCard}


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
  allBox: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    color: '#000',
    borderRadius: 15,
  },
  menu: {
    justifyContent: "center",
    flexDirection: "row",
    display: "flex",
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    paddingBottom: 10,
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
