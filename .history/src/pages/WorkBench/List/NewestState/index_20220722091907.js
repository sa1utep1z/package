import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import CompanyDetailDialog from "../../../../components/Home/CompanyDetailDialog";
import MemberDetailDialog from "../../../../components/List/MemberDetailDialog";
import NewestStateDialog from "../../../../components/List/NewestStateDialog";
import CallPhoneDialog from "../../../../components/List/CallMemberPhoneNumber";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO, TAB_OF_LIST } from "../../../../utils/const";

const NewestState = () => {
  const navigation = useNavigation();

  const detailRef = useRef(null);
  const memberDetailRef = useRef(null);
  const NewestStateDialogRef = useRef(null);
  const callPhoneRef = useRef(null);

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  let list = [];
  for(let i = 0; i < 30; i++){
    list.push({
      id: `${i}`,
      name: `某某${i+1}`,
      factory: `厂名哈${i+1}`,
      card: `${i%2 === 0 ? '两卡全': i % 3 === 0 ? '缺身份证' : i%5 === 0 ? '缺银行卡': i% 7 ===0 ? '两卡不全': '缺心眼儿'} `,
      state: `${i%2 === 0 ? '在职' : i%3 === 0 ? '离职': '未报到'}`,
      phone: `18011111111`
    })
  };

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

  const gotoTransferFactory = () => {
    detailRef?.current?.setShowDetail(false);
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY);
  };

  const gotoEditMemberInfo = () => {
    memberDetailRef?.current?.setShowDetail(false);
    navigation.navigate(NAVIGATION_KEYS.EDIT_MEMBER, memberInfoList);
  };

  const showFactoryDetail = () => detailRef.current.setShowDetail(true);
  const showMemberDetail = () => memberDetailRef.current.setShowDetail(true);
  const showNewestDialog = () => NewestStateDialogRef.current.setShowDetail(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);
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
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.textStyle]}>{renderItem.fieldName !== item.press ? renderItem.fieldName : '查看'}</Text>
            {renderItem.fieldName === item.name && <Entypo name='phone' size={16} color='#409EFF'/>}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={[styles.screen, showSearch && {paddingTop: 10}]}>
      <HeaderSearch />
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{list.length}</Text> 条数据</Text>
      </View> 
      <BottomList 
        list={list}
        renderItem={renderItem}
        tabList={TAB_OF_LIST.NEWEST_STATE}
      />
      <CompanyDetailDialog 
        ref={detailRef}
        message={msg} 
        transferFactory={gotoTransferFactory}
      />
      <MemberDetailDialog 
        ref={memberDetailRef} 
        memberInfoList={memberInfoList} 
        edit={gotoEditMemberInfo} 
      />
      <NewestStateDialog
        ref={NewestStateDialogRef}
      />
      <CallPhoneDialog 
        ref={callPhoneRef} 
        memberInfo={memberInfoList} 
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  numberOfList: {
    height: 20,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text: {
    color: '#409EFF', 
    fontSize: 12
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