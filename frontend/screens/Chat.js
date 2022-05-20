import React, { useState, useCallback, useEffect } from "react";

import socketIOClient from "socket.io-client";
//if message not working, change adress (ipconfig - ip)
var socket = socketIOClient("http://192.168.10.119:3000");
import { connect } from "react-redux";

import { Bubble, GiftedChat, Send, MessageText, InputToolbar, SystemMessage } from "react-native-gifted-chat";
import { HStack, VStack, Center, Heading, Box, Button, Text, Switch, Input, Badge } from "native-base";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HamburgerMenu from "../components/HamburgerMenu";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function Chat(props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState(1)
  const [receiverId, setReceiverId] = useState(2)
  const [name, setName] = useState("popi")
  const [image_path, setImage_path] = useState("https://placeimg.com/140/140/any")
  const [isOwner, setIsOwner] = useState(false);

  //   //Setter for message list


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


  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: receiverId,// receiver id
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: senderId,  // sender id
  //         name: name,
  //         avatar: image_path,
  //       },
  //     },
  //   ])
  // }, [])

  // useEffect(() => {
  //   socket.on("sendMessageToAll", (msg) => {
  //     const response = JSON.parse(msg);
  //     var sentMessages = {
  //       _id: response.receiverId,
  //       text: response.message,
  //       createdAt: new Date(response.createdAt * 1000),
  //       user: {
  //         _id: response.senderId,
  //         name: name,
  //         avatar: image_path,
  //       },
  //     }
  //     setMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages))
  //   })
  // }, []);


  const onSend = useCallback((messages = []) => {
    console.log(messages);
    let obj = {
      "senderId": senderId,
      "receiverId": receiverId,
      "message": messages[0].text,
      "date": new Date(),
    }
    socket.emit("sendMessage", JSON.stringify(obj));
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, [messages]);


  // useEffect(() => {
  //   //Receive message from backend
  //   socket.on("sendMessageToAll", (msg) => {
  //     setMessages([...messages, msg]);
  //   });
  // }, []);

 

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
        <HStack justifyContent="space-between" mb={4}>
        <HamburgerMenu navigation={props.navigation} /> 
          <Switch offTrackColor="#C4C4C4" onTrackColor="#78E08F" mr={4} onValueChange={setIsOwner} />
          <Button w={90} h={8} p={0} mt={2} mr={2} variant="outline" borderColor="#38ADA9">
            <Text fontSize="xs" bold color="#38ADA9">
              Retour
            </Text>
          </Button>
        </HStack>
        {/* List Body */}
        <VStack space={2} alignItems="center">
          <Heading size="lg" mb={5}>
            Nom de Rando
          </Heading>
          {/* Switch Line */}
        </VStack>
        <VStack space={2} alignItems="center">
          {/* Journey List */}
          <Box w={"75%"} mb={0} borderRadius="15" bg="#079992">
            <Text color="white" fontSize="md" textAlign="center">
              8 / 15 Participants
            </Text>
          </Box>
          {isOwner ? (
            <>
              <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="md">
                  Voir la Rando
                </Text>
              </Button>

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
              <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" onPress={() => console.log("I'm Pressed")}>
                <Text style={styles.contentText} fontSize="md">
                  Gestion de la Rando
                </Text>
              </Button>
            </>
          ) : (
            <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" onPress={() => console.log("I'm Pressed")}>
              <Text style={styles.contentText} fontSize="md">
                Voir la Rando
              </Text>
            </Button>
          )}
        </VStack>

        <Box w={"90%"} h={"60%"} bg="#ffffff" alignSelf={"center"} mt={5} borderWidth={2} borderColor={"#bbbbbb"} borderRadius={8}>
          <GiftedChat
            borderRadius={8}
            messages={messages}
            onSend={(messages) => onSend(messages)}
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

        <View style={styles.footer}>
          {/* <Input
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              placeholder={"Entrez votre texte ici..."}
              InputRightElement={<Button size="xs" rounded="none" w="1/6" h="full" onPress={handleClick}></Button>}
            /> */}

          {/* <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name={"send"} size={24} color={"#2B68E6"} />
            </TouchableOpacity> */}
        </View>

        {/* To prevent leaving the content area */}
        <Box w="100%" h="8.5%" alignSelf="center" bg="#fff" />
        {/* </TouchableWithoutFeedback> */}
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

export default Chat;
