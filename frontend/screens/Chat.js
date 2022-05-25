import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat, Send, MessageText, InputToolbar, SystemMessage } from "react-native-gifted-chat";
import { HStack, VStack, Center, Heading, Box, Button, Text, Switch, Badge } from "native-base";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { connect } from "react-redux";
import HamburgerMenu from "../components/HamburgerMenu";
//import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import backendConfig from '../backend.config.json';
const backendAdress = backendConfig.address;
const URL = 'ws://' + backendAdress.slice(7, backendAdress.length - 5) + ':8080'
console.log(URL)


function Chat(props) {
  //const [input, setInput] = useState("");
  const [user, setUser] = useState('John');
  const [message, setMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState(props.userId)
  //const [receiverId, setReceiverId] = useState(2)

  const [name, setName] = useState("popi")
  const [image_path, setImage_path] = useState("https://placeimg.com/140/140/any")
  const [isOwner, setIsOwner] = useState(false);

  let rando = props.route.params.rando;
  console.log('rando de Détail: ', rando)

  //console.log(JSON.stringify(ws));

  const ws = new WebSocket(URL);

  
  // useEffect(() => {

  //   ws.onmessage = function (data) {
  //     console.log('onmessage')
  //     console.log('received:', data.data.toString());
  //     let receivMessage = JSON.parse(data.data.toString())
  //     console.log()
  //     alert(receivMessage.message.text)
  //   };

  //   const chatFetch = async () => {

  //     try {
  //       let rawResponse = await fetch(backendAdress + '/get-track?id=' + rando._id)
  //       //console.log(JSON.stringify(rawresponse))
  //       if (rawResponse.ok) {
  //         console.log('ok')
  //         let response = await rawResponse.json();
  //         if (response.result) {
  //           //Alert.alert('Tout va bien')
  //           setMessages(response.messages)
  //           //alert(JSON.stringify(response))
  //         } else {
  //           Alert.alert('Mauvaise réponse du serveur...', response.error)
  //         }
  //       } else {
  //         alert('not ok!')
  //       }

  //       ws.onopen = function (event) {
  //         //console.log(JSON.stringify(event));
  //         alert('Connecté au serveur.')
  //       };


  //     } catch (e) {
  //       console.log(e)
  //     }
  //     chatFetch()
  //   }
  // }, [])

  // setMessages([
  //   {
  //     _id: 1,
  //     text: 'Hello developer',
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: 'React Native',
  //       avatar: 'https://placeimg.com/140/140/any',
  //     },
  //   },
  // ])

  // const onSend = useCallback((messages = []) => {

    // // envoyer message au backend en websocket, envoyer aussi mon token du user
    // //console.log(JSON.stringify(messages))
    // let firstMsg = messages[0];
    // console.log('callback onsend');
    // let messageToBackend = {
    //   randoId: rando._id,
    //   message: firstMsg,
    //   username: props.user.username,
    //   date: new Date(),
    //   token: props.user.token
    // }

    // console.log('onopen send')
    // //JSON.stringify(messageToBackend)
    // ws.send(JSON.stringify(messageToBackend))

    // // envoyer message au backend en websockets ici

  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  // }, [messages]);




  //   // Change emoticons to emoji && F word change to [censored]
  //   let messageLoad = listMessage.map((e) => {
  //     var filteredMessage = e.msg.messages.replace(/:\)/g, "\u263A");
  //     filteredMessage = filteredMessage.replace(/:\(/g, "\u2639");
  //     filteredMessage = filteredMessage.replace(/:p/g, "\uD83D\uDE1B");
  //     filteredMessage = filteredMessage.replace(/[a-z]*fuck[a-z]*/gi, "[censored]");
  //     return (
  //       <ListItem>
  //         <ListItem.Content>
  //           <ListItem.Title>{filteredMessage}</ListItem.Title>
  //           <ListItem.Subtitle>{e.msg.pseudo}</ListItem.Subtitle>
  //         </ListItem.Content>
  //       </ListItem>
  //     );
  //   });


  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])
 
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])


  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <Box w={20} h={"100%"} bg={"#079992"} justifyContent={"center"} alignItems={"center"} borderRadius={5}>
            <FontAwesome name={"send"} size={28} color={"white"} />
          </Box>
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2e64e5",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        textInputProps={{
          onSubmitEditing: () => {
            if (props.text && props.onSend) {
              let text = props.text;
              props.onSend({ text: text.trim() }, true)
            }
          }
        }}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#BBBBBB",
          borderTopWidth: 1,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
        <HStack justifyContent="space-between" mb={'1%'}>
          <HamburgerMenu navigation={props.navigation} />

          <Button w={90} h={8} p={0} onPress={() => props.navigation.goBack()} mt={2} mr={2} variant="outline" borderColor="#38ADA9" >
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>
        <VStack space={"0.5%"} alignItems="center">
          <Heading size="lg" mb={'3%'}>
            {rando.name}
          </Heading>
        </VStack>
        <VStack space={2} alignItems="center">
          {/* Journey List */}
          <Box w={"80%"} mb={0} borderRadius="15" style={{ paddingVertical: 1 }} bg="#079992">
            <Text color="white" fontSize="md" textAlign="center">
              {rando.users.length} / {rando.maxUsers} Participants
            </Text>
          </Box>
          <Button w={"84%"} mb={0} h={10} backgroundColor="#78E08F" alignSelf="center" onPress={() => props.navigation.navigate("Detail", { rando })}>
            <Text fontSize="md">
              Voir la Rando
            </Text>
          </Button>
          <Button  w={"84%"} h={10} backgroundColor="#78E08F" alignSelf="center" onPress={() => props.navigation.navigate("Management", {params: { user: props.user, rando: rando }})}>
                <Text fontSize="md">
testbutton                </Text>
              </Button>
          {props.user._id === rando.userId ? (
            <>

              <Badge // bg="red.400"
                colorScheme="danger"
                rounded="full"
                mb={-7}
                mr={8}
                zIndex={1}
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 12,
                }}
              >
                2
              </Badge>
              <Button  w={"84%"} h={10} backgroundColor="#78E08F" alignSelf="center" onPress={() => props.navigation.navigate("Management", {params: { user: props.user, rando: rando }})}>
                <Text fontSize="md">
                  Gestion de la Rando
                </Text>
              </Button>
            </>
          ) : (<></>)}
        </VStack>

        <Box w={"90%"} style={{ flex: 1, borderRadius: 8, marginBottom: '4%' }} bg="#ffffff" alignSelf={"center"} mt={'2%'} borderWidth={2} borderColor={"#bbbbbb"} >
          <GiftedChat
            borderRadius={8}
            messages={messages}
            onSend={(message) => onSend(message)}
            user={{
              _id: senderId,
            }}
            renderAvatarOnTop={true}
            renderUsernameOnMessage={true}
            renderInputToolbar={customtInputToolbar}
            renderBubble={renderBubble}
            alwaysShowSend
            renderSend={renderSend}
            scrollToBottom
            scrollToBottomComponent={scrollToBottomComponent}
          />
        </Box>


      </KeyboardAvoidingView>
      {/* To prevent leaving the content area */}
      <Box w="100%" h="8.5%" alignSelf="center" bg="#fff" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
});

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(Chat);
