import React, { useEffect, useState } from 'react';
import { Text, Button, ScrollView, Avatar, Box } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HamburgerMenu from '../components/HamburgerMenu';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, MaterialCommunityIcons  } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', width: '100%', justifyContent: 'center' }}>

      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderBottomWidth: 1, borderColor: '#CCCCCC' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu navigation={props.navigation} />
        </View>
        <View style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 0, margin: 0 }} >
            Accueil
          </Text>
        </View>
        <View style={{ width: '30%' }} />
      </View>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ width: '100%', height: "100%", alignItems: 'center', justifyContent: 'center' }} >
        <LinearGradient colors={['#e3ffde', 'white']} style={styles.gradient} >
          <Text style={{ fontSize: 24, color: "#079992", fontWeight: 'bold', paddingTop: 5 }}>
            RandoPourTous !
          </Text>

          <View style={{ width: "100%", marginTop: '10%', flexDirection: "row", justifyContent: 'center' }}>
            <Button style={styles.buttonStyle} py={1} my={1} bg={'#78E08F'} shadow="9" onPress={() => props.navigation.navigate("Chercher")} ><Box style={styles.buttonBox} ><Text color={'#fff'}>Chercher une randonnée  </Text><Ionicons name="search-circle" size={34} color="white" /></Box></Button>
          </View>
          <Button style={styles.buttonStyle} py={1} my={1} bg={'#78E08F'} shadow="9" onPress={() => props.navigation.navigate("Create")} ><Box style={styles.buttonBox} ><Text color={'#fff'}>Créer une randonnée  </Text><Ionicons name="navigate-circle" size={34} color="white" /></Box></Button>
          <View style={{ marginTop: '10%' }} >
            {/* <MaterialIcons name="account-circle" size={96} color="black" /> */}
            <Avatar
              size={150}
              me="1"
              bg="amber.500"
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Macaca_nigra_self-portrait_large.jpg/800px-Macaca_nigra_self-portrait_large.jpg",
              }} />
          </View>
          <View style={{ width: '100%', marginTop: '2%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
            <Text style={{ fontSize: 20, fontWeight: 'bold' }} >{props.user.username}</Text>
            <Button mt={'4%'} w={"84%"} bg={'#079992'} shadow="7" onPress={() => props.navigation.navigate('Profil')} ><Text color={'#fff'} fontSize={16} >Mon compte</Text></Button>
            <Button p={1} my={'3%'} w={'84%'} bg={'#bbb'} shadow="7" onPress={() => props.navigation.navigate('SearchPeople')} ><Box style={styles.buttonBox} ><Text style={{ color:'#fff', fontSize: 16 }}>Chercher un utilisateur  </Text><MaterialCommunityIcons  name="account-search" size={34} color="white" /></Box></Button>
          </View>
        </LinearGradient>
      </ScrollView>
      <StatusBar style='auto' />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: '84%',
    color: "white",
    flexDirection: 'row',
    display: 'flex'
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 10,
    borderBottomWidth: 0,
    paddingLeft: 15,
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    minHeight: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
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
