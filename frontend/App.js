//import { LogBox } from "react-native";
// LogBox.ignoreAllLogs(true);
import React from 'react'
import {StyleSheet} from 'react-native'
import {NativeBaseProvider} from 'native-base'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {FontAwesome5} from '@expo/vector-icons'

import PresentScreen from './screens/PresentScreen'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
import CreateScreen from './screens/Create'
import SearchScreen from './screens/Search'
// import MapScreen from './screens/Map'
import ListScreen from './screens/List'
import DetailScreen from './screens/Detail'
import MyprofileScreen from './screens/MyProfile'
// import OtherprofileScreen from './screens/Otherprofile'
import HistoryScreen from './screens/History'
// import ListFriend from './screens/Friend'
// import ChatScreen from './screens/Chat'
// import ResumeScreen from './screens/Resume'
import HamburgerMenuScreen from './screens/HamburgerMenu'

import {combineReducers} from 'redux'
import {configureStore} from '@reduxjs/toolkit'
import user from './reducers/user.reducer'
const store = configureStore({reducer: combineReducers({user})})
import {Provider} from 'react-redux'

const Tab = createBottomTabNavigator();

const BottomMenuTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "List") {
            iconName = "hiking";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "user-alt";
          }
          return <FontAwesome5 name={iconName} size={25} color={color} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: "#009788",
        inactiveTintColor: "#FFFFFF",
        style: {
          backgroundColor: "#78E08F",
          position: "absolute",
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
        component={HomeScreen}
      />
      <Tab.Screen name='List' component={CreateScreen} />
      <Tab.Screen name='Search' component={SearchScreen} />
      <Tab.Screen name='Profile' component={HistoryScreen} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={''}>
            <Stack.Screen name='Present' component={PresentScreen} />
            {/* <Stack.Screen
              options={{gestureEnabled: false}}
              name='SignIn'
              component={SignInScreen}
            />
            <Stack.Screen
              name='SignUp'
              options={{gestureEnabled: false}}
              component={SignUpScreen}
            /> */}
            <Stack.Screen
              name='Home'
              options={{gestureEnabled: false}}
              component={BottomMenuTabs}
            />
            <Stack.Screen name='Detail' component={DetailScreen} />
            {/* <Stack.Screen name='Create' component={CreateScreen} />
          <Stack.Screen name='Map' component={MapScreen} />
          <Stack.Screen name='Otherprofile' component={OtherprofileScreen} />
          <Stack.Screen name='Friend' component={ListFriend} />
          <Stack.Screen name='History' component={HistoryScreen} />
          <Stack.Screen name='Chat' component={ChatScreen} /> */}
            {/* <Stack.Screen name='Resume' component={ResumeScreen} /> */}
            <Stack.Screen
              name='HamburgerMenu'
              component={HamburgerMenuScreen}
            />
            <Stack.Screen name='BottomMenuTabs' component={BottomMenuTabs} />
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
