import React, {useState, useEffect, useCallback, useRef} from 'react';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {Loader} from '../../components/Loader';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {BASE_URL} from '../../config/config';
import axios from 'axios';
import {View, TouchableOpacity, useWindowDimensions, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../components/AuthContext';
import styles from './style';
import COLORS from '../../config/colors';
const Live = ({route}) => { 
  const {userInfo} = React.useContext(AuthContext);
  const navigation = useNavigation();
  const videoId = route.params.videoId;

  const user_id = JSON.parse(userInfo).data.id;

  const [messages, setMessages] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const controlRef = useRef();
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const [playing, setPlaying] = useState(false);

  //end forword and backword 10 seconds
  useEffect(() => {
    setLoadingStatus(true);

    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
    navigation.setOptions({title: 'Live Streaming'});
  }, []);
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(true);
      Alert.alert('video has finished playing!');
    }
  }, []);
  const fullscreen = elapsed_sec => {
    setPlaying(false);
    navigation.navigate('FullScreen', {
      video: videoId,
      elapsed_sec: elapsed_sec,
    });
  };
  const stopLoader = () => {
    setLoadingStatus(false);
  };
  const connectionId = videoId;
  //fetch message
  useEffect(() => {
    allmessage();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      allmessage();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  const allmessage = async () => {
    await axios({
      method: 'GET',
      url: `${BASE_URL}/chatLiveStreamMessage/${connectionId}`,
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
            createdAt: item.created_at,
            user: {
              _id: item.chat_user_id,
              name: item.firstname,
              avatar:
                `${MAIN_URL}public/uploads/gallery/media/avatar.png`,
            },
          };
        });
        setMessages(allmsg);
      })
      .catch(function (error) {
        console.log('error', error.response);
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
      chat_user_id: msg.user._id,
      video_id: connectionId,
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
  const sendmessage = async data => {
    console.log(data);
    await axios({
      method: 'POST',
      url: `${BASE_URL}/sendLiveStreamMessage`,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let result = JSON.stringify(response.data.message);
      })
      .catch(function (error) {
        console.log('error', error.response.data);
      });
  };
  return (
    <>
      <View style={styles.containerLive}>
        <Loader status={loadingStatus} />
        <View style={styles.row}>
          <YoutubePlayer
            ref={controlRef}
            height={height}
            width={width}
            play={playing}
            videoId={connectionId}
            onChangeState={onStateChange}
            onReady={stopLoader}
            rel={false}
            modestbranding={false}
            showinfo={false}
            initialPlayerParams={{
              modestbranding: 'true',
              preventFullScreen: 'true',
              frameborder: 'false',
              start: 0,
            }}
          />
          <TouchableOpacity style={styles.hideShare} />
          <TouchableOpacity style={styles.hideYoutubeLogo} />
        </View>
        <View style={styles.functionButtons}>
          <TouchableOpacity
            onPress={async () => {
              const elapsed_sec = await controlRef.current.getCurrentTime(); // this is a promise. dont forget to await
              fullscreen(elapsed_sec);
            }}
            style={styles.functionButtonSpace}>
            <MaterialIcons
              name="fullscreen"
              color="#fff"
              fontWeight="bold"
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.chatScreen}>
        <GiftedChat
          style={{color: 'black'}}
          messages={messages}
          multiline={true}
          loadEarlier={true}
          scrollToBottom={true}
          renderUsernameOnMessage={true}
          scrollToBottomComponent={scrollToBottomComponent}
          onSend={messages => onSend(messages)}
          user={{
            _id: user_id,
            _chat_connection_id: connectionId,
          }}
          textInputStyle={{
            color: 'black',
            borderRadius: 20,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
        />
      </View>
    </>
  );
};

export default React.memo(Live);
