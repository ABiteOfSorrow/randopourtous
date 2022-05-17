import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Avatar } from "native-base";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { MaterialIcons } from '@expo/vector-icons';

export default function MyProfile(props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} >
        <View style={{ width: '30%' }} >
          <HamburgerMenu />
        </View>
        
        <View style={{ width: '30%', display:'flex', alignItems:'center', justifyContent: 'center' }} >
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Mon compte</Text>
        </View>
        <View style={{ width: '30%' }}></View>
      </View>
      
      <Text style={{ fontSize: 18 }} >JeanMichel_du75</Text>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 12 }} >
        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 }} >
          <View style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
          <Avatar
              
              size="2xl"
              bg="amber.500"
              source={{
                uri: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
              }}
            ></Avatar>
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
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="#F8F808" />
        <MaterialIcons name="star" size={40} color="gray" />
      </View>
      <Text>Note moyenne des randos: 4.2</Text>
      <View style={{ flex: 1, width: '100%', marginTop: 74, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }} >
        <Button my={1} bg={'#78E08F'} onPress={() => props.navigation.navigate("History")} w={'80%'} >Voir mes randos</Button>
        <Button my={1} bg={'#bbb'} onPress={() => props.navigation.navigate("Friend")} w={'80%'} >Voir mes amis</Button>
        <Button mt={5} bg={'#bbb'} onPress={() => alert('Please make this page.')} w={'80%'} >Editer mes informations</Button>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
