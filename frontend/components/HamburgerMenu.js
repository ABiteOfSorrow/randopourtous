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
          <Menu.Item onPress={() => console.log("Home")}>Home</Menu.Item>
          <Menu.Item onPress={() => console.log("List")}>List</Menu.Item>
          <Menu.Item onPress={() => console.log("Search")}>
            Search
          </Menu.Item>
          <Menu.Item onPress={() => console.log("Profil")}>
            Profil
          </Menu.Item>
        </Menu.Group>
        <Divider mt="3" w="100%" />
        <Menu.Group title="Connection">
          <Menu.Item onPress={() => console.log("SignIn")}>
            Sign-out
          </Menu.Item>
        </Menu.Group>
      </Menu>
    </Box>
  );
}
export default HamburgerMenu;
