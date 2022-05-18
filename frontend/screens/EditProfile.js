import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from 'native-base';
import HamburgerMenu from '../components/HamburgerMenu';

export default function EditProfile(props) {


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
         <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 30 }} >
            <Text style={{ fontSize: 18, marginLeft: 10 }} >Email</Text>
            <Text>toto@mail.com</Text>
            <Text style={{ marginTop: 20 }} >Prénom</Text>
            <Input my={3} placeholder='Veuillez entrer le prénom...'></Input>
            <Text style={{ marginTop: 20 }} >Nom</Text>
            <Input my={3} placeholder='Veuillez entrer le nom...'></Input>

         </View>
         <View style={{ paddingHorizontal: 20, width: '100%', flex: 1, display: 'flex', justifyContent:'flex-end', paddingBottom: 10}} >
            <View style={{ width: '100%' }} >
               <Button bg='#78E08F' style={{ width: '100%' }}>Savegarder</Button>
            </View>

         </View>

      </SafeAreaView>
   )
}