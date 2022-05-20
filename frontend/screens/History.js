import React, {useEffect, useState} from "react";
import { HStack, VStack, Heading, Box, Button, Text } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { connect } from "react-redux";

import backendConfig from '../backend.config.json'
const backendAdress = backendConfig.address


function History(props) {

const [allTracks, setAllTracks] = useState([]);
const [tracksFilter, setTracksFilter] = useState()

//Initialisation de toutes les randos de l'utiilsateur à l'ouverture de composant et dès le changement de la variable d'état "tracksFilter"
useEffect(() => {
  async function loadData() {
    
    var rawResponse = await fetch(backendAdress + '/get-tracks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(props.user.tracks)
    });

    var response = await rawResponse.json();

    //Filtrage dynamique
    setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter))
  }
  loadData()
}, [tracksFilter]);

//Modèle des box adaptatif à l'affichage des rando selon leurs infos
  var sourceCard = allTracks.map((track,i) => {
    if(track.finished == true){
      var colorBg = "#bbbbbb"
      var colorText = "black"
      var etat = "Achevée"
    }
    else{
      var colorBg = "#78E08F"
      var colorText = "white"
      var etat = "En cours..." 
    }
    return( 
      <Box w={"80%"} alignSelf="center" bg={colorBg} p={3} style={{ borderRadius: 15 }} shadow={8} mb={2}>
      <Box
        alignSelf="center"
        _text={{
          fontSize: "xl",
          fontWeight: "bold",
          color: colorText,
          letterSpacing: "lg",
        }}
      >
        {track.name}
      </Box>
      <Box style={{ flex:1, flexDirection:"row", justifyContent:"space-between" }} >
        <Box
          alignSelf="center"
          _text={{
            fontSize: "lg",
            fontWeight: "medium",
            color: colorText,
            letterSpacing: "lg",
          }}
        >
          {track.departure.nom}
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
    </Box>
    );
    })

  //Affichage
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

        {/* Titre */}
        <VStack space={2} style={{ alignItems:"center" }} >
          <Heading size="md" mb={4}>
            Mes randonnées créées
          </Heading>

          {/* Buttons Filter */}
          <Box style={{ alignItems:"center", flexDirection:"row", display:"flex" }} mb={5}>
            <Button w={100} h={8} p={0} mt={2} mr={2} style={{ borderColor:"#38ADA9" }} onPress={() => setTracksFilter(null)}>
              <Text fontSize="xs" style={{ color:"white", fontWeight: 'bold' }} >
                Toutes
              </Text>
            </Button>
            <Button w={100} h={8} p={0} mt={2} mr={2} style={{ backgroundColor:"green" }} onPress={() => setTracksFilter(true)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                En cours
              </Text>
            </Button>
            <Button w={100} h={8} p={0} mt={2} mr={2} bg="#bbb" onPress={() => setTracksFilter(false)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                Achevées
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
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(
  mapStateToProps, 
  null)
  (History);
