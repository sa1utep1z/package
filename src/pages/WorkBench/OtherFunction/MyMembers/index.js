import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';

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
import MyMembersApi from "../../../../request/MyMembersApi";
import NormalDialog from "../../../../components/NormalDialog";

const MyMembers = () => {
  const navigation = useNavigation();

  const dialogRef = useRef(null);
  const detailRef = useRef(null);
  const memberDetailRef = useRef(null);
  const NewestStateDialogRef = useRef(null);
  const callPhoneRef = useRef(null);

  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [searchContent, setSearchContent] = useState({ pageSize: 20, pageNumber: 0 });

  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const { isLoading, data, isError, error, refetch, status } = useQuery(['myMembers', searchContent], MyMembersApi.MyMemberList);
  console.log('data', data);
  console.log('isError', isError, 'error', error);


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
  const showNewestDialog = () => NewestStateDialogRef.current.setShowDialog(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);
  const gotoRecordOfWorking = () => navigation.navigate(NAVIGATION_KEYS.RECORD_OF_WORKING);
  const showDialog = () => dialogRef.current.setShowDialog(true);

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

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.name, pressFun: callMemberPhone},
      { fieldName: item.factory, pressFun: showFactoryDetail },
      { fieldName: item.press, pressFun: showDialog},
      { fieldName: item.press, pressFun: showDialog},
      { fieldName: item.state},
      { fieldName: item.press ,pressFun: showMemberDetail}
    ];
    
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.textStyle, renderItem.pressFun && {color: '#409EFF'}]}>{renderItem.fieldName !== item.press ? renderItem.fieldName : '查看'}</Text>
            {renderItem.fieldName === item.name && <Entypo name='phone' size={16} color='#409EFF'/>}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  const ruzhiList = [

    {qiye: '富士康-ACKN', rDate: '2022/05/02', lDate: '2022/09/23', days: '100'},
    {qiye: '白石', rDate: '2022/05/02', lDate: '2022/09/23', days: '60'},
    {qiye: '爱普生-BBC', rDate: '2022/05/02', lDate: '2022/09/23', days: '156'},
    {qiye: '哇哈哈', rDate: '2022/05/02', lDate: '2022/09/23', days: '356'}
  ]

  const content = (
    <View style={{minHeight: 30, margin: 10, borderTopWidth: 1, borderLeftWidth: 1, borderBottomWidth: 0, borderColor: '#409EFF'}}>
      <View style={{flexDirection: 'row', backgroundColor: '#ecf5ff'}}>
        <View style={{flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF'}}>
          <Text style={{fontSize: 12, color: '#000', fontWeight: 'bold'}}>入职企业</Text>
        </View>
        <View style={{flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF'}}>
          <Text style={{fontSize: 12, color: '#000', fontWeight: 'bold'}}>入职日期</Text>
        </View>
        <View style={{flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF'}}>
          <Text style={{fontSize: 12, color: '#000', fontWeight: 'bold'}}>离职日期</Text>
        </View>
        <View style={{flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF'}}>
          <Text style={{fontSize: 12, color: '#000', fontWeight: 'bold'}}>在职天数</Text>
        </View>
      </View>
      {ruzhiList.map((item, index) => {
        return (
          <View style={{height: 30, flexDirection: 'row'}} key={index}>
            <Text style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF', fontSize: 11, textAlign: 'center', textAlignVertical: 'center', paddingHorizontal: 5, color: '#000'}}>{item.qiye}</Text>
            <Text style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF', fontSize: 11, textAlign: 'center', textAlignVertical: 'center', paddingHorizontal: 5, color: '#000'}}>{item.rDate}</Text>
            <Text style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF', fontSize: 11, textAlign: 'center', textAlignVertical: 'center', paddingHorizontal: 5, color: '#000'}}>{item.lDate}</Text>
            <Text style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#409EFF', fontSize: 11, textAlign: 'center', textAlignVertical: 'center', paddingHorizontal: 5, color: '#000'}}>{item.days}</Text>
          </View>
        )
      })}
    </View>
  );

  const listHead = (
    <View style={styles.listHead_title}>
      <Text style={styles.listHead_item}>姓名</Text>
      <Text style={styles.listHead_item}>企业</Text>
      <Text style={styles.listHead_item}>入职记录</Text>
      <Text style={styles.listHead_item}>回访记录</Text>
      <Text style={styles.listHead_item}>状态</Text>
      <Text style={styles.listHead_item}>加入报名</Text>
    </View>
  );

  return (
    <View style={[styles.screen, showSearch && {paddingTop: 10}]}>
      <HeaderSearch canFilterStatus/>
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number}>{list.length}</Text> 条数据</Text>
      </View> 
      <BottomList 
        list={list}
        renderItem={renderItem}
        listHead={listHead}
        tabList={TAB_OF_LIST.MY_MEMBERS}
      />
      <NormalDialog 
        ref={dialogRef}
        title="入职记录"
        content={content}
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
}

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
  },
  listHead_title: {
    height: 30, 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderColor: '#e3e3e3'
  },
  listHead_item: {
    flex: 1, 
    textAlign: 'center', 
    textAlignVertical: 'center', 
    fontSize: 12, 
    color: '#000'
  }
});

export default MyMembers;