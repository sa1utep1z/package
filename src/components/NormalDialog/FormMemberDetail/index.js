import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';

import { MEMBER_INFO_KEY, FAKE_MEMBER_INFO, GENDER, SEAS_SOURCE_TYPE } from '../../../utils/const'; 
import moment from 'moment';
import EmptyArea from '../../EmptyArea';
import { CHANEL_SOURCE_LIST, MEMBERS_STATUS, WAY_TO_GO } from '../../../utils/const';

const FormMemberDetail = ({
  memberInfoList = FAKE_MEMBER_INFO
}) => {
  const[showList, setShowList] = useState([
    {type: 'name', title: '姓名', value: ''},
    {type: 'idNo', title: '身份证', value: ''},
    {type: 'mobile', title: '手机号', value: ''},
    {type: 'orderName', title: '职位名称', value: ''}, 
    {type: 'signUpType', title: '职位来源', value: ''}, 
    {type: 'recruitName', title: '经纪人', value: ''}, 
    {type: 'storeName', title: '归属门店', value: ''}, 
    {type: 'status', title: '报名状态', value: ''}, 
    {type: 'arrivalMode', title: '到厂方式', value: ''}, 
    {type: 'signUpTime', title: '录入时间', value: ''}, 
    // {title: '备注', value: ''}, 
    // {title: '是否住宿', value: ''}
  ]);

  useMemo(() => {
    for(let key in memberInfoList){
      if(showList.length){
        const findItem = showList.find(item => item.type === key);
        if(findItem){
          switch(key){
            case 'signUpType':
              const chanelName = CHANEL_SOURCE_LIST.find(name => name.value === memberInfoList[key]);
              findItem.value = chanelName.title;
              break;
            case 'status':
              findItem.value = MEMBERS_STATUS[memberInfoList[key]];
              break;
            case 'arrivalMode':
              const arriveName = findItem.value = WAY_TO_GO.find(name => name.value === memberInfoList[key]);
              findItem.value = arriveName?.label;
              break;
            case 'signUpTime':
              findItem.value = moment(memberInfoList[key]).format('YYYY-MM-DD');
              break;
            default: 
              findItem.value = memberInfoList[key];
              break;
          }
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
    minHeight: 30,
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