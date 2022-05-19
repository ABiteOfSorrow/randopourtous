import React from 'react'
import { HStack, VStack, Center, Heading, Box, Button, Text, Switch, } from 'native-base'
import {StyleSheet, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import HamburgerMenu from '../components/HamburgerMenu'

function List(props) {
  const [vueMap, setVueMap] = React.useState(false)

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{ flex: 1 }}>
        <HStack justifyContent='space-between' mb={4}>
          <HamburgerMenu />
        </HStack>
        {/* List Body */}
        <VStack space={2} alignItems='center'>
          <Heading size='lg' mb={5}>
            Randonnées participées
          </Heading>

          {/* Switch Line */}
          <Box style={{ display:'flex', flexDirection:'row', alignItems:'center' }} mb={3}>
            <Switch
              offTrackColor='#C4C4C4'
              onTrackColor='#78E08F'
              mr={4}
              onValueChange={() => {
                setVueMap(!vueMap)
                console.log(vueMap)
              }}
            />
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
            style={{ display:'flex', flexDirection:'row' }}
            justifyContent='space-around'>
            <Heading size='md'>Vincennes</Heading>

            <VStack space={2} alignItems='flex-start'>
              <Text style={{ fontSize:12, fontWeight:'bold' }} >
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

export default List
