import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Avatar, Box } from "native-base";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { connect } from "react-redux";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backendConfig from '../backend.config.json';
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const backendAdress = backendConfig.address;

function MyProfile(props) {
  //console.log(JSON.stringify(props.user))
  const focused = useIsFocused();
  let user = props.user? props.user : { friends: [] };

  useEffect(() => {
    if (focused) {
      (async function () {
        try {
          if (!props.user) {
            let user = await AsyncStorage.getItem("user");
            if (user) {
              user = JSON.parse(user);
              props.signUp(user);
            } else {
              props.navigation.replace("SignIn");
              return;
            }
          }
          let rawresponse = await fetch(backendAdress + '/users/my-data?token=' + props.user.token);
          //console.log(JSON.stringify(rawresponse))
          if (rawresponse.status == 200) {
            let response = await rawresponse.json();
            if (response.result) {
              // save data in redux
              props.setUser(response.user)
              // save user in async storage

              // read user data and if it is not same, save it
              let user = await AsyncStorage.getItem('user')
              if (user) {
                let userData = JSON.parse(user)
                if (JSON.stringify(userData) !== JSON.stringify(response.user)) {
                  await AsyncStorage.setItem('user', JSON.stringify(response.user))
                  console.log('User data saved in storage.')
                }
              } else {
                await AsyncStorage.setItem('user', JSON.stringify(response.user))
                console.log('User data saved in storage. Data was not in storage.')
              }

            } else {
              alert(response.error);
            }
          } else {
            alert('Error while fetching user data.');
          }
        } catch (e) {
          console.log(e)
        }
      })();
    }
  }, [])


  let tabGlobalRating = [];
  let userStars = props.user.averageRating
  //Rando rating stars display
  if (userStars !== 0) {
    for (let i = 0; i < 5; i++) {
      let color = "black";
      if (i < userStars) {
        color = "#f1c40f";
      }
      tabGlobalRating.push(<AntDesign key={i} color={color} name="star" size={36} />);
    }
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#CCCCCC' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu navigation={props.navigation} />
        </View>
        <View style={{ width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Mon profil</Text>
        </View>
        <View style={{ width: '30%' }}></View>
      </View>
      <LinearGradient colors={['#e3ffde', 'white']} style={styles.gradient} >
        <Text style={{ fontSize: 22, marginTop: '7%', fontWeight: 'bold' }} >{user.username}</Text>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '2%' }} >
          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 }} >
            <View style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
              <Avatar
                size={122}
                me="2"
                bg="amber.500"
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Macaca_nigra_self-portrait_large.jpg/800px-Macaca_nigra_self-portrait_large.jpg",
                }}
              ></Avatar>
            </View>
            <View style={{ display: 'flex', width: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ fontSize: 18 }}>Prénom : {user.name}</Text>
              <Text style={{ fontSize: 18 }}>Nom : {user.lastname}</Text>
            </View>
          </View>
          <View style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', paddingHorizontal: 12 }} >
            <View style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
              <Text style={{ fontSize: 20 }} >{user.age === -1 ? 'X' : user.age} ans</Text>
              <Text style={{ fontSize: 20 }} >{user.friends.length === 0 ? "Pas encore d'" : user.friends.length + ' '}amis</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: '10%', marginBottom: '2%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
          {tabGlobalRating}
        </View>
        <Text style={{ fontSize: 16 }} >Note moyenne des randos: {user.averageRating === -1 ? 'Non connu' : props.user.averageRating.toFixed(2)}</Text>
        <View style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Button my={'2%'} bg={'#78E08F'} shadow="6" w={'80%'} mt={'15%'} onPress={() => props.navigation.navigate('Randos', { screen: 'History', params: props.user })}><Box style={styles.buttonContainer}><Text style={styles.buttonText} >Voir mes randos  </Text><FontAwesome5 name="hiking" size={24} color="white" /></Box></Button>
          <Button my={'2%'} bg={'#bbb'} shadow="6" w={'80%'} onPress={() => props.navigation.navigate("Friend")}><Box style={styles.buttonContainer}><Text style={styles.buttonText}>Voir mes amis   </Text><FontAwesome5 name="user-friends" size={24} color="white" /></Box></Button>
          <Button mt={'4%'} bg={'#bbb'} shadow="6" w={'80%'} onPress={() => props.navigation.navigate('EditProfile')}><Box style={styles.buttonContainer}><Text style={styles.buttonText} > Modifier mon compte </Text><FontAwesome5 name="edit" size={24} color="white" /></Box></Button>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);