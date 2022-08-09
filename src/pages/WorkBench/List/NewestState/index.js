import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO, TAB_OF_LIST } from "../../../../utils/const";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";

const NewestState = () => {
  const navigation = useNavigation();

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const gotoTransferFactory = () => {
    detailRef?.current?.setShowDetail(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY);
  };

  const gotoEditMemberInfo = () => {
    memberDetailRef?.current?.setShowDetail(false);
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER, memberInfoList);
  };

  const showFactoryDetail = () => console.log('你点击了1');
  const showMemberDetail = () => console.log('你点击了2');;
  const showNewestDialog = () => console.log('你点击了3');;
  const callMemberPhone = () => console.log('你点击了4');;
  const gotoRecordOfWorking = () => navigation.navigate(NAVIGATION_KEYS.RECORD_OF_WORKING)

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.name, pressFun: callMemberPhone, textStyle: {color: '#409EFF'}},
      { fieldName: item.factory, pressFun: showFactoryDetail },
      { fieldName: item.card, pressFun: showMemberDetail },
      { fieldName: item.state, pressFun: showNewestDialog },
      { fieldName: item.press, pressFun: gotoRecordOfWorking, textStyle: {color: '#409EFF'}},
      { fieldName: item.press ,pressFun: showMemberDetail, textStyle: {color: '#409EFF'}}
    ];
    
    return (
      // <View key={item.id} style={styles.listStyle}>
      //   {renderList.map((renderItem, index) => (
      //     <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
      //       <Text style={[styles.itemText, renderItem.textStyle]}>{renderItem.fieldName !== item.press ? renderItem.fieldName : '查看'}</Text>
      //       {renderItem.fieldName === item.name && <Entypo name='phone' size={16} color='#409EFF'/>}
      //     </TouchableOpacity>
      //   ))}
      // </View>
      <View style={{height: 20, borderWidth: 1}}></View>
    )
  };

  return (
    <View style={[styles.screen]}>
      <HeaderSearch />
      <CenterSelectDate centerDateStyle={{marginBottom: 0}} />
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{[].length}</Text> 条数据</Text>
      </View> 
      <BottomList 
        list={[]}
        renderItem={renderItem}
        tab={TAB_OF_LIST.NEWEST_STATE}
        // noNumber
        // tabStyle={{height: 80}}
        tabTextStyle={{fontSize: 30}}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  numberOfList: {
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  text: {
    color: '#409EFF', 
    fontSize: 26
  },
  number: {
    color: 'red'
  },
  listStyle: {
    minHeight: 35, 
    maxHeight: 35,
    borderColor: '#e3e3e3', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 12,
    color: '#000'
  }
});

export default NewestState;