import React, {useState} from 'react'
import MapView from 'react-native-maps'
import {StyleSheet, TouchableOpacity, Viex} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AutoComplete from 'react-native-autocomplete-input'
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
} from "native-base";

function Search() {
  const [level, setLevel] = useState();
  const [date, setDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false);
  const [citie, setCitie] = useState();
  const [listCities, setListCities] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hidePicker = () => {
    setDatePickerVisibility(false);
    setHourPickerVisibility(false);
  };

  const searchCities = async (e) => {
    setCitie(e)
    if (e.length > 3) {
      var result = await fetch(`https://geo.api.gouv.fr/communes?nom=${e}`)
      var response = await result.json()
      //console.log(response)
      let listCities = []
      for (item of response) {
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

  return (
    <KeyboardAwareScrollView>
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

          <AutoComplete
            containerStyle={{flex: 1, width: '100%'}}
            autoCorrect={false}
            placeholder='Ville / département / région'
            data={listCities}
            onChangeText={(e) => searchCities(e)}
            value={citie}
            listStyle={styles.itemText}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              renderItem: ({item}) => (
                <TouchableOpacity
                  style={{backgroundColor: '#FFFFFF'}}
                  onPress={() => {
                    setCitie(item.nom)
                    setListCities()
                  }}>
                  <Text>{item.nom + ' (' + item.codePostal + ')'}</Text>
                </TouchableOpacity>
              ),
            }}
          />

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
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: "#EEEEEE",
    borderWidth: 0.5,
    zindex: -1,
    zIndex: 0,

    borderColor: '#CCCCCC',
  },
  map: {
    width: "100%",
    marginTop: 10,
    height: 200,
    borderWidth: 10,
    borderColor: "#CCCCCC",
  },
  completeContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
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
});

export default Search;
