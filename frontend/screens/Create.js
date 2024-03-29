import React, { useState } from 'react'
import { Button, Input, Text, HStack, VStack, Heading, Box, Switch, View, Pressable, Select } from 'native-base'
import { SafeAreaView } from 'react-native-safe-area-context'
import HamburgerMenu from '../components/HamburgerMenu'
import { StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { connect } from 'react-redux'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import backendConfig from '../backend.config.json'
const backendAdress = backendConfig.address

function Create(props) {
  const [date, setDate] = useState()
  const [mixed, setMixed] = useState(false)
  const toggleSwitch = () => setMixed((previousState) => !previousState) //fonction qui change la valeur du swicth
  const [randoName, setRandoName] = useState('')
  const [estim_time, setEstimation] = useState('')
  const [maxRunner, setMaxRunner] = useState('')
  const [description, setDescription] = useState('')
  const [level, setLevel] = useState('Niveau Sportif')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false)
  const [thePOI, setThePOI] = useState({})

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
  //Fonction d'ouverture du pop up d'entre de la date
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  //Fonction de fermeture du pop up d'entre de la date
  const hidePicker = () => {
    setDatePickerVisibility(false)
    setHourPickerVisibility(false)
  }
  //Fonction d'envois de formulaire
  const handleSubmit = async () => {
    //Sécurité si oublie d'entrer la location de la rando
    if (!thePOI.coordinate) {
      Alert.alert('Attention', 'Placez le point de départ sur la carte.')
      return
    }
    if (!date) {
      Alert.alert('Attention','Veuillez entrer une date.')
    }
    let coordinate = thePOI.coordinate
    var randoData = {
      token: props.user.token,
      mixed: mixed,
      name: randoName,
      departure: citie,
      coordinate: coordinate,
      estimation_time: estim_time,
      users: props.user._id,
      date,
      maxRunner,
      description,
      level,
    }
    //Envois au router sécurisé
    try {
      let rawresponse = await fetch(backendAdress + '/create-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(randoData),
      })
      if (rawresponse.ok) {
        var result = await rawresponse.json();
        var rando = result.rando
        //console.log('rando sauvergardée: ', rando)

        if (result.result) { // Tout se passe bien
          props.setUser(result.user)

          Alert.alert('Succès', 'Merci! Votre randonnée a été créée.')
          props.navigation.navigate('Randos', { screen: 'Chat', params: { rando } })
        } else {
          Alert.alert('Erreur','Une erreur est survenue. Le serveur a mal répondu.')
          // console.log(JSON.stringify(result))
        }
      } else {
        Alert.alert('Erreur','Le serveur ne répond pas.')
      }
    } catch (e) {
      console.log(e)
    }
  }
  //Fontion recupère les infos du press listener sur la carte
  const addPress = async (nativeEvent) => {
    //console.log(nativeEvent)
    setThePOI(nativeEvent)
    //console.log('thePOI', thePOI)
  }
  //Marqueur de map appelé sur le map view
  var trackMarker = () => {
    if (thePOI.coordinate) {
      return (
        <Marker
          pinColor='#78E08F'
          coordinate={{
            latitude: thePOI.coordinate.latitude,
            longitude: thePOI.coordinate.longitude,
          }}
        />
      )
    } else {
      return <></>
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, width: '100%', backgroundColor: '#fff' }}>
      {/* l'entête/header */}
      <HStack justifyContent='space-between' mb={1}>
        <HamburgerMenu navigation={props.navigation} />
        <Button
          w={90}
          h={8}
          p={0}
          mt={2}
          mr={2}
          variant='outline'
          style={{ borderColor: '#38ADA9' }}
          onPress={() => props.navigation.goBack()}>
          <Text fontSize='xs' style={{ color: '#38ADA9', fontWeight: 'bold' }}>
            Retour
          </Text>
        </Button>
      </HStack>

      {/* Le body */}
      <VStack space={1} style={{ alignItems: 'center', flex: 1, width: '100%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          {' '}
          Créer une Randonnée{' '}
        </Text>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <Switch
            offTrackColor='#C4C4C4'
            onTrackColor='#78E08F'
            onValueChange={toggleSwitch}
            value={mixed}
          />
          <Heading size='xs'>Rando mixte</Heading>
        </Box>

        <Input
          style={styles.allInput}
          size='xs'
          placeholder='Nom de la randonnée'
          w='84%'
          h={8}
          shadow="9" 
          onChangeText={(e) => setRandoName(e)}
        />
        <Input
          style={styles.allInput}
          size='xs'
          placeholder='Ville de départ'
          w='84%'
          h={8}
          shadow="9" 
          value={citie.nom}
          onChangeText={(e) => searchCities(e)}
        />
        {listCities.length > 1 ? (
          <View
            style={{
              width: '84%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              maxHeight: '30%',
            }}>
            {/* Menu déroulant pour la selection de la ville */}
            <ScrollView
              style={{
                width: '100%',
                maxHeight: '100%',
              }}
              contentContainerStyle={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              {listCities.map((e, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    paddingVertical: 1,
                    paddingHorizontal: 4,
                  }}
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
        ) : null}

        {/* Les 2 input avec une expression rationnelles (replace) pour un "number only" */}
        <Input
          style={styles.allInput}
          size='xs'
          placeholder='Estimation (en minutes) du temps de marche'
          value={estim_time}
          w='84%'
          h={8}
          shadow="9" 
          onChangeText={(e) => setEstimation(e.replace(/[^0-9]/g, ''))}
        />
        <Input
          style={styles.allInput}
          size='xs'
          placeholder='Nombre max de personnes'
          value={maxRunner}
          w='84%'
          h={8}
          shadow="9" 
          onChangeText={(e) => setMaxRunner(e.replace(/[^0-9]/g, ''))}
        />

        {/* Fake input avec pop up d'entré de date */}
        <Pressable
          style={styles.allInputPressable}
          w='84%'
          h={8}
          shadow="9" 
          onPress={showDatePicker}>
          <Text
            fontSize={10}
            style={{
              marginLeft: 11,
              color: 'black',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            {!date
              ? 'Date & Heure'
              : date.toLocaleDateString('fr') +
              ' ' +
              date.getHours() +
              ':' +
              date.getMinutes()}
          </Text>
        </Pressable>

        <Input
          style={styles.allInput}
          size='xs'
          placeholder='Description'
          w='84%'
          h={8}
          shadow="9" 
          onChangeText={(e) => setDescription(e)}
        />

        {/* Sélection de niveau */}
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Select
            style={styles.allInputSelect}
            placeholder={level}
            selectedValue={level}
            minWidth={'84%'}
            height={8}
            shadow="9" 
            fontSize={10}
            bg='#EEEEEE'
            onValueChange={(text) => setLevel(text)}>
            <Select.Item label='Débutant' value='Débutant' />
            <Select.Item label='Amateur' value='Amateur' />
            <Select.Item label='Sportif' value='Sportif' />
            <Select.Item label='Expert' value='Expert' />
            <Select.Item label='Bouc' value='Bouc' />
          </Select>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            onPress={(e) => addPress(e.nativeEvent)}
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
          <Pressable style={styles.libelle} bg='#F5F5F5'>
            <Text fontSize={10} style={{ color: '#AAAAAA' }}>
              Placez le point de départ
            </Text>
          </Pressable>
        </View>

        <Button w={'84%'} h={10} mb={2} bg='#78E08F' shadow="9" onPress={() => handleSubmit()}>
          Créer
        </Button>
      </VStack>

      {/* Les 2 pop up date et heure (à ne pas mettre plus haut pour éviter de déranger le visuel) */}
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
  )
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: '#EEEEEE',
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
    color: '#000',
  },
  allInputPressable: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1.1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
  },
  mapContainer: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    flex: 1,
  },
  allInputSelect: {
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#EEEEEE',
    borderRightWidth: 0,
    color: '#000',
  },
  map: {
    width: 350,
    height: '100%',
    borderWidth: 10,
    borderColor: '#CCCCCC',
  },
  container: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
  },
  libelle: {
    position: 'absolute',
    top: -1.5,
    left: -1.5,
    borderColor: '#CCCCCC',
    borderWidth: 1.3,
    borderBottomRightRadius: 5,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 3,
    paddingLeft: 3,
  },
})

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: function (user) {
      dispatch({ type: "USER_LOGIN", user: user })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Create)
