import React, {useEffect, useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, TouchableOpacity} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  Text,
  Input,
  Switch,
  Select,
  Button,
  CheckIcon,
  ScrollView,
  View,
  Heading,
  HStack,
} from 'native-base'
import {SafeAreaView} from 'react-native-safe-area-context'

function Search() {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [citie, setCitie] = useState({})
  const [listCities, setListCities] = useState([])
  const [age, setAge] = useState()
  const [mixte, setMixte] = useState(false)
  const [coord, setCoord] = useState({lat: 48.856614, long: 2.3522219})
  const [map, setMap] = useState()

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
    if (e.length > 3) {
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

  var getSearch = function (data) {}

  return (
    <View style={styles.mainContainer}>
      <View style={styles.secondContainer}>
        <Text h1 fontFamily='Roboto' fontSize={20}>
          Chercher une randonnée
        </Text>
        {/* sélection de la ville */}
        <Input
          style={styles.allInput}
          mt='1.5'
          placeholder='Ville / département'
          onChangeText={(e) => searchCities(e)}
          value={citie.nom}></Input>
        {listCities.length > 1 ? (
          <View style={{height: 200, width: '100%'}}>
            <ScrollView>
              {listCities.map((e, i) => (
                <TouchableOpacity
                  key={i}
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
          <Text></Text>
        )}

        <HStack alignItems='center'>
          <Heading size='xs'>Rando mixte</Heading>
          <Switch
            mt={0}
            pt={0}
            marginTop='0'
            paddingTop={0}
            offTrackColor='#C4C4C4'
            onTrackColor='#78E08F'
            size='lg'
            onValueChange={() => {
              setMixte(!mixte)
              console.log(mixte)
            }}
          />
        </HStack>

        {/* sélection de l'age */}
        <Select
          selectedValue={age}
          bgColor='#EEEEEE'
          w='100%'
          accessibilityLabel='age'
          placeholder="Age de l'organisateur"
          _selectedItem={{
            endIcon: <CheckIcon size='5' />,
          }}
          mt='1.5'
          onValueChange={(itemValue) => setAge(itemValue)}>
          {listAgeDisplay}
        </Select>
        {/* sélection de la date */}
        <Button
          style={styles.allInput}
          variant='outline'
          mt='1.5'
          w='100%'
          colorScheme='secondary'
          onPress={showDatePicker}>
          <Text color='grey'>
            {!date
              ? 'Date & Heure'
              : date.toLocaleDateString('fr') +
                ' ' +
                date.getHours() +
                ':' +
                date.getMinutes()}
          </Text>
        </Button>
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
        <Select
          selectedValue={level}
          bgColor='#EEEEEE'
          w='100%'
          accessibilityLabel='Niveau'
          placeholder='Niveau'
          mt='1.5'
          onValueChange={(itemValue) => setLevel(itemValue)}>
          <Select.Item label='Facile' value='facile' />
          <Select.Item label='Intermédiaire' value='intermediaire' />
          <Select.Item label='Difficile' value='difficile' />
        </Select>
        <Button
          style={styles.shadow}
          mt='1.5'
          w='100%'
          bg='#78E08F'
          onPress={() => {
            let sendObject = {
              ville: citie,
              mixte: mixte,
              age: age,
              date: date,
              niveau: level,
            }
            getSearch(sendObject)
          }}>
          Rechercher
        </Button>

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
    </View>
  )
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: '#EEEEEE',
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
  },

  mainContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
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

  map: {
    width: '100%',
    marginTop: 10,
    height: 170,
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
  },
})

export default Search
