import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Divider } from 'native-base';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignUp(props) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  let handleSubmit = () => {
    if (password !== password2) {
      Alert.alert('Attention', 'Les mots de passe ne correspondent pas.');
      return;
    }
    props.navigation.navigate('Home');
  }

  useEffect(() => {

  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 26, marginBottom: 25, marginTop: -25 }}>RandoPourTous</Text>
      <Text style={{ fontSize: 20, marginBottom: 45 }}>Créer un compte</Text>
      <View style={styles.inputContainer} >
        <Input placeholder='Email' width={'80%'} value={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
      </View>
      <View style={styles.inputContainer} >
        <Input placeholder="Nom d'utilisateur" value={username} onChangeText={(text) => setUsername(text)} width={'80%'} style={styles.input} />
      </View>
      <View style={styles.inputContainer} >
        <Input style={styles.input} value={password} onChangeText={(text) => setPassword(text)} type={show ? "text" : "password"} width={'80%'} InputRightElement={<Button size="xs" style={{ backgroundColor: '#78E08F' }} rounded="none" w="1/5" h="full" onPress={handleClick}>
          {show ? "Cacher" : "Montrer"}
        </Button>} placeholder="Mot de passe" />
      </View>
      <View style={styles.inputContainer} >
        <Input style={styles.input} value={password2} onChangeText={(text) => setPassword2(text)} type={show ? "text" : "password"} width={'80%'} placeholder="Confirmation mot de passe" />
      </View>
      <Button style={styles.button} w={'80%'} fontSize={20} fontWeight={'bold'} onPress={() => handleSubmit()}>Créer son compte</Button>
      <Divider orientation='horizontal' w={'80%'} mt={10} mb={5} />
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Se connecter avec</Text>
      <View style={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
        <FontAwesome5 style={{ marginHorizontal: 16 }} name="google" size={48} color="#DB4437" onPress={() => alert('Sign up avec Google. Merci.')} />
        <FontAwesome5 style={{ marginHorizontal: 16 }} name="facebook" size={48} color="#4267B2" />
      </View>
      <View style={{ marginTop: 110, width: '80%', display: 'flex', alignItems: 'center' }} >
        <Text>Vous avez déjà un compte?</Text>
        <Button style={{ backgroundColor: '#bbb' }} mt={2} w={'100%'} onPress={() => props.navigation.navigate('SignIn')}>Se connecter</Button>
      </View>
      <StatusBar style='auto' />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
  },
  inputContainer: {
    marginBottom: 10
  },
  button: {
    backgroundColor: '#78E08F',
    marginTop: 12,
  }
});
