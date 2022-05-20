import React, {useEffect, useState} from 'react'
import {
  HStack,
  VStack,
  Center,
  Heading,
  Box,
  Button,
  Text,
  Switch,
  View,
} from 'native-base'
import {StyleSheet, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import HamburgerMenu from '../components/HamburgerMenu'
import {connect} from 'react-redux'
import backendConfig from '../backend.config.json'
import MapView, {Marker, Callout} from 'react-native-maps'

const backendAdress = backendConfig.address

function ResultSearch(props) {
  //****** state de récupération des résultats de recherche */
  const [resultSearch, setResultSearch] = useState([])

  //*** state de l'affichage de la carte (changement d'état avec le switch) */
  const [mapdisplay, setMapDisplay] = useState(false)
  const [mapConfig, setMapConfig] = useState()

  //**** iniatilisation de la liste des résultat de recherche via requête dans la BDD */
  useEffect(() => {
    var searchFunction = async function () {
      let result = await fetch(backendAdress + '/search-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.data),
      })

      let response = await result.json()
      setResultSearch([...response.result])

      //*** initialisation du zoom de la carte en fonction des paramètres de recherche */

      //**** si ville dans le champe de recherche (reducer) alors on zoom sur la ville */

      //**** si département, récupération de la première rando de la liste et zoom sur ses coordonnée */

      //**** zoom sur la france sinon */

      let mapSetUp
      if (props.data.ville.codePostal.length === 2) {
        mapSetUp = {
          latitude: response.result[0].coordinate.latitude,
          longitude: response.result[0].coordinate.longitude,
          latitudeDelta: 1.5,
          longitudeDelta: 1,
        }
      } else if (props.data.ville.nom) {
        console.log('Affichage echelle ville')
        let resultGouv = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${props.data.ville.codePostal}&limit=1`
        )
        var responseGouv = await resultGouv.json()
        mapSetUp = {
          latitude: responseGouv.features[0].geometry.coordinates[1],
          longitude: responseGouv.features[0].geometry.coordinates[0],
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      } else {
        mapSetUp = {
          latitude: 46.22,
          longitude: 2.21,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }
      }
      setMapConfig(mapSetUp)
    }

    searchFunction()
  }, [])

  let listRando
  //**** si pas de résultats, affichage d'une message d'erreur, sinon affichage de la liste des randos */
  if (resultSearch.length === 0) {
    listRando = (
      <Heading size='lg' mb={5} textAlign='center'>
        pas de Resultat
      </Heading>
    )
  } else {
    listRando = resultSearch.map((item, i) => (

      <VStack key={i} space={2} alignItems='center'>
        <Box w={'75%'} mb={0} borderRadius='15' bg='#78E08F'>
          <Heading size='md' textAlign='center'>
            {item.name}
          </Heading>
        </Box>
        <Center
          w={'80%'}
          h={62}
          p={0}
          mb={2}
          bg='#FAFAFA'
          rounded='lg'
          shadow={8}
          display='flex'
          flexDirection='row'
          justifyContent='space-around'>
          <Heading size='md'>{item.departure.nom}</Heading>

          <VStack space={2} alignItems='flex-start'>
            <Text fontSize='sm' bold>
              {item.level}
            </Text>
            <Text fontSize='sm' bold>
              5 / 12 particpants
            </Text>
          </VStack>
          <Button
            size='md'
            backgroundColor='#78E08F'
            alignSelf='center'
            onPress={() => props.navigation.navigate('Detail', {item})}>
            <Text style={styles.contentText} fontSize='md'>
              Voir
            </Text>
          </Button>
        </Center>
      </VStack>

    ))
  }

  //****** initialisation de la liste des markers de randonnées */

  var displayListPosition = resultSearch.map((e, i) => (
    <Marker
      key={i}
      pinColor='green'
      coordinate={{
        latitude: e.coordinate.latitude,
        longitude: e.coordinate.longitude,
      }}
      title={e.name}
      //*** Redirection vers la page du détail de la rando avec la rando en paramètre */
      
      description={e.description + '\n Press to view'}>
      <MapView.Callout onPress={() => props.navigation.navigate('Detail', {e})}>
        <View style={styles.callout}>
          <Heading>{e.name}</Heading>
          <Text>{e.description}</Text>
          <Button
            size='md'
            backgroundColor='#78E08F'
            alignSelf='center'
            >
            <Text style={styles.contentText} fontSize='md'>
              Voir
            </Text>
          </Button>
        </View>
      </MapView.Callout>
    </Marker>
  ))

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flex: 1,
        }}>
        <HStack justifyContent='space-between' mb={4}>
          <HamburgerMenu />
          <Button
            w={90}
            h={8}
            p={0}
            mt={2}
            mr={2}
            variant='outline'
            borderColor='#38ADA9'
            onPress={() => props.navigation.goBack()}>
            <Text fontSize='xs' bold color='#38ADA9'>
              Retour
            </Text>
          </Button>
        </HStack>
        {/* List Body */}
        <VStack space={2} alignItems='center'>
          <Heading size='lg' mb={5}>
            Resultat de la recherche
          </Heading>
          {/* Switch Line */}
          <Box display='flex' flexDirection='row' alignItems='center' mb={5}>
            <Switch
              offTrackColor='#C4C4C4'
              onTrackColor='#78E08F'
              mr={4}
              onValueChange={setMapDisplay}
            />
            <Heading size='md'>Vue carte</Heading>
          </Box>
        </VStack>

        {/* Journey List */}

        {mapdisplay === false ? (<ScrollView>
          {listRando}

        </ScrollView>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              //onPress={(e) => addPress(e.nativeEvent)}
              initialRegion={mapConfig}>
              {displayListPosition}
            </MapView>
          </View>
        )}
      </View>
      {/* To prevent leaving the content area */}
      {/* <Box w='100%' h='8.5%' alignSelf='center' bg='#fff' /> */}
    </SafeAreaView>
  )
}

//***** styles */

const styles = StyleSheet.create({
  contentText: {
    color: 'white',
  },
  map: {
    flex: 1,
    width: 350,
    height: '100%',
    borderWidth: 10,
    borderColor: '#CCCCCC',
  },
  mapContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    minHeight: 150,
  },
  callout: {
    flex: 1,
    // width: 150,
    height: 100,
    alignItems: 'center',
  },
})

//**** réduceur */

function mapStateToProps(state) {
  return {
    data: state.searchData,
  }
}

export default connect(mapStateToProps, null)(ResultSearch)
