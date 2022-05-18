import React, {useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, TouchableOpacity} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {connect} from 'react-redux'

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
    <SafeAreaView style={styles.mainContainer}>
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
        {listCities.length >= 1 ? (
          <View style={{height: 200, width: '100%'}}>
            <ScrollView>
              {listCities.map((e, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={async () => {
                    setCitie(e)
                    setListCities([])
                    // si la longueur du CP>2 cela veut dire que ce n'est pas un département, on zoom donc sur la ville
                    if (e.codePostal.length > 2) {
                      var result = await fetch(
                        `https://api-adresse.data.gouv.fr/search/?q=${e.nom}&limit=1`
                      )
                      var response = await result.json()

                      setCoord({
                        lat: response.features[0].geometry.coordinates[1],
                        long: response.features[0].geometry.coordinates[0],
                      })
                    }
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
          <Select.Item label='Débutant' value='Débutant' />
          <Select.Item label='Amateur' value='Amateur' />
          <Select.Item label='Sportif' value='Sportif' />
          <Select.Item label='Expert' value='Expert' />
          <Select.Item label='Bouc' value='Bouc' />
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
              date: date.toString(),
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
    </SafeAreaView>
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
    flex: 1,
    marginBottom: 72,
    borderWidth: 0.5,
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
