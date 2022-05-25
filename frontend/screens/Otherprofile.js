import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button } from "native-base";
import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { connect } from "react-redux";

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function OtherProfile(props) {
  const user = props.route.params.user;
  let isFriend = false;
  if (props.user.friends.includes(user._id)) {
    isFriend = true;
  }
  const [alreadyFriends, setAlreadyFriends] = React.useState(isFriend);

  const handleAddFriend = async (user) => {
    console.log("add friend");
    try {
      let rawresponse = await fetch(backendAdress + '/users/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: props.user.token, username: user.username }),
      });
      if (rawresponse.status == 200) {
        let response = await rawresponse.json();
        if (response.result) {
          Alert.alert('Succès.', "Ajouté à la liste d'amis");
          props.setUser(response.user);
        } else {
          Alert.alert('Attention.', response.error);
        }
      } else {
        Alert.alert('Erreur...', 'Problème de connexion au serveur.')
      }
    } catch (e) {
      console.log(e);
    }
  }

  let tabGlobalRating = [];
  let userStars = user.averageRating
  //Rando rating stars display
  if (userStars !== 0) {
    for (let i = 0; i < 5; i++) {
      let color = "black";
      if (i < userStars) {
        color = "#f1c40f";
      }
      tabGlobalRating.push(<AntDesign key={i} color={color} name="star" size={24} />);
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}>
      <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
        <HamburgerMenu navigation={props.navigation} />
        <Button
          w={70}
          h={8}
          p={0}
          mr={2}
          variant="outline"
          borderColor="#38ADA9"
          onPress={() => props.navigation.goBack()}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38ADA9' }} >
            Retour
          </Text>
        </Button>
      </View>
      <Text style={{ fontSize: 22, marginBottom: '6%', fontWeight: "bold" }}>Profil d'un utilisateur</Text>
      <Text style={{ fontSize: 18 }}>{user.username}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: '4%',
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="account-circle" size={102} color="black" />
          </View>
          <View
            style={{
              display: "flex",
              width: "50%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>Nom : {user.lastname}</Text>
            <Text style={{ fontSize: 18 }}>Prénom : {user.name}</Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text>{user.age === -1? 'X': user.age} ans</Text>
            <Text>{user.friends.length === 0 ? "Pas encore d'" : user.friends.length + ' '}amis</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: '12%',
          marginBottom: 6,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {tabGlobalRating}
      </View>
      <Text>Note moyenne des randos: {user.averageRating === -1 ? 'Non connu' : user.averageRating}</Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          marginTop: '18%',
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button my={1} bg={"#78E08F"} onPress={() => alert('Faut le faire!')} w={"80%"}>
          Voir ses randos
        </Button>

        {!alreadyFriends && <Button my={1} bg={"#bbb"} onPress={async () => await handleAddFriend(user)} w={"80%"}>
          Ajouter en ami
          </Button>
        }
        {alreadyFriends && <Text style={{ marginTop: '1.5%' }} >Cette personne est votre ami.</Text>}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setUser: (user) => dispatch({ type: "USER_LOGIN", user: user }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OtherProfile);