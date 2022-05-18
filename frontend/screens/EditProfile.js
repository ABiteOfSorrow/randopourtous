import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from 'native-base';
import { connect } from 'react-redux';
import HamburgerMenu from '../components/HamburgerMenu';

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;


function EditProfile(props) {
   const createdAccount = new Date(props.user.createdAccount)
   const [name, setName] = React.useState(props.user.name);
   const [lastName, setLastName] = React.useState(props.user.lastname);
   const [age, setAge] = React.useState(props.user.age);

   console.log(JSON.stringify(props.user))
   const handleAge = (text) => {
      text = text.replace(/[^0-9]/g, ''),
      setAge(text);
   }

   const handleSubmit = async () => {
      let rawresponse = await fetch(backendAdress + '/users/edit-profile')

   }

   return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }} >
         <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
            <View style={{ width: 94 }} >
               <HamburgerMenu />
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
         <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }} >
            <Text style={{ fontSize: 18, marginLeft: 10 }} >Email</Text>
            <Text>toto@mail.com</Text>
            <Text style={{ fontSize: 14, marginTop: 8, marginLeft: 10 }} >Compte créé le: {createdAccount.toLocaleDateString('fr-FR')}</Text>
            <Text style={{ marginTop: 12, marginLeft:10 }} >Prénom</Text>
            <Input my={3} placeholder='Veuillez entrer le prénom...' value={name} onChangeText={(text) => setName(text)} />
            <Text style={{ marginTop: 12, marginLeft:10 }} >Nom</Text>
            <Input my={3} placeholder='Veuillez entrer le nom...' value={lastName} onChangeText={(text) => setLastName(text)} ></Input>
            <Text style={{ marginTop: 12, marginLeft:10 }} >Age</Text>
            <Input my={3} maxLength={2} placeholder="Veuillez entrer l'age..." value={age} onChangeText={(text) => handleAge(text)} />
         </View>
         <View style={{ paddingHorizontal: 20, width: '100%', flex: 1, display: 'flex', justifyContent:'flex-end', paddingBottom: 20}} >
            <View style={{ width: '100%' }} >
               <Button bg='#78E08F' onPress={async() => await handleSubmit()} style={{ width: '100%' }}>Savegarder</Button>
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