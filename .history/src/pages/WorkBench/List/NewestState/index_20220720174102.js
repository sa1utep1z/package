import React, {useRef, useEffect, useState} from "react";
import { View, StyleSheet, TouchableOpacity} from 'react-native';
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
      name: `某某${i+1}`,
      factory: `厂名${i+1}`,
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
  const showSignUpDetail = () => signUpStateRef.current.setShowDetail(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.listStyle}>
        <TouchableOpacity key={1} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={callMemberPhone}>
          <Text style={{fontSize: 12}}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={2} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 12}}>{item.factory}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={showSignUpDetail}>
          <Text style={{fontSize: 12}}>{item.card}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={4} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={callMemberPhone}>
          <Text style={{fontSize: 12}}>{item.state}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={5} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={callMemberPhone}>
          <Text style={[{fontSize: 12}, styles.canPress]}>查看</Text>
        </TouchableOpacity>
        <TouchableOpacity key={6} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={callMemberPhone}>
          <Text style={[{fontSize: 12}, styles.canPress]}>查看</Text>
        </TouchableOpacity>
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
  },
  listStyle: {
    minHeight: 35, 
    maxHeight: 35,
    borderColor: '#e3e3e3', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
  },
  listFirst: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start'
  },
  listFlex5: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  listLast: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  canPress: {
    color: '#409EFF'
  }
});

export default NewestState;