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

function HamburgerMenu(props) {
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
          <Menu.Item onPress={() => console.log("SignOut")}>
            Déconnexion
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </Box>
  );
}
export default HamburgerMenu;
