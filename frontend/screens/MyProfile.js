import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Avatar } from "native-base";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from "react-redux";
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import backendConfig from '../backend.config.json';


const backendAdress = backendConfig.address;

function MyProfile(props) {
  console.log(JSON.stringify(props.user))
  const focused = useIsFocused();

  useEffect(() => {
    if (focused) {
      (async function () {
        try {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} >
        <View style={{ width: '30%' }} >
        <HamburgerMenu navigation={props.navigation} /> 
        </View>

        <View style={{ width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Mon profil</Text>
        </View>
        <View style={{ width: '30%' }}></View>
      </View>

      <Text style={{ fontSize: 18 }} >{props.user.username}</Text>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '4%' }} >
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 }} >
          <View style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <MaterialIcons name="account-circle" size={102} color="black" />
          </View>
          <View style={{ display: 'flex', width: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontSize: 18 }}>Prénom : {props.user.name}</Text>
            <Text style={{ fontSize: 18 }}>Nom : {props.user.lastname}</Text>
          </View>
        </View>
        <View style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', paddingHorizontal: 12 }} >
          <View style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <Text>{props.user.age === -1 ? 'X' : props.user.age} ans</Text>
            <Text>{props.user.friends.length === 0 ? "Pas encore d'" : props.user.friends.length + ' '}amis</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: '10%', marginBottom: '2%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="gray" />
      </View>
      <Text>Note moyenne des randos: {props.user.averageRating === -1 ? 'Non connu' : props.user.averageRating}</Text>
      <View style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("History")} w={'80%'} mt={'15%'} >Voir mes randos</Button>
        <Button my={1} bg={'#bbb'} onPress={() => props.navigation.navigate("Friend")} w={'80%'} >Voir mes amis</Button>
        <Button mt={'4%'} bg={'#bbb'} onPress={() => props.navigation.navigate('EditProfile')} w={'80%'} >Modifier mon compte</Button>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);