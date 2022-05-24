import React, { useState, useEffect } from "react";
import { Avatar, HStack, VStack, Center, Heading, Box, Button, Text, Flex, Stack } from "native-base";
import { Dimensions, StyleSheet, Platform, View, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { connect } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";
import CustomSlider from "../components/CustomSlider";
import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;


function Resume(props) {

  const [paysageValue, setPaysageValue] = useState(0);
  const [ambianceValue, setAmbianceValue] = useState(0);
  const [difficultyValue, setDifficultyValue] = useState(0);
  const [image, setImage] = useState([]);
  const [userRating, setUserRating] = useState(0)
  let photos = [...image];
  // console.log(props.user)

  useEffect(() => {
    //setUserRating(avgTotal)
    if (userRating > 0) {
      const ratingfetch = async () => {
        let ratings = {
          averageRating: userRating,
          paysageValue: paysageValue,
          ambianceValue: ambianceValue,
          difficultyValue: difficultyValue,
          id: props.user._id,
        }
        //console.log(ratings)

        try {
          let rawresponse = await fetch(backendAdress + '/users/update-rating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(ratings)
          })
          console.log(JSON.stringify(rawresponse))
        } catch (e) {
          console.log(e)
        }
      }
      ratingfetch()
    }
  }, [userRating])

  useEffect(() => {

    //Rando rating stars average and voter count
    let totalNote = 0;
    // var totalNote = props.globalCountRating;
    if (paysageValue && ambianceValue && difficultyValue) {
      totalNote += (paysageValue + ambianceValue + difficultyValue) / 3;
      // totalVote += 1;
    }
    totalNote = Math.round(totalNote * 10) / 10
    setUserRating(totalNote)
  }, [ambianceValue, paysageValue, difficultyValue])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
      base64: true,
      exif: true
    });
    var data = new FormData(photo);
    data.append("avatar", {
      uri: photo.uri,
      type: "image/jpeg",
      name: "image.jpg",
    });
    // console.log(data)
    // Need to change IP when you start your APP (ipconfig)
    const rawResponse = await fetch(backendAdress + '/upload', {
      method: "post",
      body: data,
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



  //Rando rating stars average math Round or toFixed
  //setAvgTotal((totalNote / 3).toFixed(2));
  // var avgTotal = Math.round(totalNote / 3);

  let tabGlobalRating = [];

  //Rando rating stars display
  if (userRating != 0) {
    for (let i = 0; i < 5; i++) {
      let color = "black";
      if (i < userRating) {
        color = "#f1c40f";
      }
      tabGlobalRating.push(<AntDesign key={i} color={color} name="star" size={24} />);
    }
  }

  //console.log(avgTotal)
  // Default data for carousel if there is nothing
  const data = [
    {
      title: "Coral Reef",
      description: "Location: Red Sea",
      source: "https://images.unsplash.com/photo-1633205719979-e47958ff6d93?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80",
    },
    {
      title: "Phone",
      description: "iPhone 6 on the table",
      source: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80",
    },

    {
      title: "Old building",
      description: "Location: Germany",
      source: "https://images.unsplash.com/photo-1623345805780-8f01f714e65f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80",
    },
  ];




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <HStack justifyContent="space-between" mb={4}>
        <HamburgerMenu navigation={props.navigation} />
        <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9" onPress={() => props.navigation.goBack()}>
          <Text fontSize="xs" bold color="#38ADA9">
            Retour
          </Text>
        </Button>
      </HStack>

      <Button w={"80%"} size="md" backgroundColor="#E55039" alignSelf="center" mb={10} onPress={() => console.log("I'm Pressed")}>
        <Text style={styles.contentText} fontSize="md">
          Nom de la Rando
        </Text>
      </Button>
      {/* contents container for Demandes de partipation */}
      <VStack space={2} mb={2} alignItems="center">
        <Heading mb={5} size="md">
          À: Lieu de la Rando
        </Heading>
        <Heading size="md">Historique des photos partagées </Heading>
      </VStack>
      {/* Carousel for Photos, default = data / else cloudinary image */}
      {image === "" ? (
        <CustomSlider data={data} />
      ) : (<CustomSlider data={image} />)
      }

      {/* Photo share Button */}
      <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" mb={5} onPress={pickImage}>
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

      {/* To prevent leaving the content area */}
      <Box w="100%" h="8.5%" alignSelf="center" bg="#fff" />
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