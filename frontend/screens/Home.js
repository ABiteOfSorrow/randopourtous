import React, { useEffect, useState } from 'react';
import { Text, Button, ScrollView, Avatar } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HamburgerMenu from '../components/HamburgerMenu';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function Home(props) {

  const [search, setSearch] = useState('');
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', width: '100%', justifyContent: 'center' }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderBottomWidth: 1, borderColor: '#CCCCCC' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu navigation={props.navigation} />
        </View>
        <View style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 0, margin: 0 }} >
            Accueil
          </Text></View>
        <View style={{ width: '30%' }}></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ width: '100%', height: "100%", alignItems: 'center', justifyContent: 'center' }} >
        <Text style={{ fontSize: 24, color: "#079992", fontWeight: 'bold', paddingTop: 5 }}>
          RandoPourTous !
        </Text>

        <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
          <Button style={styles.buttonStyle} my={1} bg={'#78E08F'} mr={2} onPress={() => props.navigation.navigate("Chercher")} >Chercher une randonnée</Button>
          <Ionicons name="search-circle" size={32} color="black" />
        </View> 
          <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("Create")} >Créer une randonnée</Button>
        <View style={{ marginTop: '4%' }} >
          {/* <MaterialIcons name="account-circle" size={96} color="black" /> */}
          <Avatar
            size={150}
            me="10"
            bg="amber.500"
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Macaca_nigra_self-portrait_large.jpg/800px-Macaca_nigra_self-portrait_large.jpg",
            }}
          ></Avatar>
        </View>
        <View style={{ width: '100%', marginTop: '2%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
          <Text>{props.user.username}</Text>
          <Button mt={'2%'} bg={'#079992'} onPress={() => props.navigation.navigate('Profil')} >Mon compte</Button>
          <Button my={'2%'} bg={'#bbb'} onPress={() => props.navigation.navigate('SearchPeople')} >Chercher un utilisateur</Button>
        </View>
      </ScrollView>
      <StatusBar style='auto' />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    //width: '85%',
    color: "white",
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 10,
    borderBottomWidth: 0,
    paddingLeft: 15,
  },
});

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
