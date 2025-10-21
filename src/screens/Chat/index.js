import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {View, Text, Button, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {AuthContext} from '../../components/AuthContext';
import {BASE_URL, CHAT_URL} from '../../config/config';
import axios from 'axios';
import COLORS from '../../config/colors';
const Chat = ({route}) => {
  const connectionId = route.params.connectionId;
  const {userInfo} = React.useContext(AuthContext);
  const senderid = JSON.parse(userInfo).data.id;
  const [messages, setMessages] = useState([]);

  const allmessage = async () => {
    await axios({
      method: 'GET',
      url: `${BASE_URL}/getMessages/${connectionId}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data);
        const msgs = JSON.parse(result).data;

        const allmsg = msgs.map((item, index) => {
          return {
            _id: item.id,
            text: item.message,
            createdAt: new Date(),
            user: {
              _id: item.chat_user_id,
              name: 'Raj Economics',
              avatar:
                `${CHAT_URL}public/uploads/certificate/120(1).png`,
            },
          };
        });
        setMessages(allmsg);
      })
      .catch(function (error) {
        // console.log('error', error.response);
        // setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   allmessage();
  // }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      allmessage();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  const sendmessage = async data => {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/chat_messages`,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data.message);
      })
      .catch(function (error) {
        // console.log('error', error.response.data);
        // setIsLoading(false);
      });
  };
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    let msg = messages[0];
    let formData = {
      message: msg.text,
      userid: msg.user._id,
      createdAt: msg.createdAt,
      connectionid: connectionId,
    };
    sendmessage(formData);
  }, []);

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.bgColor,
          },
        }}
        textStyle={{
          right: {
            color: '#ffff',
          },
        }}
      />
    );
  };
  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <MaterialIcons
            name="send"
            color={COLORS.bgColor}
            style={{marginBottom: 5, marginRight: 5}}
            size={34}
          />
        </View>
      </Send>
    );
  };
  const scrollToBottomComponent = props => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };
  return (
    <>
      <GiftedChat
        style={{color: 'black'}}
        messages={messages}
        multiline={true}
        loadEarlier={true}
        scrollToBottom={true}
        scrollToBottomComponent={scrollToBottomComponent}
        onSend={messages => onSend(messages)}
        user={{
          _id: senderid,
        }}
        textInputStyle={{
          color: 'black',
          borderRadius: 20,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
      />
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
  },
});
