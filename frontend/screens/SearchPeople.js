import { useState } from 'react';
import { Text, ScrollView, Box, Input, Button } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import HamburgerMenu from '../components/HamburgerMenu';

export default function SearchPeople(props) {
   const [username, setUsername] = useState("");


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
               <Box style={{ width: '20%' }} />
            </Box>

            <Text style={{ marginTop: '2%', fontSize: 18 }} >Entrez le nom d'utilisateur</Text>
            <Box style={{ width:'100%', display:'flex', alignItems: 'center' }}>
               <Input placeholder="Nom d'utilisateur" type='text' mt={2} w={'80%'} value={username} onChangeText={(text) => setUsername(text)} />
               <Box w={'80%'}>
                  <Button ml={'auto'} mt={'1%'} >Chercher</Button>
               </Box>
            </Box>
         </ScrollView>
      </SafeAreaView>
   )
}