import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';

import { MEMBER_INFO_KEY, FAKE_MEMBER_INFO, GENDER, SEAS_SOURCE_TYPE } from '../../../utils/const'; 
import moment from 'moment';
import EmptyArea from '../../EmptyArea';

const FormMemberDetail = ({
  memberInfoList = FAKE_MEMBER_INFO
}) => {
  const[showList, setShowList] = useState([
    {type: 'name', title: '姓名', value: ''},
    {type: 'idNo', title: '身份证', value: ''},
    {type: 'mobile', title: '手机号', value: ''},
    {type: 'orderName', title: '职位名称', value: ''}, 
    {type: 'signUpType', title: '来源渠道', value: ''}, 
    {type: 'recruitName', title: '经纪人', value: ''}, 
    {type: 'storeName', title: '归属门店', value: ''}, 
    {type: 'status', title: '面试状态', value: ''}, 
    {type: 'arrivalMode', title: '到厂方式', value: ''}, 
    {type: 'signUpTime', title: '录入时间', value: ''}, 
    // {title: '备注', value: ''}, 
    // {title: '是否住宿', value: ''}
  ]);

  useEffect(() => {
    for(let key in memberInfoList){
      if(showList.length){
        const findItem = showList.find(item => item.type === key);
        if(findItem){
          findItem.value = memberInfoList[key];
        }
      }
    }
    setShowList(showList);
  }, [memberInfoList])

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);  
  };

  return (
    <ScrollView style={styles.msgArea}>
      <View style={styles.topArea}>
        {showList?.length ? showList.map((item, index) => {
          return (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberItem_text}>{item.title}：</Text>
              {item.type === 'mobile' ? <TouchableOpacity style={[styles.memberItem_value, {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]} onPress={()=>callPhone(item)}>
                <Text style={{color: '#409EFF'}}>{item.value}</Text>
                <Entypo name='phone' size={16} color='#409EFF'/>
              </TouchableOpacity> : <View style={styles.memberItem_value}>
                <Text>{item.value || '无'}</Text>
              </View>}
            </View>
          )
        }) : <EmptyArea />}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  msgArea: {
    maxHeight: 350,
    marginHorizontal: 10
  },
  topArea: {
    width: '100%',
    paddingHorizontal: 20
  },
  memberItem: {
    height: 30,
    flexDirection: 'row'
  },
  memberItem_text: {
    textAlignVertical: 'center',
    textAlign: 'left'
  },
  memberItem_value: {
    flex: 1, 
    justifyContent: 'center', 
    marginLeft: 5, 
    paddingLeft: 3
  }
})

export default FormMemberDetail;