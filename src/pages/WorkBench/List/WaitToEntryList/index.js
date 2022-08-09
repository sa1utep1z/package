import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';
import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import CompanyDetailDialog from "../../../../components/Home/CompanyDetailDialog";
import MemberDetailDialog from "../../../../components/List/MemberDetailDialog";
import SignUpStateDialog from "../../../../components/List/SignUpStateDialog";
import CallPhoneDialog from "../../../../components/List/CallMemberPhoneNumber";
import BottomList from "../../../../components/List/BottomList";
import ListApi from "../../../../request/ListApi";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO,SUCCESS_CODE, TAB_OF_LIST } from "../../../../utils/const";

const WaitToEntryList = () => {
  const navigation = useNavigation();

  const detailRef = useRef(null);
  const memberDetailRef = useRef(null);
  const signUpStateRef = useRef(null);
  const callPhoneRef = useRef(null);
  const [searchContent, setSearchContent] = useState({ 
    pageSize: 20, 
    pageNumber: 0
  });
  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);

  // 获取待入职名单数据
  const { isLoading, data, isError, status } = useQuery(['waitList', searchContent], ListApi.GetWaitList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }
  console.log('打印获取的数据：', data)
  console.log('打印获取的参数：', searchContent)
  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

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
  const showSignUpDetail = () => signUpStateRef.current.setShowDetail(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);

  const batchOperate = () => navigation.navigate(NAVIGATION_KEYS.BATCH_OPERATE_LIST);

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.name, pressFun: showFactoryDetail },
      { fieldName: item.person, pressFun: showMemberDetail },
      { fieldName: item.type, pressFun: showSignUpDetail },
      { fieldName: item.phone ,pressFun: callMemberPhone, textStyle: {color: '#409EFF'}}
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[styles.itemText, renderItem.textStyle]}>{renderItem.fieldName}</Text>
            {renderItem.fieldName === item.phone && <Entypo name='phone' size={16} color='#409EFF'/>}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        noStoreAndStaff
        batchOperate={batchOperate}
      />
      <CenterSelectDate />
      <BottomList 
        list={[]}
        tab={TAB_OF_LIST.WAIT_TO_ENTRY_LIST}
        renderItem={renderItem}
        showFactoryDetail={showFactoryDetail}
        showMemberDetail={showMemberDetail}
        showSignUpDetail={showSignUpDetail}
        callMemberPhone={callMemberPhone}
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
      <SignUpStateDialog 
        ref={signUpStateRef} 
        memberInfo={memberInfoList} 
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
    flex: 1,
    paddingTop: 10
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

export default WaitToEntryList;