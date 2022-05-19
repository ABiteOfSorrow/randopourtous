import React, { useEffect } from 'react';
import { Text, Button, ScrollView } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HamburgerMenu from '../components/HamburgerMenu';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function Home(props) {
  useEffect(() => {
    // load from async storage to redux store
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        props.signIn(JSON.parse(user));
      }
    }).catch(err => {
      console.log(err);
    });
    // fetch data from backend

    props.navigation.canGoBack(false);
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', width: '100%', paddingBottom: '20%' }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu />
        </View>
        <View style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 0, margin: 0 }} >
            Accueil
          </Text></View>
        <View style={{ width: '30%' }}></View>
      </View>
      <ScrollView contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center'  }} >
        <Text style={{ fontSize: 20, marginTop: '10%' }}>
          Rando Pour Tous!
        </Text>
        <View style={{ width: '84%', marginTop: '10%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("Chercher")} >Chercher une randonnée</Button>
          <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("Create")} >Créer une randonnée</Button>
        </View>
        <View style={{ marginTop: '10%' }} >
          <MaterialIcons name="account-circle" size={96} color="black" />
        </View>
        <View style={{ width: '100%', marginTop: '6%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Text>{props.user.username}</Text>
          <Button my={2} bg={'#079992'} onPress={() => props.navigation.navigate('Profil')} >Mon compte</Button>
          <Button my={2} bg={'#bbb'} onPress={() => props.navigation.navigate('SearchPeople')} >Chercher un utilisateur</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
function mapDispatchToProps(dispatch) {
  return {
    signIn: (user) => dispatch({ type: 'USER_LOGIN', user: user })
  };
}
function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
