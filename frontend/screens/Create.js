
import React from 'react'
import {Button,Input,Text, HStack,VStack,Heading,Box,Switch} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "./HamburgerMenu";
import { StyleSheet,ScrollView } from "react-native";
import MapView from 'react-native-maps';

function Creat() {
    return (
        <SafeAreaView style={{ flex: 1}}>
         <HStack justifyContent="space-between" mb={4}>
          <HamburgerMenu />
          <Button
            w={90}
            h={8}
            p={0}
            mt={2}
            mr={2}
            variant="outline"
            borderColor="#38ADA9"
          >
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>

        <ScrollView>
        <VStack space={2} alignItems="center">
        <Heading size="md"> Créer une Randonnée </Heading>
        
            <Box display="flex" flexDirection="row" alignItems="center">
            <Switch offTrackColor="#C4C4C4" onTrackColor="#78E08F" />
            <Heading size="xs">Rando mixte</Heading>
            </Box>

            <Input style={styles.allInput} size="xs" placeholder="Nom de la randonnée" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Départ: Ville / département / région" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Arrivée: Ville / département / région" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Nombre max de personnes" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Date & Heure de la randonnée" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Description" w="100%" h="4.5%" maxWidth="330px" />
            <Input style={styles.allInput} size="xs" placeholder="Sportif & Expert" w="100%" h="4.5%" maxWidth="330px" />

            <Button style={styles.libelle}>Placez le point départ</Button>
            <VStack style={styles.container}>
                <MapView style={styles.map}>
                </MapView>
            </VStack>
            
            <Button w={170} h={10} bg="#78E08F">
                Créer
            </Button>
            
        </VStack>
        </ScrollView>
        </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    allInput: {
      backgroundColor: "#EEEEEE",
      borderWidth: 0.5,
      borderColor: "#CCCCCC",
    },
    map: {
        width: 350,
        height: 250,
        borderWidth: 10,
        borderColor: "#CCCCCC",
      },
    container: {
        borderWidth: 1.5,
        borderColor: "#CCCCCC",
    },
    libelle: {
        position: 'absolute',
        zIndex: 1,
        marginTop:350,
    }
  });

  export default Creat;