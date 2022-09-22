import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import { Text } from '@rneui/themed';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { MEMBER_INFO_KEY, FAKE_MEMBER_INFO, GENDER, SEAS_SOURCE_TYPE, WATERMARK_LIST_SMALL } from '../../../utils/const'; 
import EmptyArea from '../../EmptyArea';
import { moveArray } from '../../../utils';

const MemberDetail = ({
  memberInfoList = FAKE_MEMBER_INFO
}) => {
  const[showList, setShowList] = useState([]);
  
  const memberInfo = useSelector(state => state.MemberInfo.memberInfo);

  useEffect(()=>{
    let list = [];
    for(let key in memberInfoList){
      switch(key){
        case 'gender': 
          list.push({type: key, title: MEMBER_INFO_KEY[key], value: GENDER[memberInfoList[key]]});
          break;
        case 'age': 
          list.push({type: key, title: MEMBER_INFO_KEY[key], value: `${memberInfoList[key] ? `${memberInfoList[key]}岁` : `无`}`});
          break;
        case 'sourceType': 
          list.push({type: key, title: MEMBER_INFO_KEY[key], value: SEAS_SOURCE_TYPE[memberInfoList[key]]});
          break;
        case 'registerDate':
          list.push({type: key, title: MEMBER_INFO_KEY[key], value: moment(memberInfoList[key]).format('YYYY-MM-DD')});
          break;
        default: 
          list.push({type: key, title: MEMBER_INFO_KEY[key], value: memberInfoList[key]});
          break;
      }
    }
    const bornMonthIndex = list.findIndex(item => item.type === 'bornMonth');
    list[bornMonthIndex] = {type: 'born', title: '生日', value: `${(memberInfoList.bornMonth && memberInfoList.bornDay) ? `${memberInfoList.bornMonth}月${memberInfoList.bornDay}日`: `无`} `}
    list.splice(list.findIndex(item => item.type === "bornDay"), 1);
    setShowList(list);
  },[memberInfoList]);

  const callPhone = (item) => {
    Linking.openURL(`tel:${item.value}`);  
  };
  
  return (
    <ScrollView style={styles.msgArea}>
      <View style={styles.topArea}>
        {showList?.length ? showList.map((item, index) => {
          return (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberItem_text}>{item.title}:</Text>
              {item.type === 'mobile' ? 
                item.value ? 
                  <TouchableOpacity style={[styles.memberItem_value, {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]} onPress={()=>callPhone(item)}>
                <Text style={{color: '#409EFF'}}>{item.value}</Text>
                <Entypo name='phone' size={16} color='#409EFF'/>
              </TouchableOpacity> : <Text style={{textAlignVertical: 'center', paddingLeft: 3}}>无</Text> : 
              <View style={styles.memberItem_value}>
                <Text>{item.value || '无'}</Text>
              </View>}
            </View>
          )
        }) : <EmptyArea />}
      </View>
      <View style={{paddingHorizontal: 30, paddingBottom: 30, right: 0, height: '100%', width: '100%', position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden'}} pointerEvents={'none'}>
        {WATERMARK_LIST_SMALL.map((item, itemIndex) => {
          return (
            <View key={itemIndex} style={[{width: '25%', height: 100, transform: [{ rotateZ: '-15deg' }], justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)'}, {opacity: item} ]}>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.store}</Text>
              <Text style={{ color: 'rgba(0,0,0,0.15)', fontSize: 10 }}>{memberInfo.name}</Text>
            </View>
          )
        })}
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
    textAlign: 'right',
    marginRight: 5
  },
  memberItem_value: {
    flex: 1, 
    justifyContent: 'center', 
    marginLeft: 5, 
    paddingLeft: 3
  }
})

export default MemberDetail;