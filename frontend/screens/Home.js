import React, { useEffect, useState } from 'react';
import { Text, Button, ScrollView, Avatar, Box } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HamburgerMenu from '../components/HamburgerMenu';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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
        
        <Box w={'30%'} my={3} h={7} />
        
        <View style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 0, margin: 0 }} >
            Accueil
          </Text>
        </View>
        <View style={{ width: '30%' }} />
      </View>
      <ScrollView style={{ width: '100%', flex: 1, maxHeight:'100%' }} contentContainerStyle={{ width: '100%', minHeight: '86%' }} >
        <LinearGradient colors={['#e8eaec', 'white']} style={styles.gradient} >
          <Text style={{ fontSize: 24, color: "#079992", fontWeight: 'bold', paddingTop: '4%' }}>
            RandoPourTous !
          </Text>
          <View style={{ width: "100%", marginTop: '4%', flexDirection: "row", justifyContent: 'center' }}>
            <Button style={styles.buttonStyle} py={1} my={2} bg={'#78E08F'} shadow="7" onPress={() => props.navigation.navigate("Chercher")} ><Box style={styles.buttonBox} ><Text fontSize={16} color={'#fff'}>Chercher une randonnée  </Text><Ionicons name="search-circle" size={34} color="white" /></Box></Button>
          </View>
          <Button style={styles.buttonStyle} my={1} bg={'#78E08F'} shadow="7" onPress={() => props.navigation.navigate("Create")} ><Box style={styles.buttonBox} ><Text fontSize={14} color={'#fff'}>Créer une randonnée  </Text><Ionicons name="navigate-circle" size={22} color="white" /></Box></Button>
          <View style={{ marginTop: '8%' }} >
            {/* <MaterialIcons name="account-circle" size={96} color="black" /> */}
            <Avatar
              size={150}
              me="1"
              bg="amber.500"
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Macaca_nigra_self-portrait_large.jpg/800px-Macaca_nigra_self-portrait_large.jpg",
              }} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 1.5 }} >{props.user.username}</Text>
          <Button alignItems='center' mt={'4%'} w={"84%"} bg={'#079992'} shadow="7" onPress={() => props.navigation.navigate('Profil')} ><Text color={'#fff'} fontSize={15} >Mon compte</Text></Button>
          <Button mt={'3%'} w={'84%'} bg={'#bbb'} alignItems='center' shadow="7" onPress={() => props.navigation.navigate('SearchPeople')} ><Box style={styles.buttonBox} ><Text style={{ color: '#fff', fontSize: 16 }}>Chercher un utilisateur</Text><Ionicons name="search-circle" size={22} color="white" /></Box></Button>
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
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0
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
