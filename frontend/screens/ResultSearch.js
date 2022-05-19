import React, {useEffect} from 'react'
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
  useEffect(() => {
    var searchFunction = async function () {
      console.log('données envoyées ', props.data)

      let result = await fetch(backendAdress + '/search-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.data),
      })

      let response = await result.json()

      console.log('données recues: ', response.result)
      // if (!data.result) {
      //   Alert.alert("Erreur", data.error);
      //   return;
      // }
    }

    searchFunction()
  }, [])

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
            <Switch offTrackColor='#C4C4C4' onTrackColor='#78E08F' mr={4} />
            <Heading size='md'>Vue carte</Heading>
          </Box>
        </VStack>
        <VStack space={2} alignItems='center'>
          {/* Journey List */}
          <Box w={'75%'} mb={0} borderRadius='15' bg='#78E08F'>
            <Heading size='md' textAlign='center'>
              Totos's Rando pour tous
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
            <Heading size='md'>Vincennes</Heading>

            <VStack space={2} alignItems='flex-start'>
              <Text fontSize='sm' bold>
                Sportif
              </Text>
              <Text fontSize='sm' bold>
                5 / 12 particpants
              </Text>
            </VStack>
            <Button
              size='md'
              backgroundColor='#78E08F'
              alignSelf='center'
              onPress={() => console.log("I'm Pressed")}>
              <Text style={styles.contentText} fontSize='md'>
                Voir
              </Text>
            </Button>
          </Center>
        </VStack>
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
