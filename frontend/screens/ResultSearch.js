import React, { useEffect, useState } from 'react'
import { HStack, VStack, Center, Heading, Box, Button, Text, Switch, View, Spinner } from 'native-base'
import { StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HamburgerMenu from '../components/HamburgerMenu'
import { connect } from 'react-redux'
import backendConfig from '../backend.config.json'
import MapView, { Marker, Callout } from 'react-native-maps'
import { StatusBar } from 'expo-status-bar'

const backendAdress = backendConfig.address

function ResultSearch(props) {
  //****** state de récupération des résultats de recherche */
  const [resultSearch, setResultSearch] = useState([])

  //*** state de l'affichage de la carte (changement d'état avec le switch) */
  const [mapdisplay, setMapDisplay] = useState(false)
  const [mapConfig, setMapConfig] = useState()
  const [searchStatus, setSerchStatus]=useState(false)

  //**** iniatilisation de la liste des résultat de recherche via requête dans la BDD */
  useEffect(() => {
    var searchFunction = async function () {
      try {
        let result = await fetch(backendAdress + '/search-track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(props.data),
        })
        if (!result.ok) {
          Alert.alert('Erreur', 'Problème de connexion au serveur')
          return;
        }
        let response = await result.json()
        if (response.success === true) {
          // console.log(response.success)
          setResultSearch([...response.result])
          setSerchStatus(true)

          //*** initialisation du zoom de la carte en fonction des paramètres de recherche */

          //**** si ville dans le champe de recherche (reducer) alors on zoom sur la ville */

          //**** si département, récupération de la première rando de la liste et zoom sur ses coordonnée */

          let mapSetUp

          if (props.data.ville.codePostal !== undefined) {

            if (props.data.ville.codePostal.length === 2) {
              //*******affichage à l'échelle du département */
              mapSetUp = {
                latitude: response.result[0].coordinate.latitude,
                longitude: response.result[0].coordinate.longitude,
                latitudeDelta: 1.5,
                longitudeDelta: 1,
              }
            } else {
              //******* Affichage à l'échelle d'une ville */
              let resultGouv = await fetch(
                `https://api-adresse.data.gouv.fr/search/?q=${props.data.ville.codePostal}&limit=1`
              )
              if (!resultGouv.ok) {
                Alert.alert('Erreur', 'Problème de connexion au serveur du gouvernement.')
                return;
              }
              var responseGouv = await resultGouv.json()
              mapSetUp = {
                latitude: responseGouv.features[0].geometry.coordinates[1],
                longitude: responseGouv.features[0].geometry.coordinates[0],
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            }
          } else {
            //******* Affichage à l'échelle du pays */
            mapSetUp = {
              latitude: 46.22,
              longitude: 2.21,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }
          }
          setMapConfig(mapSetUp)
        } else {
          console.log(JSON.stringify(response))
          setSerchStatus(true)
        }
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue')
        console.log(error)
      }
    }

    searchFunction()
  }, [props.data])

  let listRando
  //**** si pas de résultats, affichage d'une message d'erreur, sinon affichage de la liste des randos */
  if (resultSearch.length === 0) {
    listRando = (
      <Heading size='lg' mb={5} textAlign='center'>
        pas de Resultat
      </Heading>
    )
  } else {
    listRando = resultSearch.map((rando, i) => (
      <Box style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }} >
      <Center
        w={'90%'}
        px={2}
        py={2}
        mt={3}
        bg='#FAFAFA'
        rounded='md'
        shadow={4}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'>
        <Heading size='sm' textAlign='center' fontWeight={'medium'}>
          {rando.name}
        </Heading>
        <Box flexDirection={'row'} style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }} >
          <Box>
            <Heading size='sm' fontWeight={'medium'}>{rando.departure.nom}</Heading>
          </Box>

          <Box space={2} alignItems='center'>
            <Text fontSize='sm'>
              {rando.level}
            </Text>
            <Text fontSize='sm'>
              {rando.users.length} / {rando.maxUsers} participants
            </Text>
          </Box>
          <Button
            size='md'
            bg='#78E08F'
            alignSelf='center'
            shadow="5"
            onPress={() => props.navigation.navigate('Detail', { rando })}>
            <Text style={styles.contentText} fontSize='md'>
              Voir
            </Text>
          </Button>
        </Box>
      </Center>
      </Box>
    ))
  }

  // console.log(mapConfig)
  //****** initialisation de la liste des markers de randonnées */

  var displayListPosition = resultSearch.map((rando, i) => (
    <Marker
      key={i}
      pinColor='green'
      coordinate={{
        latitude: rando.coordinate.latitude,
        longitude: rando.coordinate.longitude,
      }}
      title={rando.name}
      //*** Redirection vers la page du détail de la rando avec la rando en paramètre */

      description={rando.description + '\n Press to view'}>
      <MapView.Callout style={{ flex: 1 }} onPress={() => props.navigation.navigate('Detail', { rando })}>
        <View style={styles.callout}>
          <Heading fontSize='15'>{rando.name.length>15?rando.name.slice(0,15)+'...':rando.name}</Heading>
          <Text fontSize='12'>{rando.description.length>20?rando.description.slice(0,50)+'...':rando.description}</Text>
          <Button
w={70}
            h={6}
            p={0}
            mt={2}
            backgroundColor='#78E08F'
            alignSelf='center'
          >
            <Text style={styles.contentText} fontSize='xs'>
              Voir
            </Text>
          </Button>
        </View>
      </MapView.Callout>
    </Marker>
  ))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flex: 1,

        }}>
        <HStack justifyContent='space-between' mb={1}>
          <Box />
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
        <VStack space={2} alignItems='center' style={{ borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
          <Heading size='lg' mb={'2%'} fontWeight='normal' >
            Résultats
          </Heading>
          {/* Switch Line */}
          <Box display='flex' flexDirection='row' alignItems='center' mb={5}>
            <Switch
              offTrackColor='#C4C4C4'
              onTrackColor='#78E08F'
              mr={4}
              onValueChange={setMapDisplay}
            />
            <Heading size='md'fontWeight={'medium'} >Vue carte</Heading>
          </Box>
        </VStack>

        {/* Journey List */}

        {mapdisplay === false ? (
          searchStatus===true?<ScrollView style={{ flex: 1  }}>{listRando}</ScrollView>
          :<View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <HStack alignSelf='center' space={2} justifyContent="center">
               <Spinner color='#079992' accessibilityLabel="Loading posts" size="lg" />
                 <Heading color="#079992" fontSize="30">
                  Chargement
                </Heading>
            </HStack>

           </View>


        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              //onPress={(e) => addPress(e.nativeEvent)}
              initialRegion={mapConfig}
            >
              {displayListPosition}
            </MapView>
          </View>
        )}
      </View>
      {/* To prevent leaving the content area */}
      <StatusBar style='auto' />
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
    width: "100%",
    height: '100%',
    //borderWidth: 10,
    //borderColor: '#CCCCCC',
    alignSelf: "center",
  },
  mapContainer: {
    flex: 1,
    minHeight: 150,
  },
  callout: {
    flex: 1,
    maxWidth: 150,
    //height: 100,
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
