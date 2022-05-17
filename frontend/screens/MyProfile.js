import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button } from "native-base";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { MaterialIcons } from '@expo/vector-icons';

export default function MyProfile(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ display: 'flex', width: '100%', flexDirection: 'row' }} >
        <HamburgerMenu />
      </View>
      <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: 'bold' }}>Mon compte</Text>
      <Text style={{ fontSize: 18 }} >JeanMichel_du75</Text>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 12 }} >
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 }} >
          <View style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <MaterialIcons name="account-circle" size={104} color="black" />
          </View>
          <View style={{ display: 'flex', width: '50%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontSize: 18 }}>Nom</Text>
            <Text style={{ fontSize: 18 }}>Prénom</Text>
          </View>
        </View>
        <View style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', paddingHorizontal: 12 }} >
          <View style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <Text>30 ans</Text>
            <Text>666 amis</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 34, marginBottom: 6, display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
        <MaterialIcons name="star" size={34} color="black" />
        <MaterialIcons name="star" size={34} color="black" />
        <MaterialIcons name="star" size={34} color="black" />
        <MaterialIcons name="star" size={34} color="black" />
        <MaterialIcons name="star" size={34} color="black" />
      </View>
      <Text>Note moyenne des randos: 4.2</Text>
      <View style={{ flex: 1, width: '100%', marginTop: 74, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("Friend")} w={'80%'} >Voir mes randos</Button>
        <Button my={1} bg={'#bbb'} onPress={() => props.navigation.navigate("Friend")} w={'80%'} >Voir mes amis</Button>
        <Button mt={5} bg={'#bbb'} onPress={() => props.navigation.navigate("Friend")} w={'80%'} >Editer mes informations</Button>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
