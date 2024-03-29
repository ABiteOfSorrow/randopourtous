import React, { useEffect } from 'react';
import { Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, ScrollView } from 'native-base';
import { connect } from 'react-redux';
import HamburgerMenu from '../components/HamburgerMenu';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;


function EditProfile(props) {
// console.log(props)
   const isFocused = useIsFocused();
   useEffect(() => {
      (async function () {
         try {
            if (isFocused) {
               let rawresponse = await fetch(backendAdress + '/users/my-data?token=' + props.user.token)
               //console.log(JSON.stringify(rawresponse))
               if (rawresponse.ok) {
                  let response = await rawresponse.json();
                  if (response.result) {
                     // save data in redux
                     props.login(response.user)
                     // save user in async storage
                     try {
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
                     } catch (e) {
                        console.log(e)
                     }
                  } else {
                     Alert.alert('Erreur', response.error);
                  }
               } else {
                  Alert.alert('Erreur', 'Erreur de connexion au serveur.');
               }
            }
         } catch (e) {
            console.log(e);
            Alert.alert('Une erreur est survenue. L54');
         }
      })();

   }, []);

   const createdAccount = new Date(props.user.createdAccount)
   const [name, setName] = React.useState(props.user.name);
   const [lastName, setLastName] = React.useState(props.user.lastname);
   let defaultAge = '';
   if (props.user.age && props.user.age !== -1) {
      defaultAge = props.user.age.toString();
   }
   const [age, setAge] = React.useState(defaultAge);

   //console.log(JSON.stringify(props.user))
   const handleAge = (text) => {
      text = text.replace(/[^0-9]/g, ''),
         setAge(text);
   }

   const handleSubmit = async () => {
      let body = {
         name: name,
         lastname: lastName,
         age: age,
         token: props.user.token
      }
      try {
         let rawresponse = await fetch(backendAdress + '/users/edit-profile', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
         })
         if (rawresponse.status == 200) {
            let response = await rawresponse.json();
            if (response.result) {
               props.login(response.user)
               Alert.alert('Succès', 'Modifications enregistrées.')
            } else {
               Alert.alert('Erreur', response.error);
            }
         } else {
            Alert.alert('Erreur', 'Erreur de connexion au serveur.');
         }
      } catch (e) {
         console.log(e)
      }

   }

   return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }} >
         <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#CCCCCC', marginBottom: "5%" }}>
            <View style={{ width: 94 }} >
               <HamburgerMenu navigation={props.navigation} />
            </View>
            <View>
               <Text style={{ fontWeight: 'bold', fontSize: 18 }} >
                  Modifier le compte
               </Text>
            </View>
            <View style={{ width: 94, marginRight: 4 }} >
               <Button
                  w={90}
                  h={8}
                  p={0}
                  variant="outline"
                  borderColor="#38ADA9"
                  onPress={() => props.navigation.goBack()}
               >
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38ADA9' }} >
                     Retour
                  </Text>
               </Button>
            </View>
         </View>
         <ScrollView style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }} >
            <Text style={{ fontSize: 18, textAlign: "center",  marginBottom : "10%"}} >Email : {props.user.email}</Text>
            <Text style={{ fontSize: 18, textAlign: "center",  marginBottom : "10%"}} >Nom : {props.user.lastname}</Text>
            <Text style={{ fontSize: 18, textAlign: "center",  marginBottom : "10%"}} >Prénom : {props.user.name}</Text>
            <Text style={{ fontSize: 14, textAlign: "center", marginBottom: "10%" }} >Compte créé le: {createdAccount.toLocaleDateString('fr-FR')}</Text>
            <Text style={{ marginTop: 12, marginLeft: 10 }} >Prénom</Text>
            <Input my={3} placeholder='Veuillez entrer le prénom...' value={name} onChangeText={(text) => setName(text)} />
            <Text style={{ marginTop: 12, marginLeft: 10 }} >Nom</Text>
            <Input my={3} placeholder='Veuillez entrer le nom...' value={lastName} onChangeText={(text) => setLastName(text)} ></Input>
            <Text style={{ marginTop: 12, marginLeft: 10 }} >Age</Text>
            <Input my={3} maxLength={2} placeholder="Veuillez entrer l'age..." value={age} onChangeText={(text) => handleAge(text)} />
         </ScrollView>
         <View style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} >
            <View style={{ width: '84%' }} >
               <Button bg='#78E08F' shadow="9" mb={2} onPress={async () => await handleSubmit()} style={{ width: '100%' }}>Sauvegarder</Button>
            </View>
         </View>

      </SafeAreaView>
   )
}

function mapStateToProps(state) {
   return {
      user: state.user
   }
}
function mapDispatchToProps(dispatch) {
   return {
      login: (user) => dispatch({ type: 'USER_LOGIN', user: user })
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);