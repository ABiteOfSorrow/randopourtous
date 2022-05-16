import React, {useEffect} from 'react';
import { Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

function Home(props) {
  useEffect(() => {
    props.navigation.canGoBack(false);
  }, []);

  return (
    <SafeAreaView style={{ flex:1, justifyContent:'center' }}>
      <Text fontSize={20}>
        Home
      </Text>
    </SafeAreaView>

  )
}

export default Home;
