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
//const [allTracksFiltered, setAllTracksFiltered] = useState([]);
const [tracksFilter, setTracksFilter] = useState()

//Initialisation de toutes les randos de l'utilisateur à l'ouverture de composant et dès le changement de la variable d'état "tracksFilter"
useEffect(() => {

  //Récupérations des randos dans la BDD
  async function loadData() {
    
    var rawResponse = await fetch(backendAdress + '/get-tracks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(props.user.tracks)
    });

    var response = await rawResponse.json();

    setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter))
    
    //Filtrage dynamique
    //setAllTracksFiltered(allTracks.filter(track => track.finished !== tracksFilter))
  }
  loadData()
}, [tracksFilter]);


  var sourceCard = allTracks.map((rando,i) => {
    //Condition qui adapte la couleur et le status des cartes selon les randos
    if(rando.finished == true){
      var colorBg = "#bbbbbb"
      var colorText = "black"
      var etat = "Achevée"
    }
    else{
      var colorBg = "#38ADA9"
      var colorText = "white"
      var etat = "En cours..." 
    }
    //Modèle des box adaptatif à l'affichage des rando selon leurs infos
    return( 
      <Box key={i} w={"80%"} alignSelf="center" bg={colorBg} p={3} style={styles.allInput} shadow={2} mb={2}>
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
        <HStack style={{ justifyContent:"space-between" }} mb={4}>
        <HamburgerMenu navigation={props.navigation} /> 
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
            <Button w={100} h={8} p={0} mt={2} mr={2} style={{ backgroundColor:"#38ADA9" }} onPress={() => setTracksFilter(true)} >
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
  allInput: {
    //backgroundColor: '#EEEEEE',
    borderWidth: 5,
    borderColor: '#CCCCCC',
    color: '#000',
    borderRadius: 15,
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
