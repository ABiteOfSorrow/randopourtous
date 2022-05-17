import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Divider } from 'native-base';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backendAdress = 'http://' + '192.168.10.171' +':3000' 

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // read from async storage and if user exists, redirect to home
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        console.log('user found in async storage');
        props.signUp(JSON.parse(user));
        props.navigation.replace('Home');
      }
    }).catch(err => {
      console.log(err);
    });
  }, []);

  let handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erreur.", "Veuillez entrer les données.");
      return;
    }
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
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      console.log('User data saved in storage.')
    } catch (e) {
      console.log(e);
    }
    props.navigation.replace('Home');
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 26, marginBottom: 25 }}>RandoPourTous</Text>
      <Text style={{ fontSize: 20, marginBottom: 45 }}>Connexion</Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          width={"80%"}
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          type={"password"}
          width={"80%"}
          placeholder="Mot de passe"
        />
      </View>
      <Button style={styles.button} w={"80%"} onPress={async () => await handleSubmit()}>
        Connexion
      </Button>
      <Divider orientation="horizontal" w={"80%"} mt={10} mb={5} />
      <Text style={{ fontSize: 16, marginBottom: 14 }}>Se connecter avec</Text>
      <View
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <FontAwesome5
          style={{ marginHorizontal: 16 }}
          name="google"
          size={48}
          color="#DB4437"
          onPress={() => alert("Sign up avec Google. Merci.")}
        />
        <FontAwesome5
          style={{ marginHorizontal: 16 }}
          name="facebook"
          size={48}
          color="#4267B2"
        />
      </View>
      <View
        style={{ marginTop: 110, width: "80%", display: "flex", alignItems: "center" }}
      >
        <Text>Vous n'avez pas de compte?</Text>
        <Button
          style={{ backgroundColor: "#bbb" }}
          mt={2}
          w={"100%"}
          onPress={() => props.navigation.navigate("SignUp")}
        >
          Créer un compte
        </Button>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "80%",
  },
  inputContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#78E08F",
    marginTop: 12,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    signUp: (user) => dispatch({ type: "USER_LOGIN", user: user }),
  };
}

export default connect(null, mapDispatchToProps)(SignIn);
