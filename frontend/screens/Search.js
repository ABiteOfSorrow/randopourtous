import React, {useEffect, useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, TouchableOpacity} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  Box,
  Text,
  Input,
  HStack,
  Switch,
  Select,
  Button,
  CheckIcon,
  ScrollView,
  View,
} from 'native-base'
import {SafeAreaView} from 'react-native-safe-area-context'

function Search() {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [citie, setCitie] = useState()
  const [listCities, setListCities] = useState([])
  const [age, setAge] = useState()
  const [mixte, setMixte] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hidePicker = () => {
    setDatePickerVisibility(false)
    setHourPickerVisibility(false)
  }

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

  let listAge = []
  for (let i = 18; i < 99; i++) {
    listAge.push(i)
  }

  let listAgeDisplay = listAge.map((e, i) => (
    <Select.Item label={e.toString()} value={e.toString()} key={i} />
  ))

  var getSearch = function (data) {}

  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        marginTop: 25,
      }}>
      <Box
        style={{
          flex: 1,
          width: '90%',
          alignItems: 'center',
        }}>
        <Text h1 fontFamily='Roboto' fontSize={20}>
          Chercher une randonnée
        </Text>

        {/* sélection de la ville */}
        <Input
          placeholder='Ville / département'
          onChangeText={(e) => searchCities(e)}
          value={citie}></Input>
        {listCities.length > 1 ? (
          <View style={{height: 200, width: '100%'}}>
            <ScrollView>
              {listCities.map((e, i) => (
                <TouchableOpacity
                  key={i}
                  style={{backgroundColor: '#FFFFFF', width: '100%'}}
                  onPress={() => {
                    setCitie(e.nom)
                    setListCities([])
                  }}>
                  <Text key={i}>{e.nom + ' (' + e.codePostal + ')'}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text></Text>
        )}

        <HStack alignItems='center' space={4}>
          <Text>Rando mixte</Text>
          <Switch
            size='sm'
            onValueChange={() => {
              setMixte(!mixte)
              console.log(mixte)
            }}
          />
        </HStack>

        {/* sélection de l'age */}

        <Select
          selectedValue={age}
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
          mt='2'
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
          w='100%'
          accessibilityLabel='Niveau'
          placeholder='Niveau'
          _selectedItem={{
            endIcon: <CheckIcon size='5' />,
          }}
          mt='1.5'
          onValueChange={(itemValue) => setLevel(itemValue)}>
          <Select.Item label='Facile' value='facile' />
          <Select.Item label='Intermédiaire' value='intermediaire' />
          <Select.Item label='Difficile' value='difficile' />
        </Select>

        <Button
          mt='2'
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
        <MapView style={styles.map}></MapView>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: '#EEEEEE',
    borderWidth: 0.5,
    zindex: -1,
    zIndex: 0,

    borderColor: '#CCCCCC',
  },
  map: {
    width: '100%',
    marginTop: 10,
    height: 200,
    borderWidth: 10,
    borderColor: '#CCCCCC',
  },
  completeContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    zindex: 1,
  },
  comlete: {
    width: '100%',
    position: 'absolute',
    zIndex: 3,
  },
  itemText: {
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    height: 25,
    zIndex: -1,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
})

export default Search
