import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';

const ReVsitMessage = () => (
  <View style={styles.index}>
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
          <Text style={styles.number}>4</Text>
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
          <Text style={styles.number}>6</Text>
        </View>
      </View>
    </View>
  </View>
)

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
    marginBottom: 0,
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
  }
})
export default ReVsitMessage;