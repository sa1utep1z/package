import React, {useRef, useEffect, useState} from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import BottomList from "../../../../components/List/BottomList";
import { TAB_OF_LIST } from "../../../../utils/const";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";

const DATA_Statistics = () => {
  const navigation = useNavigation();

  const detailRef = useRef(null);
  const memberDetailRef = useRef(null);
  const signUpStateRef = useRef(null);
  const callPhoneRef = useRef(null);

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  const showFactoryDetail = () => detailRef.current.setShowDetail(true);
  const showMemberDetail = () => memberDetailRef.current.setShowDetail(true);
  const showSignUpDetail = () => signUpStateRef.current.setShowDetail(true);
  const callMemberPhone = () => callPhoneRef.current.setShowCallPhone(true);

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

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.name, pressFun: () => showDialog('companyDetail') },
      { fieldName: item.person, pressFun: showMemberDetail },
      { fieldName: item.type, pressFun: showSignUpDetail },
      { fieldName: item.phone ,pressFun: callMemberPhone, textStyle: {color: '#409EFF'}}
    ];
  }
  return (
    <View style={styles.screen}>
      <HeaderSearch noStoreAndStaff/>
      <CenterSelectDate />
      <BottomList 
        list={list}
        tabList={TAB_OF_LIST.SIGN_UP_LIST}
        renderItem={renderItem}
        showFactoryDetail={showFactoryDetail}
        showMemberDetail={showMemberDetail}
        showSignUpDetail={showSignUpDetail}
        callMemberPhone={callMemberPhone}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  }
});

export default DATA_Statistics;