import React, { useState } from "react";
import {
  Button,
  Input,
  Text,
  HStack,
  VStack,
  Heading,
  Box,
  Switch,
  View,
  Pressable,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { StyleSheet, ScrollView } from "react-native";
import MapView from "react-native-maps";

import DateTimePickerModal from "react-native-modal-datetime-picker";

function Creat() {
  const [date, setDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isHourPickerVisible, setHourPickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hidePicker = () => {
    setDatePickerVisibility(false);
    setHourPickerVisibility(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HStack justifyContent="space-between" mb={4}>
        <HamburgerMenu />
        <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9">
          <Text fontSize="xs" bold color="#38ADA9">
            Retour
          </Text>
        </Button>
      </HStack>

      <VStack space={2} alignItems="center">
        <Heading size="md"> Créer une Randonnée </Heading>

        <Box display="flex" flexDirection="row" alignItems="center">
          <Switch offTrackColor="#C4C4C4" onTrackColor="#78E08F" />
          <Heading size="xs">Rando mixte</Heading>
        </Box>

        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Nom de la randonnée"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />
        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Départ: Ville / département / région"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />
        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Arrivée: Ville / département / région"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />
        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Nombre max de personnes"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />
        <Pressable
          style={styles.allInputPressable}
          w="84%"
          h="4.5%"
          onPress={showDatePicker}
        >
          <Text fontSize={10} color="#AAAAAA" style={{ marginLeft: 11, marginTop: 5 }}>
            {!date
              ? "Date & Heure"
              : date.toLocaleDateString("fr") +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes()}
          </Text>
        </Pressable>
        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Description"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />
        <Input
          style={styles.allInput}
          size="xs"
          placeholder="Sportif & Expert"
          w="100%"
          h="4.5%"
          maxWidth="330px"
        />

        <View style={styles.container}>
          <MapView style={styles.map}></MapView>
          <Pressable style={styles.libelle} bg="#F5F5F5">
            <Text fontSize={10} style={{ color: "#AAAAAA" }}>
              Placez le point de départ
            </Text>
          </Pressable>
        </View>

        <Button w={170} h={10} bg="#78E08F">
          Créer
        </Button>
      </VStack>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          setDate(date);
          setHourPickerVisibility(true);
        }}
        onCancel={hidePicker}
      />

      <DateTimePickerModal
        isVisible={isHourPickerVisible}
        mode="time"
        locale="fr-FR"
        date={date}
        onConfirm={(date) => {
          setHourPickerVisibility(false);
          setDate(date);
        }}
        onCancel={hidePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  allInput: {
    backgroundColor: "#EEEEEE",
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
  },
  allInputPressable: {
    backgroundColor: "#EEEEEE",
    borderWidth: 1.1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
  },
  map: {
    width: 350,
    height: 250,
    borderWidth: 10,
    borderColor: "#CCCCCC",
  },
  container: {
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
  },
  libelle: {
    position: "absolute",
    top: -1.5,
    left: -1.5,
    borderColor: "#CCCCCC",
    borderWidth: 1.3,
    borderBottomRightRadius: 5,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 3,
    paddingLeft: 3,
  },
});

export default Creat;
