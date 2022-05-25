import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Input, Divider } from 'native-base'
import { Text, StyleSheet, View, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5 } from '@expo/vector-icons'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // read from async storage and if user exists, redirect to home
    AsyncStorage.getItem("user")
      .then((user) => {
        if (user) {
          user = JSON.parse(user)
          console.log("user found in async storage");
          (async () => {
            try {
              let rawresponse = await fetch(backendAdress + '/users/my-data?token=' + user.token)
              if (rawresponse.ok) {
                console.log('Ok response')
                let response = await rawresponse.json();
                console.log(typeof response.user)
                if (response.result) {
                  await AsyncStorage.setItem('user', JSON.stringify(response.user))
                  props.signUp(response.user);
                } else {
                  //console.log(response)
                  props.signUp(JSON.parse(user));
                }
                props.navigation.replace("Home");
              }
            } catch (error) {
              console.log(error)
              Alert.alert('Erreur', 'Problème de connexion au serveur.')
            }
          })();

        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erreur.", "Veuillez entrer les données.");
      return;
    }
    try {
      let result = await fetch(backendAdress + "/users/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (result.ok) {
        let data = await result.json();
        if (!data.result) {
          Alert.alert("Erreur", data.error);
          return;
        }
        // store to redux here
        props.signUp(data.user);
        console.log(data.user);
        // save in async storage
        try {
          await AsyncStorage.setItem("user", JSON.stringify(data.user));
          console.log("User data saved in storage.");
        } catch (e) {
          console.log(e);
        }
        props.navigation.replace("Home");
      } else {
        Alert.alert("Erreur", "Problème de connexion au serveur.");
        console.log('Serveur pas connecté')
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Erreur", "Problème de connexion au serveur.");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        style={{ width: "100%", height: "100%" }}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '100%' }}>
        <Text style={{ fontSize: 26, marginBottom: '8%', marginTop: "3%" }}>RandoPourTous</Text>
        <Text style={{ fontSize: 20, marginBottom: '10%' }}>Connexion</Text>
        <View style={styles.inputContainer}>
          <Input placeholder="Email" width={"80%"} onChangeText={(text) => setEmail(text)} value={email} style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Input style={styles.input} value={password} onChangeText={(text) => setPassword(text)} type={"password"} width={"80%"} placeholder="Mot de passe" />
        </View>
        <Button style={styles.button} w={"80%"} onPress={async () => await handleSubmit()}>
          Connexion
        </Button>
        <Divider orientation="horizontal" w={"80%"} mt={'10%'} mb={'3%'} />
        <Text style={{ fontSize: 16, marginBottom: '4%' }}>Se connecter avec</Text>
        <View
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <FontAwesome5 style={{ marginHorizontal: '8%' }} name="google" size={48} color="#DB4437" onPress={() => alert("Sign up avec Google. Merci.")} />
          <FontAwesome5 style={{ marginHorizontal: '8%' }} name="facebook" size={48} color="#4267B2" />
        </View>
        <View
          style={{
            marginTop: '20%',
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text>Vous n'avez pas de compte?</Text>
          <Button style={{ backgroundColor: "#bbb" }} mt={2} w={"84%"} onPress={() => props.navigation.navigate("SignUp")}>
            Créer un compte
          </Button>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
  },
  inputContainer: {
    marginBottom: '3%',
  },
  button: {
    backgroundColor: "#78E08F",
    marginTop: '3%',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    signUp: (user) => dispatch({ type: "USER_LOGIN", user: user }),
  };
}

export default connect(null, mapDispatchToProps)(SignIn);
