import React, { useState } from 'react'
import MapView from 'react-native-maps'
import { StyleSheet, TouchableOpacity, Alert } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import { Text, Input, Switch, Select, Button, ScrollView, View, Heading, HStack, VStack, Pressable, Box, } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import HamburgerMenu from '../components/HamburgerMenu'

function Search(props) {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [citie, setCitie] = useState({})
  const [listCities, setListCities] = useState([])
  const [age, setAge] = useState()
  const [mixte, setMixte] = useState(false)
  const [coord, setCoord] = useState({ lat: 48.856614, long: 2.3522219 })

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
        try {
          var result = await fetch(`https://geo.api.gouv.fr/communes?nom=${e}`)
          if (result.ok) {
            var response = await result.json()


            for (let item of response) {
              listCities.push({
                nom: item.nom,
                dpt: item.codeDepartement,
                codePostal: item.codesPostaux[0],
              })
            }
          } else {
            console.log('Problème de api du gouvernement')
          }
        } catch (error) {
          console.log(error)
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

  // **** feature abandonnée  **////
  // let listAgeDisplay = listAge.map((e, i) => (
  //   <Select.Item label={e.toString()} value={e.toString()} key={i} />
  // ))

  //***************************************** */


  var getSearch = function (data) {

    // ajout des données de recherche dans le reduceur
    props.addData(data)

    props.navigation.navigate('ResultSearch')

  }

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
      <HStack alignItems='center' justifyContent='space-between' style={{ borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
        <Box w={'20%'}>
          <HamburgerMenu navigation={props.navigation} />
        </Box>
        <Heading fontSize={18}> Chercher une randonnée </Heading>
        <Box w={'20%'} />
      </HStack>
      <LinearGradient colors={['#e3ffde', 'white']} style={styles.gradient} >
        <VStack
          mt={'3%'}
          space={1}
          style={{ alignItems: 'center', flex: 1 }}>


          {/* sélection de la ville */}
          <Input
            style={styles.allInput}
            mt='2'
            w='84%'
            h={8}
            shadow="9"
            placeholder='Ville / département'
            onChangeText={(e) => searchCities(e)}
            value={citie.nom}
          />
          {listCities.length >= 1 ? (
            <View style={{ width: '84%' }}>
              <ScrollView style={{ width: '100%', minHeight: '100%' }} >
                {listCities.map((e, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 1,
                      width: '100%',
                    }}
                    onPress={async () => {
                      setCitie(e)
                      // console.log(e)
                      setListCities([])

                      // si la longueur du CP>2 cela veut dire que ce n'est pas un département, on zoom donc sur la ville
                      if (e.codePostal.length > 2) {
                        try {
                          var result = await fetch(
                            `https://api-adresse.data.gouv.fr/search/?q=${e.nom}&limit=1`
                          )
                          var response = await result.json()
                          setCoord({
                            lat: response.features[0].geometry.coordinates[1],
                            long: response.features[0].geometry.coordinates[0],
                          })
                        } catch (error) {
                          console.log(error)
                        }
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

          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Switch
              m={0}
              p={0}
              offTrackColor='#C4C4C4'
              onTrackColor='#78E08F'
              size='md'
              onValueChange={() => {
                setMixte(!mixte)
                // console.log(mixte)
              }}
            />
            <Heading fontSize={20} fontWeight={'semibold'} mx={1} my={0} >Rando mixte </Heading>
            <Entypo
              name='info-with-circle'
              size={14}
              color='black'
              onPress={() =>
                Alert.alert(
                  'Randonnée mixte',
                  'Une rando mixte veut dire que les participants sont mixés.'
                )
              }
            />
          </Box>

          {/* sélection de la date */}
          <Pressable
            style={styles.allInputPressable}
            w='84%'
            h={8}
            variant='outline'
            mt='0.5'
            shadow="5"
            colorScheme='secondary'
            onPress={showDatePicker}>
            <Text
              style={{ marginLeft: 11, fontSize: 10, color: '#aaa', paddingVertical: 5 }}>
              {!date
                ? 'Date & Heure'
                : date.toLocaleDateString('fr') +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes()}
            </Text>
          </Pressable>

          <Select
            style={styles.allInputSelect}
            selectedValue={level}
            w={'84%'}
            height={8}
            fontSize={10}
            mt='0.5'
            shadow="5"
            bg='#EEEEEE'
            accessibilityLabel='Niveau'
            placeholder='Niveau'
            onValueChange={(itemValue) => setLevel(itemValue)}>
            <Select.Item label='Débutant' value='Débutant' />
            <Select.Item label='Amateur' value='Amateur' />
            <Select.Item label='Sportif' value='Sportif' />
            <Select.Item label='Expert' value='Expert' />
            <Select.Item label='Bouc' value='Bouc' />
          </Select>

          <Button
            style={styles.shadow}
            mt='3%'
            mb='1%'
            w={'84%'}
            h={10}
            bg='#78E08F'
            shadow="9"
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
      </LinearGradient>
      <StatusBar style='auto' />
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
    color: '#000',
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
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
    borderWidth: 10,
    borderColor: '#CCCCCC',
  },
  gradient: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    height: '100%',

  }
})

function mapDispatchToProps(dispatch) {
  return {
    addData: function (data) {
      dispatch({ type: 'addData', dataAdd: data })
    },
  }
}

export default connect(null, mapDispatchToProps)(Search)
