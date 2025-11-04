import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {View, Text, StyleSheet, ActivityIndicator, StatusBar} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import {AuthContext} from '../../components/AuthContext';
import {BASE_URL, CHAT_URL, IMG_URL} from '../../config/config';
import axios from 'axios';
import COLORS from '../../config/colors';
import {LinearGradient} from 'react-native-linear-gradient';

const Chat = ({route}) => {
  const connectionId = route.params.connectionId;
  const {userInfo} = React.useContext(AuthContext);
  const senderid = JSON.parse(userInfo).data.id;
  const userName = JSON.parse(userInfo).data.firstname;
  const userPhoto = JSON.parse(userInfo).data.photo;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const allmessage = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/getMessages/${connectionId}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const msgs = response.data.data;
      const allmsg = msgs.map((item) => {
        return {
          _id: item.id,
          text: item.message,
          createdAt: new Date(item.created_at || Date.now()),
          user: {
            _id: item.chat_user_id,
            name: item.chat_user_id === senderid ? userName : 'Teacher',
            avatar:
              item.chat_user_id === senderid
                ? `${IMG_URL}${userPhoto}`
                : `${CHAT_URL}public/uploads/certificate/120(1).png`,
          },
        };
      });
      setMessages(allmsg);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching messages:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allmessage();
    const interval = setInterval(() => {
      allmessage();
    }, 3000); // Reduced from 1 second to 3 seconds for better performance
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const sendmessage = async (data) => {
    try {
      await axios({
        method: 'POST',
        url: `${BASE_URL}/chat_messages`,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
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

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2563eb',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 16,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          left: {
            backgroundColor: '#fff',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 16,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
            fontSize: 15,
            lineHeight: 20,
          },
          left: {
            color: '#111827',
            fontSize: 15,
            lineHeight: 20,
          },
        }}
        timeTextStyle={{
          right: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
          },
          left: {
            color: '#9ca3af',
            fontSize: 11,
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <LinearGradient
          colors={['#2563eb', '#1d4ed8']}
          style={styles.sendButton}>
          <Ionicons name="send" color="#fff" size={20} />
        </LinearGradient>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.scrollToBottomButton}>
        <Ionicons name="chevron-down" size={24} color="#2563eb" />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563eb" barStyle="light-content" />
      
      {/* Modern Header */}
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Teacher Chat</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Chat Messages */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: senderid,
          name: userName,
          avatar: `${IMG_URL}${userPhoto}`,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        alwaysShowSend
        placeholder="Type your message..."
        placeholderTextColor="#9ca3af"
        textInputStyle={styles.textInput}
        messagesContainerStyle={styles.messagesContainer}
        showAvatarForEveryMessage={true}
        renderAvatarOnTop={false}
        infiniteScroll
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  messagesContainer: {
    backgroundColor: '#f9fafb',
    paddingBottom: 8,
  },
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    lineHeight: 20,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollToBottomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

export default Chat;