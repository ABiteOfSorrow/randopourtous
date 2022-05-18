// import { LogBox } from "react-native";
// LogBox.ignoreAllLogs(true);
import React from 'react'
import {StyleSheet} from 'react-native'
import {NativeBaseProvider} from 'native-base'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {FontAwesome5} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import PresentScreen from './screens/PresentScreen'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
import CreateScreen from './screens/Create'
import SearchScreen from './screens/Search'
import MapScreen from './screens/Map'
import ListScreen from './screens/List'
import DetailScreen from './screens/Detail'
import MyprofileScreen from './screens/MyProfile'
import OtherprofileScreen from './screens/Otherprofile'
import HistoryScreen from './screens/History'
import FriendScreen from './screens/Friend'
import ChatScreen from './screens/Chat'
import ResumeScreen from './screens/Resume'
import EditProfileScreen from './screens/EditProfile'
import ResultSearch from './screens/ResultSearch'

import {combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import user from './reducers/user.reducer'
import searchData from './reducers/search.reducer'
const store = configureStore({reducer: combineReducers({user, searchData})})
import {Provider} from 'react-redux'
import {useEffect} from 'react'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{headerShown: false}}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Create' component={CreateScreen} />
    </Stack.Navigator>
  )
}

const BottomMenuTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName
          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Randos') {
            iconName = 'hiking'
          } else if (route.name === 'Chercher') {
            iconName = 'search'
          } else if (route.name === 'Profil') {
            iconName = 'user-alt'
          }
          return <FontAwesome5 name={iconName} size={25} color={color} />
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: '#009788',
        inactiveTintColor: '#FFFFFF',
        style: {
          backgroundColor: '#78E08F',
          position: 'absolute',
          bottom: 5,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 15,
          height: 60,
          ...styles.shadow,
        },
      }}
      initialRouteName='Home'>
      <Tab.Screen
        name='Home'
        options={{gestureEnabled: false}}
        component={HomeNavigator}
      />
      <Tab.Screen name='Randos' component={ListScreen} />
      <Tab.Screen name='Chercher' component={SearchScreen} />
      <Tab.Screen name='Profil' component={MyprofileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [routes, setRoutes] = React.useState(
    <>
      <Stack.Screen name='Present' component={PresentScreen} />
      <Stack.Screen
        options={{gestureEnabled: false}}
        name='SignIn'
        component={SignInScreen}
      />
      <Stack.Screen
        name='SignUp'
        options={{gestureEnabled: false, headerLeft: false}}
        component={SignUpScreen}
      />
    </>
  )
  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((user) => {
        if (user) {
          setRoutes(
            <>
              <Stack.Screen name='Present' component={PresentScreen} />
              <Stack.Screen
                options={{gestureEnabled: false}}
                name='SignIn'
                component={SignInScreen}
              />
              <Stack.Screen
                name='SignUp'
                options={{gestureEnabled: false, headerLeft: false}}
                component={SignUpScreen}
              />
            </>
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {routes}
            <Stack.Screen
              name='Home'
              options={{gestureEnabled: false, headerLeft: false}}
              component={BottomMenuTabs}
            />
            <Stack.Screen name='Detail' component={DetailScreen} />
            <Stack.Screen name='MyProfile' component={MyprofileScreen} />
            <Stack.Screen name='BottomMenuTabs' component={BottomMenuTabs} />
            <Stack.Screen name='Create' component={CreateScreen} />
            <Stack.Screen name='Map' component={MapScreen} />
            <Stack.Screen name='Otherprofile' component={OtherprofileScreen} />
            <Stack.Screen name='Friend' component={FriendScreen} />
            <Stack.Screen name='History' component={HistoryScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
            <Stack.Screen name='Resume' component={ResumeScreen} />
            <Stack.Screen name='ResultSearch' component={ResultSearch} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 3.5,
    elevation: 5,
  },
})
