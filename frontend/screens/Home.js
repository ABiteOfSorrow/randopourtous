import React, { useEffect } from 'react';
import { Text, Button } from 'native-base';
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

    props.navigation.canGoBack(false);
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu />
        </View>
        <View style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 0, margin: 0 }} >
            Accueil
          </Text></View>
        <View style={{ width: '30%' }}><Text></Text></View>
      </View>
      <Text style={{ fontSize: 20, marginTop: 30 }}>
        Rando Pour Tous!
      </Text>
      <View style={{ width: '100%', marginTop: 62, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        <Button my={2} bg={'#78E08F'} onPress={() => props.navigation.navigate("Chercher")} w={'80%'} >Chercher une randonnée</Button>
        <Button my={2} bg={'#78E08F'} onPress={() => props.navigation.navigate("Create")} w={'80%'} >Créer une randonnée</Button>
      </View>
      <View style={{ marginTop: 12 }} >
        <MaterialIcons name="account-circle" size={96} color="black" />
      </View>
      <View style={{ width: '100%', marginTop: 40, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        <Button my={2} bg={'#079992'} onPress={() => props.navigation.navigate('Profil')} >Mon compte</Button>
        <Button my={2} bg={'#bbb'} onPress={() => alert("Faut créer l'écran!")} >Chercher un utilisateur</Button>
      </View>
      
    </SafeAreaView>
  )
}
function mapDispatchToProps(dispatch) {
  return {
    signIn: (user) => dispatch({ type: 'USER_LOGIN', user: user })
  };
}

export default connect(null, mapDispatchToProps)(Home);
