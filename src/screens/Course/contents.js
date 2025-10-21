import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, IMG_URL } from '../../config/config';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from '../MyPurchase/style';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { DownloadFiles } from '../../components/DownloadFiles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';

const Contents = ({ route }) => {
  const courseId = route.params.courseId;
  const insets = useSafeAreaInsets();
  const folderId = route.params.folderId;
  const paid = route.params.paid;
  const isPaid = Number(paid) === 1;
  const [getData, setData] = useState([]);
  const [getVideo, setVideo] = useState([]);
  const [getDocument, setDocument] = useState([]);
  const [getExam, setExam] = useState([]);
  const [name, setName] = useState(route.params.courseTitle);
  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;

  // Enhanced section header component
  const SectionHeader = ({ title, icon, count }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 12,
      backgroundColor: '#fff',
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <FontAwesome name={icon} color="#2563eb" size={18} />
      </View>
      <Text style={{
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
      }}>
        {title}
      </Text>
      {count > 0 && (
        <View style={{
          backgroundColor: '#2563eb',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
            {count}
          </Text>
        </View>
      )}
    </View>
  );

  const handleFetchData = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/subfolder/${courseId}/${folderId}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (e) { }
  };

  const getContents = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/contents/${courseId}/${folderId}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocument(result?.data?.documents);
      setVideo(result?.data?.videos);
      setExam(result?.data?.testseries);
    } catch (e) {
      console.log(e);
    }
  };

  const ViewContents = async item => {
    await navigation.push('Contents', {
      courseId,
      courseTitle: item.folders,
      folderId: item.folder_id,
      paid,
    });
  };

  const playVideo = async item => {
    if (item.is_live == 'yes') {
      await navigation.navigate('Live', {
        videoId: item.video_id,
      });
    } else {
      await navigation.navigate('Description', {
        videoTitle: item.title,
        videoId: item.video_id,
        courseId: courseId,
      });
    }
  };

  const ViewPdf = async item => {
    await navigation.navigate('ViewPdf', {
      pdfs: item.document,
    });
  };

  const startExam = async item => {
    await navigation.navigate('Test Series', {
      item,
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
    handleFetchData();
    getContents();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Subfolders Section */}
        {getData.data && getData.data.length > 0 && (
          <>
            <SectionHeader title="Folders" icon="folder-open" count={getData.data.length} />
            <FlatList
              data={getData.data}
              keyExtractor={item => String(item.id)}
              removeClippedSubviews
              initialNumToRender={4}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => ViewContents(item)}
                  activeOpacity={0.7}
                >
                  <View style={{
                    marginHorizontal: 16,
                    marginVertical: 6,
                    padding: 16,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: '#f0f0f0',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        width: 70,
                        height: 70,
                        borderRadius: 12,
                        backgroundColor: '#fef3c7',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <FontAwesome name="folder" color="#f59e0b" size={36} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: 6,
                        }}>
                          {item.folders}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                          {item.videos > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <FontAwesome name="play-circle" color="#6b7280" size={12} />
                              <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>
                                {item.videos} Videos
                              </Text>
                            </View>
                          )}
                          {item.documents > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <FontAwesome name="file-text" color="#6b7280" size={12} />
                              <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>
                                {item.documents} Docs
                              </Text>
                            </View>
                          )}
                          {item.testseries > 0 && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <FontAwesome name="edit" color="#6b7280" size={12} />
                              <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>
                                {item.testseries} Tests
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <FontAwesome name="chevron-right" color="#d1d5db" size={16} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {/* Videos Section */}
        {getVideo && getVideo?.length > 0 && (
          <>
            <SectionHeader title="Videos" icon="play-circle" count={getVideo.length} />
            <FlatList
              data={getVideo}
              keyExtractor={item => String(item.id)}
              removeClippedSubviews
              initialNumToRender={4}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={{
                  marginHorizontal: 16,
                  marginVertical: 6,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                }}>
                  <View style={{ flexDirection: 'row', padding: 12 }}>
                    <View style={{ position: 'relative' }}>
                      <Image
                        source={{
                          uri: `http://img.youtube.com/vi/${item.video_id}/hqdefault.jpg`,
                        }}
                        style={{
                          width: 120,
                          height: 90,
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                      />
                      <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 12,
                      }}>
                        <FontAwesome name="play-circle" color="#fff" size={32} />
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
                      <View>
                        <Text numberOfLines={2} style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: 4,
                        }}>
                          {item.title}
                        </Text>
                        <Text numberOfLines={2} style={{
                          fontSize: 13,
                          color: '#6b7280',
                        }}>
                          {item.description.replace(regex, '')}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => { playVideo(item); }}
                        style={{ opacity: isPaid ? 1 : (item.status ? 1 : 0.5) }}
                        disabled={isPaid ? false : !item.status}
                        activeOpacity={0.8}
                      >
                        <View style={{
                          backgroundColor: '#2563eb',
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'flex-start',
                        }}>
                          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                            Watch
                          </Text>
                          {!isPaid && (
                            <FontAwesome 
                              name={item.status ? "unlock" : "lock"} 
                              color="#fff" 
                              size={13} 
                              style={{ marginLeft: 6 }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {/* Documents Section */}
        {getDocument && getDocument?.length > 0 && (
          <>
            <SectionHeader title="Documents" icon="file-text" count={getDocument.length} />
            <FlatList
              data={getDocument}
              keyExtractor={item => String(item.id)}
              removeClippedSubviews
              initialNumToRender={4}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={{
                  marginHorizontal: 16,
                  marginVertical: 6,
                  padding: 16,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      width: 70,
                      height: 90,
                      borderRadius: 12,
                      backgroundColor: '#fef3c7',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}>
                      <FontAwesome name="file-pdf-o" color="#ef4444" size={36} />
                      {!isPaid && (
                        <View style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: '#fff',
                          borderRadius: 12,
                          padding: 4,
                        }}>
                          <FontAwesome 
                            name={item.status ? "unlock" : "lock"} 
                            color={item.status ? "#22c55e" : "#6b7280"} 
                            size={12} 
                          />
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text numberOfLines={2} style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: 4,
                      }}>
                        {item.doc_name}
                      </Text>
                      <Text numberOfLines={2} style={{
                        fontSize: 13,
                        color: '#6b7280',
                        marginBottom: 12,
                      }}>
                        {item.description.replace(regex, '')}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => { ViewPdf(item); }}
                          style={{ opacity: isPaid ? 1 : (item.status ? 1 : 0.5), flex: 1 }}
                          disabled={isPaid ? false : !item.status}
                          activeOpacity={0.8}
                        >
                          <View style={{
                            backgroundColor: '#2563eb',
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                              View PDF
                            </Text>
                          </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                          onPress={() => DownloadFiles(item.document)}
                          style={{
                            opacity: isPaid ? 1 : (item.download_status ? 1 : 0.5),
                            flex: 1,
                          }}
                          disabled={isPaid ? false : !item.download_status}
                          activeOpacity={0.8}
                        >
                          <View style={{
                            backgroundColor: '#10b981',
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: 'center',
                          }}>
                            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                              Download
                            </Text>
                          </View>
                        </TouchableOpacity> */}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {/* Exams Section */}
        {getExam && getExam?.length > 0 && (
          <>
            <SectionHeader title="Test Series" icon="edit" count={getExam.length} />
            <FlatList
              data={getExam}
              keyExtractor={item => String(item.id)}
              removeClippedSubviews
              initialNumToRender={4}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={{
                  marginHorizontal: 16,
                  marginVertical: 6,
                  padding: 16,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      width: 70,
                      height: 90,
                      borderRadius: 12,
                      backgroundColor: '#dbeafe',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <FontAwesome name="file-text-o" color="#2563eb" size={36} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text numberOfLines={2} style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: 8,
                      }}>
                        {item.title}
                      </Text>
                      <View style={{ marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <FontAwesome name="refresh" color="#6b7280" size={12} />
                          <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 6 }}>
                            Attempts: {item.attempt}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <FontAwesome name="check-circle" color="#22c55e" size={12} />
                          <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 6 }}>
                            Marks: {item.marks}
                          </Text>
                          <FontAwesome name="times-circle" color="#ef4444" size={12} style={{ marginLeft: 12 }} />
                          <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 6 }}>
                            Negative: {item.negative_marks}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => { startExam(item); }}
                        style={{ opacity: isPaid ? 1 : (item.status ? 1 : 0.5) }}
                        disabled={isPaid ? false : !item.status}
                        activeOpacity={0.8}
                      >
                        <View style={{
                          backgroundColor: '#8b5cf6',
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                            Start Test
                          </Text>
                          {!isPaid && (
                            <FontAwesome 
                              name={item.status ? "unlock" : "lock"} 
                              color="#fff" 
                              size={13} 
                              style={{ marginLeft: 6 }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
        
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default Contents;