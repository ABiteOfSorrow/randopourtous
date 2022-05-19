import React, { useState } from 'react'
import MapView from 'react-native-maps'
import { StyleSheet, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { connect } from 'react-redux'
import HamburgerMenu from "../components/HamburgerMenu";

import { Entypo } from '@expo/vector-icons';

import { Text, Input, Switch, Select, Button, CheckIcon, ScrollView, View, Heading, HStack, VStack, Pressable, Box } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'

function Search(props) {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [citie, setCitie] = useState({})
  const [listCities, setListCities] = useState([])
  const [age, setAge] = useState()
  const [mixte, setMixte] = useState(false)
  const [coord, setCoord] = useState({lat: 48.856614, long: 2.3522219})

  // Type de localisation: ville ou département
  const [typeLocalisation, setTypeLocalisation] = useState()

  // gestion du date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hidePicker = () => {
    setDatePickerVisibility(false)
    setHourPickerVisibility(false)
  }

  //************************* */

  // gestion de l'autocompletion des villes avec l'API du gouvernement
  const searchCities = async (e) => {
    setCitie(e)
    let listCities = []
    // console.log(typeof parseInt(e))
    if (isNaN(e)) {
      if (e.length > 3) {
        var result = await fetch(`https://geo.api.gouv.fr/communes?nom=${e}`)
        var response = await result.json()

        for (let item of response) {
          listCities.push({
            nom: item.nom,
            dpt: item.codeDepartement,
            codePostal: item.codesPostaux[0],
          })
        }
      }
    } else {
      var result = await fetch(
        `https://geo.api.gouv.fr/departements?code=${parseInt(e)}`
      )
      var response = await result.json()
      for (let item of response) {
        listCities.push({
          nom: item.nom,
          dpt: item.code,
          codePostal: `${item.code}`,
        })
      }
    }
    setListCities([...listCities])
  }

  //*************************************** */

  // initialisation de la liste déroulante des ages
  let listAge = []
  for (let i = 18; i < 99; i++) {
    listAge.push(i)
  }

  let listAgeDisplay = listAge.map((e, i) => (
    <Select.Item label={e.toString()} value={e.toString()} key={i} />
  ))

  //***************************************** */

  var getSearch = function (data) {
    // ajout des données de recherche dans le reduceur
    props.addData(data)

    props.navigation.navigate('ResultSearch')

    console.log('donnees: ', data)
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
          style={{ borderColor: "#38ADA9" }}
          onPress={() => props.navigation.goBack()}
        >
          <Text fontSize="xs" bold style={{ color: "#38ADA9" }} >
            Retour
          </Text>
        </Button>
      </HStack>

      <VStack space={2} style={{ alignItems: 'center', flex: 1, paddingBottom: 74 }}>
        <Heading size="md"> Chercher une randonnée </Heading>

        {/* sélection de la ville */}
        <Input style={styles.allInput} mt='2' w='100%' h={8} maxWidth="330px" placeholder='Ville / département' onChangeText={(e) => searchCities(e)} value={citie.nom} />
        {listCities.length >= 1 ? (
          <View style={{ height: 200, width: '100%' }}>
            <ScrollView>
              {listCities.map((e, i) => (
                <TouchableOpacity key={i} onPress={async () => {
                  setCitie(e)
                  console.log(e)
                  setListCities([])

                  // si la longueur du CP>2 cela veut dire que ce n'est pas un département, on zoom donc sur la ville
                  if (e.codePostal.length > 2) {
                    var result = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${e.nom}&limit=1`)
                    var response = await result.json()
                    setCoord({ lat: response.features[0].geometry.coordinates[1], long: response.features[0].geometry.coordinates[0], })
                  }
                }}>
                  <Text key={i}>{e.nom + ' (' + e.codePostal + ')'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <></>
        )}

        <Box display="flex" flexDirection="row" alignItems="center">
          <Switch mt={0} pt={0} marginTop='0' paddingTop={0} offTrackColor='#C4C4C4' onTrackColor='#78E08F' size='lg'
            onValueChange={() => {
              setMixte(!mixte)
              console.log(mixte)
            }}
          />
          <Heading size='md' mb='1.5'>Rando mixte </Heading><Entypo name="info-with-circle" style={{ paddingBottom:13 }} size={10} color="black" />
        </Box>

        {/* sélection de l'age */}
        <Select style={styles.allInputSelect} selectedValue={age} w={"330px"} height={8} fontSize={10} bg="#EEEEEE" accessibilityLabel='age' placeholder="Âge de l'organisateur" onValueChange={(itemValue) => setAge(itemValue)}
          _selectedItem={{
            endIcon: <CheckIcon size='5' />,
          }}>
          {listAgeDisplay}
        </Select>

        {/* sélection de la date */}
        <Pressable style={styles.allInputPressable} w='84%' h={8} variant='outline' mt='1.5' colorScheme='secondary' onPress={showDatePicker}>
          <Text fontSize={10} style={{ marginLeft: 11, color: '#000', marginTop: 5 }}>
            {!date
              ? 'Date & Heure'
              : date.toLocaleDateString('fr') +
              ' ' +
              date.getHours() +
              ':' +
              date.getMinutes()}
          </Text>
        </Pressable>

        <Select style={styles.allInputSelect} selectedValue={level} w={"330px"} height={8} fontSize={10} mt='1' bg="#EEEEEE" accessibilityLabel='Niveau' placeholder='Niveau' onValueChange={(itemValue) => setLevel(itemValue)}>
          <Select.Item label='Facile' value='facile' />
          <Select.Item label='Intermédiaire' value='intermediaire' />
          <Select.Item label='Difficile' value='difficile' />
        </Select>

        <Button style={styles.shadow} mt='1.5' mb='8'  w={'84%'} h={10} bg="#78E08F"
          onPress={() => {
            let sendObject = {
              ville: citie,
              mixte: mixte,
              age: age,
              date: date ? date.toString() : undefined,
              niveau: level,
            }
            getSearch(sendObject)
          }}>
          Rechercher
        </Button>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
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
            }}></MapView>
          </View>

      </VStack>
      
      <DateTimePickerModal isVisible={isDatePickerVisible} mode='date' date={date}
          onConfirm={(date) => {
            setDatePickerVisibility(false)
            setDate(date)
            setHourPickerVisibility(true)
          }}
          onCancel={hidePicker}
        />
        <DateTimePickerModal isVisible={isHourPickerVisible} mode='time' locale='fr-FR' date={date}
          onConfirm={(date) => {
            setHourPickerVisibility(false)
            setDate(date)
          }}
          onCancel={hidePicker}
        />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: '#EEEEEE',
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
  },
  allInputPressable: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1.1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
  },
  allInputSelect: {
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#EEEEEE',
    borderRightWidth: 0,
    color: '#000'
 },
  secondContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
  },

  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 5,
  },
  mapContainer: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    flex: 1,
    minHeight: 150,
 },
  map: {
    width: 350,
    height: '100%',
    borderWidth: 10,
    borderColor: '#CCCCCC',
 },
})

function mapDispatchToProps(dispatch) {
  return {
    addData: function (data) {
      dispatch({type: 'addData', dataAdd: data})
    },
  }
}

export default connect(null, mapDispatchToProps)(Search)
