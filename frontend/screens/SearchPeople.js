import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ScrollView, Box, Input, Button, Avatar } from 'native-base';
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
               // console.log(JSON.stringify(response))
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
      let route = 'OtherProfile'
      if (user.username === props.user.username) {
         route = 'MyProfile';
      }

      return (
         <Box key={index} mb={2} style={styles.card} >
             <Avatar
            size={38}
            me="10"
            bg="amber.500"
            source={{
              uri: "https://file1.topsante.com/var/topsante/storage/images/medecine/troubles-orl/rhume-rhinopharingite/vivre-avec/on-a-trouve-l-origine-du-rhume-les-chameaux-612915/8708813-1-fre-FR/On-a-trouve-l-origine-du-rhume-les-chameaux.jpg?alias=original",
            }}
          ></Avatar>
            <Box style={{ flex: 1, display:'flex', alignItems: 'center', justifyContent:'center', shadow: 9 }} >
               <Text style={{ color: '#fff', fontSize: 16 }} >{user.username}</Text>
            </Box>
            <Box>
               <Button bg={'#bbb'} shadow="9" onPress={() => props.navigation.navigate(route, { user: user })} >Voir</Button>
            </Box>
         </Box>
      )
   })
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }} >
         <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
            <Box style={styles.menu} >
               <Box style={{ width: '20%' }} >
               <HamburgerMenu navigation={props.navigation} /> 
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
                  <Button bg={'#78E08F'} ml={'auto'} mt={'4%'} shadow="9" onPress={async () => await handleSubmit()} >Chercher</Button>
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
   menu:{
      width: '100%', 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottomWidth: 1, 
      borderColor: '#CCCCCC', 
      paddingBottom:"1%", 
      marginBottom:"2%" 
   }
});

function mapStateToProps(state) {
   return {
      user: state.user
   }
}

export default connect(mapStateToProps, null)(SearchPeople);