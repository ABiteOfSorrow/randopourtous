import React, { useState, useEffect } from "react";
import { HStack, VStack, Heading, Box, Button, Text, Flex } from "native-base";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
// import * as MediaLibrary from 'expo-media-library';
import { connect } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";
import CustomSlider from "../components/CustomSlider";
import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;


function Resume(props) {
  // console.log(props)
  const [paysageValue, setPaysageValue] = useState(0);
  const [ambianceValue, setAmbianceValue] = useState(0);
  const [difficultyValue, setDifficultyValue] = useState(0);
  const [image, setImage] = useState([]);
  const [userRating, setUserRating] = useState(0)
  const [disable, setDisable] = useState(false);

  let photos = [...image];

  let rando = props.route.params.rando
  // console.log(rando)
  // console.log(props)

  useEffect(() => {
    const ratingfetch = async () => {
        try {
          let defaultResume = {
            randoId : rando._id,
            userId : props.user._id
          }
          let randoRawResponse = await fetch(backendAdress + '/get-resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(defaultResume)
          })
          let response = await randoRawResponse.json()
          // console.log(response)
          if(response.averageNote > 0){
          setUserRating(response.averageNote)
          setPaysageValue(response.paysageNote)
          setAmbianceValue(response.ambianceNote)
          setDifficultyValue(response.difficultyNote)
          setImage(response.randoPhotos)
          setDisable(true)
        }
        } catch (e) {
          Alert.alert('Erreur...', 'Une erreur est survenue lors de la récupération des données.')
          console.log(e)
        }
      }
    ratingfetch()
 }, [])

  useEffect(() => {
    //Rando rating stars average and voter count
    let totalNote = 0;
    // var totalNote = props.globalCountRating;
    if (paysageValue && ambianceValue && difficultyValue) {
      totalNote += (paysageValue + ambianceValue + difficultyValue);
      // totalVote += 1;
    }
    totalNote = (totalNote / 3).toFixed(2)
    setUserRating(totalNote)
  }, [ambianceValue, paysageValue, difficultyValue])

  const pickImage = async () => {
    // Permissions request isn't necessary for launching the image library
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
      base64: true,
      exif: true
    });

    var data = new FormData();
    data.append("avatar", {
      uri: photo.uri,
      type: "image/jpeg",
      name: "image.jpg",
    },
    );
    data.append("rando", `${rando._id}`);
  
    console.log(data)

    // console.log(data)
    // Need to change IP when you start your APP (ipconfig)
    const rawResponse = await fetch(backendAdress + '/upload', {
      method: "post",
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      body: data

    });
    const response = await rawResponse.json();
    // console.log(response.photo.url)


    photos.push({ source: response.photo.url })
    setImage(photos);
    // console.log(image);
  }


  //Rando rating stars
  var PaysageRating = [];
  for (var i = 0; i < 5; i++) {
    var color = "black";
    if (i < paysageValue) {
      color = "#f1c40f";
    }
    //Rando rating stars click count
    let count = i + 1;
    PaysageRating.push(
      <AntDesign
        key={i}
        onPress={() => setPaysageValue(count)}
        color={color}
        name="star" size={24}
      />
    );
  }

  var AmbianceRating = [];
  for (var i = 0; i < 5; i++) {
    var color = "black";
    if (i < ambianceValue) {
      color = "#f1c40f";
    }
    //Rando rating stars click count
    let count = i + 1;
    AmbianceRating.push(
      <AntDesign
        key={i}
        onPress={() => setAmbianceValue(count)}
        color={color}
        name="star" size={24}
      />
    );
  }

  var DifficultyRating = [];
  for (var i = 0; i < 5; i++) {
    var color = "black";
    if (i < difficultyValue) {
      color = "#f1c40f";
    }
    //Rando rating stars click count
    let count = i + 1;
    DifficultyRating.push(
      <AntDesign
        key={i}
        onPress={() => setDifficultyValue(count)}
        color={color}
        name="star" size={24}
      />
    );
  }



  //Rando rating stars average math Round or toFixed : option
  //setAvgTotal((totalNote / 3).toFixed(2));
  // var avgTotal = Math.round(totalNote / 3);

  let tabGlobalRating = [];

  //Rando rating stars display
  for (var i = 0; i < 5; i++) {
    var color = "black";
    if (i < userRating) {
      color = "#f1c40f";
    }
      tabGlobalRating.push(<AntDesign key={i} color={color} name="star" size={24} />);
    }
  


  const submitRating = async () => {
    if (userRating > 0) {
        let ratings = {
          averageRating: userRating,
          paysageValue: paysageValue,
          ambianceValue: ambianceValue,
          difficultyValue: difficultyValue,
          userId: props.user._id,
          randoId: rando._id
        }
        //console.log(ratings)

        try {
          let randoRawResponse = await fetch(backendAdress + '/update-randorating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ratings)
          })

          alert("Merci pour votre participation!")
          setDisable(true)

          // console.log(JSON.stringify(userRawResponse))
          // console.log(JSON.stringify(randoRawResponse))
        } catch (e) {
          console.log(e)
        }
      } else (alert("D'abord mettez votre évaluation pour tous SVP"))
  }



  //console.log(avgTotal)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <HStack justifyContent="space-between" mb={0} style={{borderBottomWidth: 1, borderColor: '#CCCCCC'}}>
        <HamburgerMenu navigation={props.navigation} />
        <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
          <Text fontSize="xs" bold color="#38ADA9">
            Retour
          </Text>
        </Button>
      </HStack>
    <ScrollView style={{ flex:1 }}>
      <Button w={"80%"} size="md" mt={2} backgroundColor="#E55039" alignSelf="center" mb={10} shadow="7" onPress={() => console.log("I'm Pressed")}>
        <Text style={styles.contentText} fontSize="md">
          Nom de la Rando : {rando.name}
        </Text>
      </Button>
      {/* contents container for Demandes de partipation */}
      <VStack space={2} mb={2} alignItems="center">
        <Heading mb={5} size="md">
        Point de départ : {rando.departure.nom}
        </Heading>
        <Heading size="md">Historique des photos partagées </Heading>
      </VStack>

      {/* Carousel for Photos, default = data / else cloudinary image */}
      {image === "" ? (
        <></>
      ) : (<CustomSlider data={image} />)
      }

      {/* Photo share Button */}
      <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" mb={5} shadow="9" onPress={pickImage}>
        <Text style={styles.contentText} fontSize="md">
          Partager des photos
        </Text>
      </Button>

      <VStack space={5}>
        <Heading size="sm" textAlign="center"> Note moyenne : {userRating} </Heading>
        {/* Average Stars */}
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Note globale
          </Heading>
          {tabGlobalRating}
        </Flex>

        {/* PaysageRating Stars */}
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Paysage
          </Heading>
          {PaysageRating}
        </Flex>

        {/* AmbianceRating Stars */}
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Ambiance
          </Heading>
          {AmbianceRating}
        </Flex>

        {/* DifficultyRating Stars */}
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Difficulté
          </Heading>
          {DifficultyRating}
        </Flex>
      </VStack>

      <Button isDisabled={disable} w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" mt={5} shadow="9" onPress={submitRating}>
        <Text style={styles.contentText} fontSize="md">
         Donner mon avis
        </Text>
      </Button>
      </ScrollView>
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
    user: state.user
  }
}

export default connect(mapStateToProps, null)(Resume);