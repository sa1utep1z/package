import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Text } from "@rneui/base";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import CompanyDetailDialog from "../../../../components/Home/CompanyDetailDialog";
import MemberDetailDialog from "../../../../components/List/MemberDetailDialog";
import SignUpStateDialog from "../../../../components/List/SignUpStateDialog";
import CallPhoneDialog from "../../../../components/List/CallMemberPhoneNumber";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO } from "../../../../utils/const";
import { TAB_OF_LIST } from "../../../../utils/const";

const NewestState = () => {
  const navigation = useNavigation();

  const detailRef = useRef(null);
  const memberDetailRef = useRef(null);
  const signUpStateRef = useRef(null);
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
      name: `什么厂${i+1}`,
      person: `什么名${i+1}`,
      type: `${i%2 === 0 ? '已报名' : '未报名'}`,
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
  const showSignUpDetail = () => signUpStateRef.current.setShowDetail(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);

  return (
    <View style={[styles.screen, showSearch && {paddingTop: 10}]}>
      <HeaderSearch />
      <View style={styles.numberOfList}>
        <Text style={styles.text}>共 <Text style={styles.number{color: 'red'}}>{list.length}</Text> 条数据</Text>
      </View>
      <BottomList 
        list={list}
        tabList={TAB_OF_LIST.NEWEST_STATE}
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
  }
});

export default NewestState;