import React, { useEffect } from "react";
import { Avatar, HStack, VStack, Center, Heading, Button, Text, Flex, Box } from "native-base";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import HamburgerMenu from "../components/HamburgerMenu";

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function Friend(props) {
  const [friends, setFriends] = React.useState([]);


  useEffect(() => {
    (async () => {
      let friendIds = props.user.friends;
      setFriends([]);
      for (let i = 0; i < friendIds.length; i++) {
        try {
        let rawresponse = await fetch(backendAdress + '/users/user/' + friendIds[i]);
        // console.log(JSON.stringify(rawresponse))
        if (rawresponse.ok) {
          let response = await rawresponse.json();
          if (response.result) {
            setFriends(prevState => [...prevState, response.user]);
          } else {
            Alert.alert('Erreur.', response.error);
          }
        } else {
          Alert.alert('Erreur.', 'Problème de connexion au serveur.')
        }
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flex:1 }} >
        <HStack justifyContent="space-between" mb={'4%'} style={{borderBottomWidth: 1, borderColor: '#CCCCCC'}}>
          <HamburgerMenu navigation={props.navigation} />
          <Button
            w={90}
            h={8}
            p={0}
            mt={2}
            mr={2}
            variant="outline"
            style={{ borderColor: "#38ADA9" }}
            onPress={() => props.navigation.goBack()}
          >
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38ADA9' }} >
              Retour
            </Text>
          </Button>
        </HStack>
        <VStack space={2} style={{ alignItems: "center", flex: 1 }} >
          <Heading size="lg" mb={'12%'}>
            Mes amis
          </Heading>
          {/* User profil box */}
          {friends.map((friend, index) => (
          <Center
            key={index}
            w={'84%'}
            h={62}
            px={4}
            mb={2}
            bg="#079992"
            rounded="lg"
            shadow={8}
            style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
          >
            <MaterialIcons name="account-circle" size={52} color="black" />
            <VStack space={2} style={{}} >
              <Heading style={styles.contentText} size="xs">
                {friend.username}
              </Heading>
              <Flex direction="row" alignSelf="center">
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
                <AntDesign name="star" size={24} color="yellow" />
              </Flex>
            </VStack>
            <Button
              size="xs"
              style={{ backgroundColor: "#BBBBBB", alignSelf: "center" }}
              onPress={() => props.navigation.navigate("OtherProfile", { user: friend })}
            >
              <Text style={styles.contentText} fontSize="xs">
                Voir Profil
              </Text>
            </Button>

          </Center>
          ))}
        </VStack>
      </ScrollView>
      {/* To prevent leaving the content area */}
      <Box w={320} h={60} alignSelf="center" />
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
//export default Friend;

export default connect(mapStateToProps, null)(Friend);
