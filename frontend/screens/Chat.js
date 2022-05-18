import React, { useState, useCallback, useEffect } from "react";
import {Bubble, GiftedChat, Send, MessageText} from 'react-native-gifted-chat';
import { HStack, VStack, Center, Heading, Box, Button, Text, Switch, Input } from "native-base";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HamburgerMenu from "../components/HamburgerMenu";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome";


function Chat(props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const ownerClick = () => {
    !isOwner ? setIsOwner(true) : setIsOwner(false);
  };


  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Toto',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello world',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props} width="20" height={"100%"} backgroundColor="78E08F">
        {/* <Button w={20} h={"100%"} bg={"78E08F"}> */}
        <Ionicons name={"send"} size={24} color={"#2B68E6"} />
        {/* </Button> */}
      </Send>
    );
  };

  // const renderMessage  = (props) => {
  //   return (
  //     <MessageText {...props} backgroundColor="#2e64e5">
  //       <View>
          
           
           
          
  //       </View>
  //     </MessageText>
  //   );
  // };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return(
      <FontAwesome name='angle-double-down' size={22} color='#333' />
    );
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

        <HStack justifyContent="space-between" mb={4}>
          <HamburgerMenu />
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
              <Button w={"80%"} size="md" backgroundColor="#78E08F" alignSelf="center" nPress={() => console.log("I'm Pressed")}>
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

        <Box w={"90%"} h={"50%"} bg="#ffffff" alignSelf={"center"} mt={5} borderWidth={2} borderColor={"#bbbbbb"}>
        <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderUsernameOnMessage ={true}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      // renderMessage={renderMessage}
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

//   const sendMessage = () => {
//     Keyboard.dismiss();
//     // db.collection("chats").doc(route.params.id).collection("messages").add({
//     //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//     //   message: input,
//     //   displayName: auth.currentUser.displayName,
//     //   email: auth.currentUser.email,
//     //   photoURL: auth.currentUser.photoURL,
//     // });
//     console.log("hello");
//     setInput("");
//   };

// import React, { useEffect, useState } from "react";
// import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
// import { Avatar } from "react-native-elements";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { StatusBar } from "expo-status-bar";

// const ChatScreen = ({ navigation, route }) => {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   return (
//     )
//   }

//   export default ChatScreen;
//           <Avatar
//             rounded
//             source={{
//               uri: messages[0]?.data.photoURL,
//               // "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
//             }}
//           />
//           <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>{route.params.chatName}</Text>
//         </View>
//       ),
//       headerLeft: () => (
//         <TouchableOpacity style={{ marginLeft: 10 }} onPress={navigation.goBack}>
//           <AntDesign name="arrowleft" size={24} color="white" />
//         </TouchableOpacity>
//       ),
//       headerRight: () => (
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             width: 80,
//             marginRight: 20,
//           }}
//         >
//           <TouchableOpacity>
//             <FontAwesome name="video-camera" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Ionicons name="call" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       ),
//     });
//   }, [navigation, messages]);

//   const sendMessage = () => {
//     Keyboard.dismiss();
//     db.collection("chats").doc(route.params.id).collection("messages").add({
//       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//       message: input,
//       displayName: auth.currentUser.displayName,
//       email: auth.currentUser.email,
//       photoURL: auth.currentUser.photoURL,
//     });
//     setInput("");
//   };

//   useLayoutEffect(() => {
//     const unsubscribe = db
//       .collection("chats")
//       .doc(route.params.id)
//       .collection("messages")
//       .orderBy("timestamp", "desc")
//       .onSnapshot((snapshot) =>
//         setMessages(
//           snapshot.docs.map((doc) => ({
//             id: doc.id,
//             data: doc.data(),
//           }))
//         )
//       );
//     return unsubscribe;
//   }, [route]);

//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <StatusBar style="light" />
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <>
//             <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
//               {messages.map(({ id, data }) =>
//                 data.email === auth.currentUser.email ? (
//                   <View key={id} style={styles.receiver}>
//                     <Avatar
//                       position={"absolute"}
//                       rounded
//                       //web
//                       containerStyle={{
//                         position: "absolute",
//                         bottom: -15,
//                         right: -5,
//                       }}
//                       bottom={-15}
//                       right={-5}
//                       size={30}
//                       source={{
//                         uri: data.photoURL,
//                       }}
//                     />
//                     <Text style={styles.receiverText}>{data.message}</Text>
//                   </View>
//                 ) : (
//                   <View key={id} style={styles.sender}>
//                     <Avatar
//                       position={"absolute"}
//                       rounded
//                       //web
//                       containerStyle={{
//                         position: "absolute",
//                         bottom: -15,
//                         left: -5,
//                       }}
//                       bottom={-15}
//                       left={-5}
//                       size={30}
//                       source={{
//                         uri: data.photoURL,
//                       }}
//                     />
//                     <Text style={styles.senderText}>{data.message}</Text>
//                     <Text style={styles.senderName}>{data.displayName}</Text>
//                   </View>
//                 )
//               )}
//             </ScrollView>
//             <View style={styles.footer}>
//               <TextInput value={input} onChangeText={(text) => setInput(text)} onSubmitEditing={sendMessage} placeholder={"42 Message"} style={styles.textInput} />
//               <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
//                 <Ionicons name={"send"} size={24} color={"#2B68E6"} />
//               </TouchableOpacity>
//             </View>
//           </>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
