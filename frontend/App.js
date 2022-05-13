// import { LogBox } from "react-native";
// LogBox.ignoreAllLogs(true);
import {NativeBaseProvider} from 'native-base'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'

import {FontAwesome5} from '@expo/vector-icons'
import PresentScreen from './screens/PresentScreen'
import SignInScreen from './screens/SignIn'
import SignUpScreen from './screens/SignUp'
import HomeScreen from './screens/Home'
// import CreateScreen from './screens/Create'
import SearchScreen from './screens/Search'
// import MapScreen from './screens/Map'
import ListScreen from './screens/List'
// import DescriptionScreen from './screens/Description'
// import MyprofileScreen from './screens/MyProfile'
// import OtherprofileScreen from './screens/Otherprofile'
// import HistoryScreen from './screens/History'
// import ListFriend from './screens/Friend'
// import ChatScreen from './screens/Chat'
// import ResumeScreen from './screens/Resume'

// const Tab = createBottomTabNavigator()

//const store = configureStore({ reducer: combineReducers({  }) });

const Tab = createBottomTabNavigator()

const BottomMenuTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName
          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'List') {
            iconName = 'hiking'
          } else if (route.name === 'Search') {
            iconName = 'search'
          } else if (route.name === 'Profile') {
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
          backgroundColor: '#111224',
        },
      }}
      initialRouteName='Home'>
      <Tab.Screen name='Home' component={HomeScreen} />
      {/*<Tab.Screen name='List' component={ListScreen} /> */}
      <Tab.Screen name='Search' component={SearchScreen} />
      {/* <Tab.Screen name='Profile' component={MyprofileScreen} /> */}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()
export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={''}>
          <Stack.Screen name='Present' component={PresentScreen} />
          <Stack.Screen name='SignIn' component={SignInScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
          <Stack.Screen name='Home' component={BottomMenuTabs} />
          {/* <Stack.Screen name='Create' component={CreateScreen} />
          <Stack.Screen name='Map' component={MapScreen} />
          <Stack.Screen name='Description' component={DescriptionScreen} />
          <Stack.Screen name='Otherprofile' component={OtherprofileScreen} />
          <Stack.Screen name='Friend' component={ListFriend} />
          <Stack.Screen name='History' component={HistoryScreen} />
          <Stack.Screen name='Chat' component={ChatScreen} /> */}
          {/* <Stack.Screen name='Resume' component={ResumeScreen} /> */}
          <Stack.Screen name='BottomMenuTabs' component={BottomMenuTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
