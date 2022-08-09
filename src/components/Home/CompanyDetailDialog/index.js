import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

const CompanyDetailDialog = ({
    message,
    transferFactory
  }, ref) => {
  const [showDetail, setShowDetail] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDetail, showDetail };
  }, []);

  const date = String(message.recruitRange).substring(5, 11);
  const date2 = String(message.recruitRange).substring(16, 20)
  const recruitRange = date + date2
  
  return (
    <Dialog
      isVisible={showDetail}
      onBackdropPress={()=> setShowDetail(!showDetail)}>
      <View style={styles.msgArea}>
        <Text style={styles.title}>岗位信息</Text>
        {transferFactory && <Text style={styles.listText} onPress={transferFactory}>转厂/转单</Text>}
        <View style={styles.topArea}>
          <View style={styles.itemDateArea}>
            <Text>订单日期：</Text>
            <View style={styles.itemDate}>
              <Text style={{color: '#444444'}}>{recruitRange}</Text>
            </View>
          </View>
          <View style={styles.itemDateArea}>
            <Text>订单名称：</Text>
            <View style={styles.itemDate}>
              <Text style={{color: '#444444'}}>{message.orderName}</Text>
            </View>
          </View>
          <ScrollView style={styles.message}>
            <Text style={styles.fontStyle}>{message.orderPolicyDetail ? String(message.orderPolicyDetail).replace(/<br\/>/g,"\n") : '无'}</Text>
            {/* <WebView scalesPageToFit={false} originWhitelist={['*']} source={{ html: message.orderPolicyDetail }}></WebView> */}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.bottomBtn} onPress={()=>setShowDetail(!showDetail)}>
          <Text style={styles.btnText}>确定</Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    height: 450, 
    alignItems: 'center'
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold'
  },
  topArea: {
    flex: 1, 
    width: '100%',
    paddingTop: 5
  },
  itemDateArea: {
    height: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10
  },
  itemDate: {
    height: '100%',
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: 'rgba(0,0,0,.05)'
  },
  message: {
    flex: 1, 
    marginBottom: 15,
    marginTop: 5,
    color: '#444444',
    fontSize: 14,
  },
  bottomBtn: {
    height: 40, 
    width: '100%', 
    backgroundColor: '#409EFF', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  btnText: {
    fontSize: 20, 
    color: '#fff',
    letterSpacing: 10,
  },
  listText: {
    position: 'absolute', 
    right: 0, 
    fontSize: 13, 
    color: '#409EFF'
  }
})

export default forwardRef(CompanyDetailDialog);