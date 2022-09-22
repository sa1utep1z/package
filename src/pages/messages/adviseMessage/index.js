import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image } from "react-native";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { empty } from "../../Home/listComponent";
import MessageApi from "../../../request/MessageApi";
import moment from 'moment';

const AdviseMessage = (props) => {
  const { route: { params } } = props;
  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0, type: params.type });
  const [messageInfo, setMessageInfo] = useState([]); // 消息数据
  const [isLoading, setIsLoading] = useState(false); // 是否展开
  const [isOpen, setIsOpen] = useState(false);
  const [messageId, setMessageId] = useState('');
  const [nextPage, setNextPage] = useState(false);
  const [originData, setOriginData] = useState({});
  //滑动到底部的时候会有多次触发底部函数，防抖作用；
  const [load, setLoad] = useState(true);

  // 获取消息列表数据
  const messageData = async (value) => {
    try {
      const res = await MessageApi.MessageList(value)
      if (res.code === 0) {
        setMessageInfo(res.data.content);
        console.log('打印消息数据：', res, params)
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  // 标记消息已读
  const readMessage = async (value, hasRead) => {
    try {
      if (!hasRead) {
        const res = await MessageApi.MessageRead(value)
        if (res.code === 0) {
          console.log('打印已读消息数据：', res, isOpen);
          messageData(searchContent);
        }
      }
      setIsOpen(!isOpen);
      setMessageId(value);
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useEffect(() => {
    messageData(searchContent)
  }, [searchContent]);

  // 刷新
  const refresh = () => setSearchContent({ ...searchContent });

  const onEndReached = () => {
    if (!load) return;
    if (originData.hasNext) {
      const nextPage = { ...searchContent, pageNumber: searchContent.pageNumber += 1 };
      setSearchContent(nextPage);
      setNextPage(true);
    }
    setLoad(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.contentBox} onPress={() => readMessage(item.messageId, item.hasRead)}>
        <Image
          style={styles.iconStyle}
          source={require('../../../assets/images/advice.png')}
        />
        <View style={styles.content}>
          <View style={styles.topTitle}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time ? moment(item.time).format('MM-DD HH:mm') : ''}</Text>
          </View>
          <Text style={styles.tips}>{item.content}</Text>
          <View style={styles.right}>
            {
              !item.hasRead && <View style={styles.border}></View>
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.index}>
      <FlatList
        data={messageInfo}
        refreshing={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.messageId}
        renderItem={(item) => renderItem(item)}
        getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
        initialNumToRender={15}
        ListFooterComponent={<Text style={styles.bottomText}>{originData?.hasNext ? '加载中...' : '没有更多数据'}</Text>}
        ListEmptyComponent={empty}
        onEndReachedThreshold={0.01}
        onScrollEndDrag={() => setLoad(true)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  index: {
    width: '100%',
    flex: 1,
    backgroundColor: '#EEF4F7',
    paddingTop: 10
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
    width: 70,
    height: 70,
    textAlign: 'center',
    marginTop: 15,
    marginRight: 15,
  },
  box: {
    textAlign: 'center',
  },
  contentBox: {
    width: 686,
    minHeight: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 30,
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 15
  },
  contentBox1: {
    width: 686,
    minHeight: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 30,
    marginBottom: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: 15
  },
  content: {
    width: 550,
    height: '100%',
    display: 'flex',
  },
  topTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
  },
  tips: {
    width: '95%',
    fontSize: 28,
    color: '#333',
    marginTop: 10,
  },
  right: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  time: {
    fontSize: 24,
    color: '#999',
    textAlign: 'center',
  },
  border: {
    width: 15,
    height: 15,
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
    marginTop: 10
  },
})
export default AdviseMessage;