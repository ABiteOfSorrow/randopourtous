import React, {useEffect, useState} from 'react'
import {StatusBar} from 'expo-status-bar'
import {Button, Input, Divider} from 'native-base'
import {Text, StyleSheet, View, Alert, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FontAwesome5} from '@expo/vector-icons'
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;

function SignUp(props) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  //const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  let handleSubmit = async () => {
    if (password !== password2) {
      Alert.alert('Attention', 'Les mots de passe ne correspondent pas.');
      return
    }
    if (!email || !username || !password || email.length < 4 || username.length < 4 || password.length < 6) {
      Alert.alert('Attention', 'Veuillez remplir correctement tous les champs. Longueur du mot de passe minimum 6 caractères.');
      return
    }
    const validateEmail = (mail) => {
      return String(mail)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!validateEmail(email)) {
      Alert.alert('Attention', 'Veuillez entrer une adresse email valide.');
      return;
    }
    try {
    // fetch to backend ici
    let result = await fetch(backendAdress + '/users/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        
      }),
    })
    let data = await result.json()
    if (!data.result) {
      Alert.alert('Erreur', data.error);
      return
    }
    // store in redux here
    props.signUp(data.user)
    } catch (e) {
      console.log(e)
      Alert.alert('Erreur', 'Problème de connexion au serveur.')
    }
    // save in async storage
    try {
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    } catch (e) {
      console.log(e);
    }
    props.navigation.replace('Home');
  }

  useEffect(() => {}, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
      }}>
        <ScrollView 
        style={{width: "100%", height: "100%"}}
        contentContainerStyle ={{justifyContent: 'center', alignItems: 'center',}}>
      <Text style={{fontSize: 26, marginBottom: '8%', marginTop: "15%"}}>
        RandoPourTous
      </Text>
      <Text style={{fontSize: 20, marginBottom: '10%'}}>Créer un compte</Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder='Email'
          w={'80%'}
          type='text'
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={(text) => setUsername(text)}
          w={'80%'}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          type={show ? 'text' : 'password'}
          w={'80%'}
          InputRightElement={
            <Button
              size='xs'
              style={{backgroundColor: '#78E08F'}}
              rounded='none'
              w='1/5'
              h='full'
              onPress={handleClick}>
              {show ? 'Cacher' : 'Montrer'}
            </Button>
          }
          placeholder='Mot de passe'
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          value={password2}
          onChangeText={(text) => setPassword2(text)}
          type={show ? 'text' : 'password'}
          w={'80%'}
          placeholder='Confirmation mot de passe'
        />
      </View>
      <Button
        style={styles.button}
        w={'80%'}
        fontSize={20}
        fontWeight={'bold'}
        shadow="9" 
        onPress={async () => await handleSubmit()}>
        Créer son compte
      </Button>
      <Divider orientation='horizontal' w={'80%'} mt={'6%'} mb={'4%'} />
      <Text style={{fontSize: 16, marginBottom: 10}}>Se connecter avec</Text>
      <View
        style={{
          width: '80%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <FontAwesome5
          style={{marginHorizontal: 16}}
          name='google'
          size={48}
          color='#DB4437'
          onPress={() => alert('Sign up avec Google. Merci.')}
        />
        <FontAwesome5
          style={{marginHorizontal: 16}}
          name='facebook'
          size={48}
          color='#4267B2'
        />
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          marginTop: '10%',
          display: 'flex',
          width: '80%',
          display: 'flex',
          alignItems: 'center',
        }}>
        <Text>Vous avez déjà un compte?</Text>
        <Button
          style={{backgroundColor: '#bbb'}}
          mt={2}
          mb={2}
          w={'100%'}
          shadow="9" 
          onPress={() => props.navigation.navigate('SignIn')}>
          Se connecter
        </Button>
      </View>
      <StatusBar style='auto' />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
  },
  inputContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#78E08F',
    marginTop: '4%',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    signUp: (user) => dispatch({type: 'USER_LOGIN', user: user}),
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
