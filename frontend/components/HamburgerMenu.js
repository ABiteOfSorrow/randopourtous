import React from "react";
import {
  Center,
  Heading,
  Menu,
  Box,
  HamburgerIcon,
  Divider,
  Pressable,
} from "native-base";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HamburgerMenu(props) {

  let handleLogout = async () => {
    console.log('Logout')
    props.logoutUser();
    // clear async storage
    try {
    await AsyncStorage.clear();
    // navigate to login screen
    props.navigation.navigate('SignIn');
    } catch (e) {
    
    console.log(e)
    } 
  }

  return (
    <Box alignItems="flex-start" ml="5" my="3">
      <Menu
        w="190"
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps}>
              <HamburgerIcon size="7" />
            </Pressable>
          );
        }}
      >
        <Menu.Group title="Menu">
          <Menu.Item onPress={() => props.navigation.navigate('Home')}>Home</Menu.Item>
          <Menu.Item onPress={() => props.navigation.navigate('Randos')}>Randos</Menu.Item>
          <Menu.Item onPress={() => props.navigation.navigate("Chercher")}>
            Chercher
          </Menu.Item>
          <Menu.Item onPress={() => props.navigation.navigate("MyProfile")}>
            Profil
          </Menu.Item>
        </Menu.Group>
        <Divider mt="3" w="100%" />
        <Menu.Group title="Connection">
          <Menu.Item onPress={() => handleLogout()}>
            Déconnexion
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </Box>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch({ type: "USER_LOGOUT" })
  };
}
export default connect(null, mapDispatchToProps)(HamburgerMenu);
