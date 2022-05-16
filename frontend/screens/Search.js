import React, {useState} from 'react'
import {Platform} from 'react-native'

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
} from 'native-base'

function Search() {
  const [level, setLevel] = useState()
  const [date, setDate] = useState()
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hidePicker = () => {
    setDatePickerVisibility(false)
    setHourPickerVisibility(false)
  }

  return (
    <Box
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text h1 fontFamily='Roboto' fontSize={20}>
        Chercher une randonnée
      </Text>
      <Input placeholder='Ville / département / région'></Input>
      <HStack alignItems='center' space={4}>
        <Text>Rando mixte</Text>
        <Switch size='sm' />
      </HStack>
      <Input placeholder="Age de l'organisateur"></Input>

      {/* sélection de la date */}

      <Button
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

      <Button mt='1.5' w='100%' bg='#78E08F'>
        Rechercher
      </Button>

      <Box w='250' h='200' bg='#BBBBBB'>
        Map
      </Box>
    </Box>
  )
}

export default Search
