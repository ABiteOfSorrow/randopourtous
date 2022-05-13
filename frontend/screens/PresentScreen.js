import { Button } from "native-base"
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PresentScreen(props) {

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
         <Text style={{ fontSize: 20, marginBottom: 10 }}>Bienvnue à RandoPourTous!</Text>
         <Button onPress={() => props.navigation.navigate('SignUp')} >Sign up</Button>
      </SafeAreaView>
   )
}