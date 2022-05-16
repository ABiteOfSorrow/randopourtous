import React, {useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, FlatList} from 'react-native'

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
} from 'native-base'

function Search() {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [citie, setCitie] = useState()
  const [listCities, setListCities] = useState([])

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hidePicker = () => {
    setDatePickerVisibility(false)
    setHourPickerVisibility(false)
  }

  const searchCities = async (e) => {
    setCitie(e)
    var result = await fetch(`https://geo.api.gouv.fr/communes?nom=${e}`)
    var response = await result.json()
    var listCities = response.map((e) => e.nom)
    setListCities([...listCities])
  }

  var listCitiesDisplay = (
    <FlatList data={listCities} renderItem={({item}) => <Text>{item}</Text>} />
  )

  console.log(listCities)

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

          // justifyContent: 'center',

          alignItems: 'center',
        }}>
        <Text h1 fontFamily='Roboto' fontSize={20}>
          Chercher une randonnée
        </Text>

        <Input
          style={styles.allInput}
          placeholder='Ville / département / région'
          onChangeText={(e) => searchCities(e)}
          value={citie}></Input>
        {listCitiesDisplay}

        <HStack alignItems='center' space={4}>
          <Text>Rando mixte</Text>
          <Switch size='sm' />
        </HStack>
        <Input
          style={styles.allInput}
          placeholder="Age de l'organisateur"></Input>

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

        <Button mt='2' w='100%' bg='#78E08F'>
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
    //height: 10,
    borderColor: '#CCCCCC',
  },
  map: {
    width: '100%',
    marginTop: 10,
    height: 200,
    borderWidth: 10,
    borderColor: '#CCCCCC',
  },
  container: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
  },
  libelle: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 350,
  },
})

export default Search
