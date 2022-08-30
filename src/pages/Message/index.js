import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NAVIGATION_KEYS from "../../navigator/key";
import MessageApi from "../../request/MessageApi"
import { empty } from "../../pages/Home/listComponent";

const Message = () => {
  const navigation = useNavigation();
  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });
  const [messageInfo, setMessageInfo] = useState([]); // 消息数据
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [originData, setOriginData] = useState({});
  //滑动到底部的时候会有多次触发底部函数，防抖作用；
  const [load, setLoad] = useState(true);

  // 跳转离职提醒页
  const toResignation = () => {
    navigation.navigate(NAVIGATION_KEYS.RESIGNATION_MESSAGE)
  };

  // 跳转回访提醒页
  const toReVisit = () => {
    navigation.navigate(NAVIGATION_KEYS.REVISIT_MESSAGE)
  };

  // 获取消息列表数据
  const messageData = async (value) => {
    try {
      const res = await MessageApi.MessageList(value)
      if (res.code === 0) {
        setMessageInfo(res.data.content);
        console.log('打印消息数据：', res)
      }
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  useEffect(() => {
    messageData(searchContent)
  }, [searchContent]);

  const data = [
    {
      title: '离职提醒',
      content: '会员张三在2022年8月1日离职',
      time: '08:00',
      number: 1
    },
    {
      title: '系统消息',
      content: '管理系统升级啦！增加回访...',
      time: '周一',
      number: 1
    },
    {
      title: '回访提醒',
      content: '您预约2022年8月22日回访...',
      time: '2022/08/20',
      number: 1
    },
  ]

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
  let renderData = [];
  const renderItem = ({ item }) => {
    console.log('打印item的值：', item)
    renderData.push(item)
    console.log('打印item的值：', renderData)
    return (
      <>
        <View style={styles.contentBox}>
          <AntDesign
            name='exclamationcircleo'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <View style={styles.content}>
            <Text style={styles.title}>离职提醒</Text>
            <Text style={styles.tips}>会员张三在2022年8月1日离职</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.time}>08:00</Text>
            <View style={styles.border}>
              <Text style={styles.number}>4</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentBox}>
          <FontAwesome
            name='bell-o'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <View style={styles.content}>
            <Text style={styles.title}>系统消息</Text>
            <Text style={styles.tips}>管理系统升级啦！增加回访...</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.time}>周一</Text>
            <View style={styles.border}>
              <Text style={styles.number}>1</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentBox}>
          <AntDesign
            name='message1'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <View style={styles.content}>
            <Text style={styles.title}>回访提醒</Text>
            <Text style={styles.tips}>您预约2022年8月22日回访...</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.time}>2022/8/20</Text>
            <View style={styles.border}>
              <Text style={styles.number}>40</Text>
            </View>
          </View>
        </View>
      </>
    )
  };

  return (
    <View style={styles.index}>
      <View style={styles.topStyle}>
        <TouchableOpacity style={styles.box} onPress={toResignation}>
          <AntDesign
            name='exclamationcircleo'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <Text style={styles.textStyle}>离职提醒</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={toReVisit}>
          <AntDesign
            name='message1'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <Text style={styles.textStyle}>回访提醒</Text>
        </TouchableOpacity>
        <View style={styles.box}>
          <FontAwesome
            name='bell-o'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <Text style={styles.textStyle}>系统消息</Text>
        </View>
        <View style={styles.box}>
          <AntDesign
            name='notification'
            color='#409EFF'
            size={60}
            style={styles.iconStyle}
          />
          <Text style={styles.textStyle}>通知公告</Text>
        </View>
      </View>
      <FlatList
        data={messageInfo}
        refreshing={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.id}
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
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 30,
    marginTop: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15
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