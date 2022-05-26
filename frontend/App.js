import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "exported from 'deprecated-react-native-prop-types'.",
])
// LogBox.ignoreAllLogs(true);
import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { NativeBaseProvider } from 'native-base'
import { NavigationContainer, DefaultTheme, StackActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { FontAwesome5 } from '@expo/vector-icons'
//import AsyncStorage from '@react-native-async-storage/async-storage'

import PresentScreen from './screens/PresentScreen'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
import CreateScreen from './screens/Create'
import SearchScreen from './screens/Search'
import RandosScreen from './screens/Randos'
import DetailScreen from './screens/Detail'
import MyprofileScreen from './screens/MyProfile'
import OtherProfileScreen from './screens/OtherProfile'
import HistoryScreen from './screens/History'
import FriendScreen from './screens/Friend'
import ChatScreen from './screens/Chat'
import ResumeScreen from './screens/Resume'
import EditProfileScreen from './screens/EditProfile'
import ResultSearch from './screens/ResultSearch'
import SearchPeopleScreen from './screens/SearchPeople'
import ManagementScreen from './screens/Management'
import MyTrack from './screens/MyTrack'


import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import user from './reducers/user.reducer'
import searchData from './reducers/search.reducer'
const store = configureStore({ reducer: combineReducers({ user, searchData }) })
import { Provider } from 'react-redux'
import { useEffect } from 'react'


const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
//const HomeStack = createStackNavigator();
//const ProfileStack = createStackNavigator();
//const SearchStack = createStackNavigator();
//const RandoStack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='MyTrack' component={MyTrack} />
      <Stack.Screen name='Create' component={CreateScreen} />
      <Stack.Screen name='SearchPeople' component={SearchPeopleScreen} />
      <Stack.Screen name='Detail' component={DetailScreen} />
    </Stack.Navigator>
  )
}

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
    initialRouteName='MyProfile'
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MyProfile' component={MyprofileScreen} />
      <Stack.Screen name='EditProfile' component={EditProfileScreen} />
      <Stack.Screen name='Friend' component={FriendScreen} />
    </Stack.Navigator>
  )
}


const SearchNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName='Chercher' >
      <Stack.Screen name='Chercher' component={SearchScreen} />
      <Stack.Screen name='ResultSearch' component={ResultSearch} />
      <Stack.Screen name='Resume' component={ResumeScreen} />
    </Stack.Navigator>
  )
}
const RandoNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName='History' >
      <Stack.Screen name='History' component={HistoryScreen} />
      <Stack.Screen name='Detail' component={DetailScreen} />
      <Stack.Screen name='Management' component={ManagementScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />

    </Stack.Navigator>
  )
}

// Pour la prévention mélanger des stack
function resetTabStackListener() {
  // On Android, we want to clear the tab stack history when a user returns to the tab.
  if (Platform.OS === 'android') {
    return function ResetTabStackListener({ navigation }) {
      // To accomplish the above without delaying the tab switch or incurring loading or animation UX, we
      // clear the history of all tab stacks except for the one being navigated to. This means that the
      // prior stack will be at the desired state if the user returns to it. Since we don't know which
      // tab the user was coming from, we must clear all but the target stack.
      return {
        tabPress: (e) => {
          const state = navigation.dangerouslyGetState();

          if (state) {
            const nonTargetTabs = state.routes.filter((r) => r.key !== e.target);

            nonTargetTabs.forEach((tab) => {
              const stackKey = (tab.state)?.key;

              if (stackKey) {
                navigation.dispatch({
                  ...StackActions.popToTop(),
                  target: stackKey,
                });
              }
            });
          }
        },
      };
    };
  } else {
    // iOS preserves history.
    return undefined;
  }
}

const BottomMenuTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={ ({ route }) => ({
        tabBarIcon: ({ color }) => {
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
        keyboardHidesTabBar: true,
        activeTintColor: '#009788',
        inactiveTintColor: '#FFFFFF',
        style: {
          backgroundColor: '#78E08F',

          marginVertical: 5,
          marginHorizontal: 10,
          elevation: 0,
          borderRadius: 15,
          height: 60,
          paddingBottom: 4,
          ...styles.shadow,
        },
      }}
      initialRouteName='Home'
    >
      <Tab.Screen name='Home' component={HomeNavigator} listeners={resetTabStackListener()} />
      <Tab.Screen name='Randos' component={RandoNavigator} listeners={resetTabStackListener()} />
      <Tab.Screen name='Chercher' component={SearchNavigator} listeners={resetTabStackListener()} />
      <Tab.Screen name='Profil' component={ProfileNavigator} listeners={resetTabStackListener()} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [routes, setRoutes] = React.useState(
    <>
      <Stack.Screen name='Present' component={PresentScreen} />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name='SignIn'
        component={SignInScreen}
      />
      <Stack.Screen
        name='SignUp'
        options={{ gestureEnabled: false, headerLeft: false }}
        component={SignUpScreen}
      />
    </>
  )
  /*useEffect(() => {
    AsyncStorage.getItem('user')
      .then((user) => {
        if (user) {
          setRoutes(
            <>
              <Stack.Screen name='Present' component={PresentScreen} />
              <Stack.Screen
                options={{ gestureEnabled: false }}
                name='SignIn'
                component={SignInScreen}
              />
              <Stack.Screen
                name='SignUp'
                options={{ gestureEnabled: false, headerLeft: false }}
                component={SignUpScreen}
              />
            </>
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])*/

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff'
    },
  };

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer theme={MyTheme} >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {routes}
            <Stack.Screen
              name='Home'
              options={{ gestureEnabled: false, headerLeft: false }}
              component={BottomMenuTabs}
            />
            
            <Stack.Screen name='BottomMenuTabs' component={BottomMenuTabs} />
            <Stack.Screen name='OtherProfile' component={OtherProfileScreen} />
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
