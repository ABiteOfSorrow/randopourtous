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
} from 'native-base'
import {StyleSheet, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import HamburgerMenu from '../components/HamburgerMenu'
import {connect} from 'react-redux'
import backendConfig from '../backend.config.json'

const backendAdress = backendConfig.address

function ResultSearch(props) {
  //****** state de récupération des résultats de recherche */
  const [resultSearch, setResultSearch] = useState([])

  //*** state de l'affichage de la carte (changement d'état avec le switch) */
  const [mapdisplay, setMapDisplay] = false

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
      console.log('données recues: ', response.result)
      setResultSearch([...response.result])
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
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
              onValueChange={() => {
                setMixte(!mixte)
                console.log(mixte)
              }}
            />
            <Heading size='md'>Vue carte</Heading>
          </Box>
        </VStack>

        {/* Journey List */}

        {listRando}
      </ScrollView>
      {/* To prevent leaving the content area */}
      <Box w='100%' h='8.5%' alignSelf='center' bg='#fff' />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentText: {
    color: 'white',
  },
})

function mapStateToProps(state) {
  return {
    data: state.searchData,
  }
}

export default connect(mapStateToProps, null)(ResultSearch)
