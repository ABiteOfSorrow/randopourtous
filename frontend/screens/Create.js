
import React, { useState } from 'react';
import { Button, Input, Text, HStack, VStack, Heading, Box, Switch, View, Pressable, Select } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { StyleSheet, ScrollView } from "react-native";
import MapView from 'react-native-maps';
import { connect } from 'react-redux';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

const backendAdress = '192.168.10.169'

function Create(props) {
   const [date, setDate] = useState();
   const [mixed, setMixed] = useState(false);
   const toggleSwitch = () => setMixed(previousState => !previousState); //fonction qui change la valeur du swicth
   const [randoName, setRandoName] = useState('');
   const [depart, setDepart] = useState('');
   const [estim_time, setEstimation] = useState('');
   const [maxRunner, setMaxRunner] = useState('');
   const [description, setDescription] = useState('');
   const [level, setLevel] = useState('Niveau Sportif');
   const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
   const [isHourPickerVisible, setHourPickerVisibility] = useState(false)

   let [language, setLanguage] = React.useState('key0');

   const showDatePicker = () => {
      setDatePickerVisibility(true)
   }

   const hidePicker = () => {
      setDatePickerVisibility(false)
      setHourPickerVisibility(false)
   }

   const handleSubmit = async () => {
      var randoData = { userToken: props.user.token, mixed: mixed, randoName: randoName, depart: depart, estim_time: estim_time, date: date, maxRunner: maxRunner, description: description, level: level }
      var randoInBDD = await fetch('http://' + backendAdress + ':3000/create-track', {
         method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: `randoData=${randoData}`
      });
      console.log("handle", randoData)
   }


   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <HStack justifyContent="space-between" mb={4}>
            <HamburgerMenu />
            <Button
               w={90}
               h={8}
               p={0}
               mt={2}
               mr={2}
               variant="outline"
               style={{ borderColor:"#38ADA9" }}
               
            >
               <Text fontSize="xs" bold style={{ color:"#38ADA9" }} >
                  Retour
               </Text>
            </Button>
         </HStack>

         <VStack space={2} style={{ alignItems: 'center', flex: 1, paddingBottom: 74 }}>
            <Heading size="md"> Créer une Randonnée </Heading>

            <Box display="flex" flexDirection="row" alignItems="center">
               <Switch offTrackColor="#C4C4C4" onTrackColor="#78E08F" onValueChange={toggleSwitch} value={mixed} />
               <Heading size="xs">Rando mixte</Heading>
            </Box>

            <Input style={styles.allInput} size="xs" placeholder="Nom de la randonnée" w="100%" h={8} maxWidth="330px" onChangeText={(e) => setRandoName(e)} />
            <Input style={styles.allInput} size="xs" placeholder="Ville de départ" w="100%" h={8} maxWidth="330px" onChangeText={(e) => setDepart(e)} />
            <Input style={styles.allInput} size="xs" placeholder="Estimation (en minutes) du temps de marche" w="100%" h={8} maxWidth="330px" onChangeText={(e) => setEstimation(e.replace(/[^0-9]/g, ''))} />

            <Input style={styles.allInput} size="xs" placeholder="Nombre max de personnes" w="100%" h={8} maxWidth="330px" onChangeText={(e) => setMaxRunner(e)} />
            <Pressable style={styles.allInputPressable} w='84%' h={8} onPress={showDatePicker}>
               <Text fontSize={10} style={{ marginLeft: 11, color:'#AAAAAA', marginTop: 5 }}>
                  {!date
                     ? 'Date & Heure'
                     : date.toLocaleDateString('fr') +
                     ' ' +
                     date.getHours() +
                     ':' +
                     date.getMinutes()}
               </Text>
            </Pressable>
            <Input style={styles.allInput} size="xs" placeholder="Description" w="100%" h={8} maxWidth="330px" onChangeText={(e) => setDescription(e)} />
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
               <Select style={styles.allInputSelect} placeholder={level} selectedValue={language} w={"330px"} height={8} fontSize={10} bg="#EEEEEE" onValueChange={(text) => setLevel(text)}>
                  <Select.Item label="Débutant" value="Débutant" />
                  <Select.Item label="Amateur" value="Amateur" />
                  <Select.Item label="Sportif" value="Sportif" />
                  <Select.Item label="Expert" value="Expert" />
               </Select>
            </View>

            <View style={styles.mapContainer}>
               <MapView style={styles.map}>
               </MapView>
               <Pressable style={styles.libelle} bg="#F5F5F5">
                  <Text fontSize={10} style={{ color: "#AAAAAA" }}>Placez le point de départ</Text>
               </Pressable>
            </View>

            <Button w={'80%'} h={10} bg="#78E08F" onPress={() => handleSubmit()}>Créer</Button>

         </VStack>

         <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode='date'
            date={date}
            onConfirm={(date) => {
               setDatePickerVisibility(false)
               setDate(date)
               setHourPickerVisibility(true)
            }}
            onCancel={hidePicker}
         />

         <DateTimePickerModal
            isVisible={isHourPickerVisible}
            mode='time'
            locale='fr-FR'
            date={date}
            onConfirm={(date) => {
               setHourPickerVisibility(false)
               setDate(date)
            }}
            onCancel={hidePicker}
         />


      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   allInput: {
      backgroundColor: "#EEEEEE",
      borderWidth: 0.5,
      borderColor: "#CCCCCC",
   },
   allInputPressable: {
      backgroundColor: "#EEEEEE",
      borderWidth: 1.1,
      borderColor: "#CCCCCC",
      borderRadius: 4,
   },
   mapContainer: {
      borderWidth: 1.5,
      borderColor: "#CCCCCC",
      flex: 1,
      minHeight: 150,
   },
   allInputSelect: {
      borderWidth: 0.5,
      borderColor: "#CCCCCC",
      backgroundColor: "#EEEEEE",
      borderRightWidth: 0,
   },
   map: {
      width: 350,
      height: '100%',
      borderWidth: 10,
      borderColor: "#CCCCCC",
   },
   container: {
      borderWidth: 1.5,
      borderColor: "#CCCCCC",
   },
   libelle: {
      position: 'absolute',
      top: -1.5,
      left: -1.5,
      borderColor: "#CCCCCC",
      borderWidth: 1.3,
      borderBottomRightRadius: 5,
      paddingTop: 1,
      paddingBottom: 1,
      paddingRight: 3,
      paddingLeft: 3,
   }
});

function mapStateToProps(state) {
   return {
      user: state.user
   }
}

export default connect(mapStateToProps, null)(Create);
