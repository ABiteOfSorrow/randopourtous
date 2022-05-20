import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ScrollView, Box, Input, Button } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import HamburgerMenu from '../components/HamburgerMenu';
import { connect } from 'react-redux';

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function SearchPeople(props) {
   const [username, setUsername] = useState("");
   const [users, setUsers] = useState([])

   const handleSubmit = async () => {
      if (!username) return;
      try {
         let rawresponse = await fetch(backendAdress+'/users/search-people?username='+username);
         if (rawresponse.status == 200) {
            let response = await rawresponse.json();
            if (response.result) {
               console.log(JSON.stringify(response))
               setUsers(response.users);
            } else {
               alert(response.error);
            }
         } else {
            alert('Problème de connexion au serveur.')
         }
      } catch (e) {
         console.log(e)
      }
   }

   let userComponents = users.map((user, index) => {
      let route = 'Otherprofile'
      if (user.username === props.user.username) {
         route = 'MyProfile';
      }

      return (
         <Box key={index} style={styles.card} >
            <MaterialIcons name="account-circle" size={38} color="black" />
            <Box style={{ flex: 1, display:'flex', alignItems: 'center', justifyContent:'center' }} >
               <Text style={{ color: '#fff', fontSize: 16 }} >{user.username}</Text>
            </Box>
            <Box>
               <Button bg={'#bbb'} onPress={() => props.navigation.navigate(route, { user: user })} >Voir</Button>
            </Box>
         </Box>
      )
   })
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }} >
         <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
            <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
               <Box style={{ width: '20%' }} >
                  <HamburgerMenu />
               </Box>
               <Box style={{ width: '60%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Chercher un utilisateur</Text>
               </Box>
               <Box style={{ width: '20%', alignItems: 'center' }} >
                  <Button
                     w={70}
                     h={8}
                     p={0}
                     mr={1}
                     variant="outline"
                     borderColor="#38ADA9"
                     onPress={() => props.navigation.goBack()}
                  >
                     <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38ADA9' }} >
                        Retour
                     </Text>
                  </Button>
               </Box>
            </Box>

            <Text style={{ marginTop: '4%', fontSize: 18 }} >Entrez le nom d'utilisateur</Text>
            <Box style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
               <Input placeholder="Nom d'utilisateur" type='text' mt={'1%'} w={'80%'} value={username} onChangeText={(text) => setUsername(text)} />
               <Box w={'80%'}>
                  <Button bg={'#78E08F'} ml={'auto'} mt={'4%'} onPress={async () => await handleSubmit()} >Chercher</Button>
               </Box>
               <Box style={{ width: '100%', marginTop: '3%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, marginBottom: '3%' }} >Résultats :</Text>
                  {userComponents}
               </Box>
            </Box>
         </ScrollView>
         <StatusBar style="auto" />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   card: {
      width: '84%',
      backgroundColor: '#079992',
      borderRadius:5,
      paddingHorizontal: '3%',
      paddingVertical: 10,
      display:'flex',
      flexDirection: 'row'
   },
});

function mapStateToProps(state) {
   return {
      user: state.user
   }
}

export default connect(mapStateToProps, null)(SearchPeople);