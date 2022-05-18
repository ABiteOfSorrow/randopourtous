
import React, { useState, useEffect } from 'react';
import { Button, Input, Text, HStack, VStack, Heading, Box, Switch, View, Pressable, Select } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
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
   const [thePOI, setThePOI] = useState([]);

   const [citie, setCitie] = useState({})
    const [listCities, setListCities] = useState([])
    const [coord, setCoord] = useState({ lat: 48.856614, long: 2.3522219 })

    // gestion de l'autocompletion des villes avec l'API du gouvernement
    const searchCities = async (e) => {
        setCitie(e)
        if (e.length >= 3) {
            var result = await fetch(`https://geo.api.gouv.fr/communes?nom=${e}`)
            var response = await result.json()
            let listCities = []
            for (let item of response) {
                listCities.push({
                    nom: item.nom,
                    dpt: item.codeDepartement,
                    codePostal: item.codesPostaux[0],
                })
            }
            setListCities([...listCities])
        } else {
            setListCities([])
        }
    }

   let [language, setLanguage] = React.useState('key0');

   const showDatePicker = () => {
      setDatePickerVisibility(true)
   }

   const hidePicker = () => {
      setDatePickerVisibility(false)
      setHourPickerVisibility(false)
   }

   const handleSubmit = async () => {
    console.log("handlesubmit",props.user.token)
    var randoData = { userToken: props.user.token, mixed: mixed, name: randoName, departure: citie, latitude: thePOI.coordinate.latitude, longitude: thePOI.coordinate.longitude, estim_time: estim_time, date: date, maxRunner: maxRunner, description: description, level: level }
    var randoInBDD = await fetch('http://' + backendAdress + ':3000/create-track', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(randoData)
    });
    var result = await randoInBDD.json();
    console.log(JSON.stringify(result))
 }

//    const handleSubmit = async () => {
//       var departure = {ville: depart, latitude: thePOI.coordinate.latitude, longitude: thePOI.coordinate.longitude}
//       var randoData = { userToken: props.user.token, mixed: mixed, randoName: randoName, departure: departure, estim_time: estim_time, date: date, maxRunner: maxRunner, description: description, level: level }
//       var randoInBDD = await fetch('http://' + backendAdress + ':3000/create-track', {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//          body: `randoData=${randoData}`
//       });
//       console.log("handle", randoData)
//    }

   const addPress = async (nativeEvent) => {
    console.log(nativeEvent)
    setThePOI(nativeEvent)
    console.log("tehPOI",thePOI)
    }

var trackMarker = () => {
    if(thePOI.length != 0){
    return(<Marker pinColor='#78E08F' coordinate={{latitude: thePOI.coordinate.latitude, longitude: thePOI.coordinate.longitude}}/>);
    }
    else{
    return (<></>)
    }
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
            <Input style={styles.allInput} size="xs" placeholder="Ville de départ" w="100%" h={8} maxWidth="330px"   value={citie.nom} onChangeText={(e) => searchCities(e)} />
            {listCities.length > 1 ? (
                    <View style={{ height: 200, width: '100%' }}>
                        <ScrollView>
                            {listCities.map((e, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={{ backgroundColor: '#FFFFFF', width: '100%' }}
                                    onPress={async () => {
                                        setCitie(e)
                                        setListCities([])
                                        var result = await fetch(
                                            `https://api-adresse.data.gouv.fr/search/?q=${e.nom}&limit=1`
                                        )
                                        var response = await result.json()
                                        setCoord({
                                            lat: response.features[0].geometry.coordinates[1],
                                            long: response.features[0].geometry.coordinates[0],
                                        })
                                    }}>
                                    <Text key={i}>{e.nom + ' (' + e.codePostal + ')'}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    null
                )}
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
                  <Select.Item label="Bouc" value="Bouc" />
               </Select>
            </View>

            <View style={styles.mapContainer}>
            <MapView style={styles.map}  onPress={e => addPress(e.nativeEvent)}
                        initialRegion={{
                        latitude: coord.lat,
                        longitude: coord.long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                        region={{
                            latitude: coord.lat,
                            longitude: coord.long,
                            latitudeDelta: 0.0992,
                            longitudeDelta: 0.0421,
                        }}>
                    {trackMarker()}
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
