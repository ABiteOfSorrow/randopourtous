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
  useEffect(() => {

    console.log(tracksFilterAdmin)

    //Récupérations des randos dans la BDD
    async function loadData() {
      //****** si on vient du screen OtherProfile, on a le param props.params.user sinon on vient du screen MyProfile donc c'est l'user du store */
     
      let user = props.route.params?props.route.params:props.user

      var rawResponse = await fetch(backendAdress + '/get-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      var response = await rawResponse.json();

      //Filtrage dynamique
      if(tracksFilterAdmin){
        setAllTracks(response.fullInfoTracks.filter(track => track.finished !== tracksFilter && track.userId == props.user._id))
        console.log(response.fullInfoTracks[4].userId)
        console.log(props.user._id)
      }else{
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
      var colorBg = "#079992"
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
      <Button w={100} h={8} p={0} mt={2} mr={2} style={{ backgroundColor:"green", marginLeft:"65%" }} onPress={()=> rando.finished===false?props.navigation.navigate('Detail', {rando}):props.navigation.navigate('Resume', {rando})}>
              <Text fontSize="xs" style={{ fontWeight: 'bold', color:"white" }} >
                Voir
              </Text>
            </Button>
    </Box>
    );
  })

  //Affichage
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", heigth:"100%" }}>
      <ScrollView>
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
            {!props.route.params?<Text>Mes Randonnées</Text>: <Text>Randonnées de {props.route.params.name}</Text>}
          </Heading>

          {/* Buttons Filter */}
          <Box style={ styles.menu} mx={"auto"} mb={2}>
            <Button w={90} h={8} p={0} mt={2} mr={2} style={tracksFilter === null ? {backgroundColor: "#78E08F"} : {backgroundColor: "grey"}} onPress={() => setTracksFilter(null)}>
              <Text fontSize="xs" style={{ color: "white", fontWeight: 'bold' }} >
                Toutes
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} mr={2} style={tracksFilter === true ? {backgroundColor: "#78E08F"} : {backgroundColor: "grey"}} onPress={() => setTracksFilter(true)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
                En cours
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} mr={2} bg="#bbb" style={tracksFilter === false ? {backgroundColor: "#78E08F"} : {backgroundColor: "grey"}} onPress={() => setTracksFilter(false)} >
              <Text fontSize="xs" style={{ fontWeight: 'bold', color: "white" }} >
                Achevées
              </Text>
            </Button>
            <Button w={90} h={8} p={0} mt={2} style={tracksFilterAdmin ? {backgroundColor: "#78E08F"} : {backgroundColor: "grey"}} onPress={() => {setTracksFilterAdmin(!tracksFilterAdmin)}} >
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
