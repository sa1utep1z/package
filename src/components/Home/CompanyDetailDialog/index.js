import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

const CompanyDetailDialog = ({
    message,
    transferFactory
  }, ref) => {
  const [showDetail, setShowDetail] = useState(false);

  useImperativeHandle(ref, () => {
    return { setShowDetail, showDetail };
  }, []);

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
              <Icon
                name='calendar' 
                type='antdesign'
                style={styles.icon}
              />
              <Text style={{color: '#999999'}}>2022-04-09</Text>
            </View>
          </View>
          <View style={styles.itemDateArea}>
            <Text>订单名称：</Text>
            <View style={styles.itemDate}>
              <Icon
                name='calendar' 
                type='antdesign'
                style={styles.icon}
              />
              <Text style={{color: '#999999'}}>2022-04-09</Text>
            </View>
          </View>
          <ScrollView style={styles.message}>
            <Text>{message}</Text>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.bottomBtn} onPress={()=>setShowDetail(!showDetail)}>
          <Text style={styles.btnText}>确 定</Text>
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
    paddingLeft: 20, 
    marginVertical: 6
  },
  itemDate: {
    height: '100%',
    borderWidth: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    borderRadius: 3, 
    borderColor: '#999999'
  },
  message: {
    flex: 1, 
    marginBottom: 15,
    marginTop: 5
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
    color: '#fff'
  },
  listText: {
    position: 'absolute', 
    right: 0, 
    fontSize: 13, 
    color: '#409EFF'
  }
})

export default forwardRef(CompanyDetailDialog);