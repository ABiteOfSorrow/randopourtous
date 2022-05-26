import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Avatar } from "native-base";
import { Text, View, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { connect } from "react-redux";
import { LinearGradient } from 'expo-linear-gradient';

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function OtherProfile(props) {
  const user = props.route.params.user;
  //console.log(user)
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
      if (rawresponse.ok) {
        let response = await rawresponse.json();
        if (response.result) {
          Alert.alert('Succès.', "Ajouté à la liste d'amis");
          props.setUser(response.user);
        } else {
          Alert.alert('Erreur.', response.error);
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
      tabGlobalRating.push(<AntDesign key={i} color={color} name="star" size={42} />);
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}>
      <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
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
      <LinearGradient colors={['#e8eaec',  'white']} style={styles.gradient} >
        <Text style={{ fontSize: 22, marginVertical: '6%', fontWeight: "bold" }}>Profil d'un utilisateur</Text>
        <Text style={{ fontSize: 20 }}>{user.username}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: '1%',
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
              <Avatar
                size={150}
                me="10"
                bg="amber.500"
                source={{
                  uri: "https://file1.topsante.com/var/topsante/storage/images/medecine/troubles-orl/rhume-rhinopharingite/vivre-avec/on-a-trouve-l-origine-du-rhume-les-chameaux-612915/8708813-1-fre-FR/On-a-trouve-l-origine-du-rhume-les-chameaux.jpg?alias=original",
                }}
              ></Avatar>
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
              <Text style={{ fontSize: 18 }} >{user.age === -1 ? 'X' : user.age} ans</Text>
              <Text style={{ fontSize: 18 }} >{user.friends.length === 0 ? "Pas encore d'" : user.friends.length + ' '}amis</Text>
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
        <Text style={{ fontSize: 16 }} >Note moyenne des randos: {user.averageRating === -1 ? 'Non connu' : user.averageRating.toFixed(2)}</Text>
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
          <Button my={1} bg={"#78E08F"} shadow="9" onPress={() => props.navigation.navigate('Randos', { screen: 'History', params: props.route.params.user })} w={"80%"}>
          <Box style={styles.buttonContainer}><Text style={styles.buttonText} >Voir ses randos  </Text><FontAwesome5 name="hiking" size={24} color="white" /></Box>
          </Button>

          {!alreadyFriends && <Button my={1} bg={"#bbb"} shadow="6" onPress={async () => await handleAddFriend(user)} w={"80%"}>
            Ajouter en ami
          </Button>
          }
          {alreadyFriends && <Text style={{ marginTop: '5%', fontSize: 18 }} >Cette personne est votre ami.</Text>}
        </View>

      </LinearGradient>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    marginHorizontal: '2%'
  },
  gradient: {
    width: '100%',
    minHeight: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

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