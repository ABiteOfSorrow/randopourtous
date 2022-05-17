import React, {useEffect} from 'react';
import { Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home(props) {
  useEffect(() => {
    // load from async storage to redux store
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        props.signIn(JSON.parse(user));
      }
    }).catch(err => {
      console.log(err);
    });

    props.navigation.canGoBack(false);
  }, []);


  return (
    <SafeAreaView style={{ flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text fontSize={20}>
        Home
      </Text>
    </SafeAreaView>
  )
}
function mapDispatchToProps(dispatch) {
  return {
    signIn: (user) => dispatch({ type: 'USER_LOGIN', user:user })
  };
}

export default connect(null, mapDispatchToProps)(Home);
