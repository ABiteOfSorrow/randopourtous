import React, {useState, useEffect} from "react";
import { Avatar, HStack, VStack, Center, Heading, Box, Button, Text, Flex, Stack } from "native-base";
import { Dimensions, StyleSheet, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth } = Dimensions.get("window");

import { AntDesign } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";
import CustomSlider from "../components/CustomSlider";
import backendConfig from '../backend.config.json';

function Resume() {

  const [paysageValue, setPaysageValue] = useState(0);
  const [ambianceValue, setAmbianceValue] = useState(0);
  const [difficultyValue, setDifficultyValue] = useState(0);
  const [status, requestPermission] = useState(null);
  const [picture, setPicture] = useState("")

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
      onPress={() => setDifficultyValue(count)}
      color={color}
      name="star" size={24} 
    />
  );
}


//Rando rating stars average and voter count
var totalNote = 0;
// var totalVote = props.globalCountRating;
if (paysageValue && ambianceValue && difficultyValue) {
  totalNote += paysageValue + ambianceValue + difficultyValue;
  // totalVote += 1;
}
//Rando rating stars average math Round or toFixed
var avgTotal = (totalNote / 3).toFixed(2);
// var avgTotal = Math.round(totalNote / 3);

var tabGlobalRating = [];

//Rando rating stars display
for (var i = 0; i < 5; i++) {
  var color = "black";
  if (i < avgTotal) {
    color = "#f1c40f";
  }

  tabGlobalRating.push(<AntDesign color={color} name="star" size={24}  />);
}
console.log(avgTotal)


// useEffect(() => {
//   (async () => {
//     const { status } = await MediaLibrary.usePermissions()
//     requestPermission(status === "granted");
//   })();
// }, []);

const pickFromGallery = async () => {
  console.log("you clicked this")
  if(status){
    let image = await MediaLibrary.getAssetsAsync({
    mediaTypes:ImagePicker.MediaTypeOptions.Images,
    quality:0.7,
    base64: true,
    exif: true,
  })
  var data = new FormData(image);
      data.append("avatar", {
        uri: data.uri,
        type: "image/jpeg",
        name: "image.jpg",
      });
      //Need to change IP when you start your APP (ipconfig)
      const rawResponse = await fetch({backendConfig} + ":3000/upload", {
        method: "post",
        body: data,
      });

      const response = await rawResponse.json();
      // console.log(response);
      // props.onSubmitPhotoList(response);
    }
  };


// const handleupload = (image) => {
// const photo = new FormData()
// data.append('file', image)
// data.append('upload_preset', 'randopourtous')
// data.append("cloud_name ", "rupo")

// fetch("https://api.cloudinary.com/v1_1/rupo/image/upload",{
//     method:"post",
//     body: photo
//     }).then(res=>res.json())
//     then(data=>{
//     console.log(data)
//     setPicture(data.uri)
// })
// }


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

      <CustomSlider data={data} />
      <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" mb={5} onPress={() => pickFromGallery()}>
        <Text style={styles.contentText} fontSize="md">
          Partager des photos
        </Text>
      </Button>

      <VStack space={5}>
      <Heading size="sm" textAlign="center"> Average Note est : {avgTotal} </Heading>
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Note globale
          </Heading>
          {tabGlobalRating}
        </Flex>
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Paysage
          </Heading>
          {PaysageRating}
        </Flex>
        <Flex direction="row" alignSelf="center">
          <Heading mr={5} size="md">
            Ambiance
          </Heading>
          {AmbianceRating}
        </Flex>
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
  map: {
    width: "90%",
    marginTop: 10,
    height: 200,
  },
  container: {
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
  },
  item: {
    width: "100%",
    height: screenWidth - 20, //height will be 20 units less than screen width.
  },
  imageContainer: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "lightblue",
    marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  dotContainer: {
    backgroundColor: "rgb(230,0,0)",
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  inactiveDotStyle: {
    backgroundColor: "rgb(255,230,230)",
  },
});

export default Resume;