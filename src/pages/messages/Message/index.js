import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import NAVIGATION_KEYS from "../../../navigator/key";
import MessageApi from "../../../request/MessageApi"
import moment from 'moment';

const Message = () => {
  const navigation = useNavigation();
  const [messageInfo, setMessageInfo] = useState([]); // 消息数据

  // 跳转离职提醒页
  const toResignation = (value) => {
    navigation.navigate(NAVIGATION_KEYS.RESIGNATION_MESSAGE, {
      type: value,
    })
  };

  // 跳转回访提醒页
  const toReVisit = (value) => {
    navigation.navigate(NAVIGATION_KEYS.REVISIT_MESSAGE, {
      type: value,
    })
  };

  // 跳转系统信息页
  const toSystems = (value) => {
    navigation.navigate(NAVIGATION_KEYS.SYSTEM_MESSAGE, {
      type: value,
    })
  };

  // 跳转公告消息
  const toNotice = (value) => {
    navigation.navigate(NAVIGATION_KEYS.NOTICE_MESSAGE, {
      type: value,
    })
  };

  // 跳转通知消息
  const toAdvise = (value) => {
    navigation.navigate(NAVIGATION_KEYS.ADVISE_MESSAGE, {
      type: value,
    })
  };

  // 获取消息列表数据
  const messageData = async () => {
    try {
      const res = await MessageApi.MessageType()
      if (res.code === 0) {
        setMessageInfo(res.data);
        console.log('打印消息数据：', res)
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useFocusEffect(React.useCallback(() => {
    messageData();
	}, []));

  return (
    <View style={styles.index}>
      {
        messageInfo.map((item) => {
          return (
            <TouchableOpacity key={item.type} style={styles.contentBox} onPress={item.type === 'INNER_JOB_NOTIFICATION' ? () =>toResignation(item.type) : item.type === 'INNER_VISIT_NOTIFICATION' ? () =>toReVisit(item.type) : item.type === 'INNER_SYSTEM_MESSAGE' ? () =>toSystems(item.type) : item.type === 'ANNOUNCEMENT' ? () =>toNotice(item.type) : () =>toAdvise(item.type)}>
              {item.type === 'INNER_JOB_NOTIFICATION' ? <AntDesign
                name='exclamationcircleo'
                color='#409EFF'
                size={60}
                style={styles.iconStyle}
              /> : item.type === 'INNER_VISIT_NOTIFICATION' ? <AntDesign
                name='message1'
                color='#409EFF'
                size={60}
                style={styles.iconStyle}
              /> : item.type === 'INNER_SYSTEM_MESSAGE' ? <FontAwesome
                name='bell-o'
                color='#409EFF'
                size={60}
                style={styles.iconStyle}
              /> : item.type === 'ANNOUNCEMENT' ? <AntDesign
                name='notification'
                color='#409EFF'
                size={60}
                style={styles.iconStyle}
              /> : <EvilIcons
                name='comment'
                color='#409EFF'
                size={90}
                style={styles.iconStyle}
              />}
              <View style={styles.content}>
                <Text style={styles.title}>{item.type === 'INNER_JOB_NOTIFICATION' ? '离职提醒' : item.type === 'INNER_VISIT_NOTIFICATION' ? '回访提醒' : item.type === 'INNER_SYSTEM_MESSAGE' ? '系统消息' : item.type === 'ANNOUNCEMENT' ? '公告' : '通知'}</Text>
                <Text style={styles.tips}>{item.lastMessageContent ? item.lastMessageContent : '暂无新消息'}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.time}>{item.lastMessageTime ? moment(item.lastMessageTime).format('MM-DD hh:mm') : ''}</Text>
                {
                  item.unReadMessageCount ? <View style={styles.border}>
                      <Text style={styles.number}>{item.unReadMessageCount}</Text>
                    </View> : ''
                }
              </View>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  index: {
    width: '100%',
    // flex: 1,
    backgroundColor: '#EEF4F7',
    paddingTop: 30
  },
  topStyle: {
    width: 686,
    height: 194,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 30,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10
  },
  iconStyle: {
    textAlign: 'center',
  },
  box: {
    textAlign: 'center',
  },
  contentBox: {
    width: 686,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 30,
    marginTop: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  content: {
    width: '65%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
  },
  tips: {
    fontSize: 28,
    color: '#333',
    marginTop: 10,
  },
  right: {
    minWidth: 100,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 24,
    color: '#999',
    textAlign: 'center',
  },
  border: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: '#E71B1B',
  },
  number: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    lineHeight: 35
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26,
    color: '#CCCCCC',
    // marginTop: 10
  },
})
export default Message;