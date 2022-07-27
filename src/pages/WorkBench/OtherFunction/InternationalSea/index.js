import React, {useRef} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import InternationalSeaApi from "../../../../request/InternationalSeaApi";
import EmptyArea from "../../../../components/EmptyArea";
import { SEAS_SOURCE_TYPE, SUCCESS_CODE } from "../../../../utils/const";
import ReceiveDialog from "../../../../components/Sea/ReceiveDialog";
import ToastInfoInModal from "../../../../components/ToastInfoInModal";
import { footer } from "../../../Home/listComponent";

const InternationalSea = () => {
  const toast = useToast();

  const dialogRef = useRef(null);
  const toastInfoRef = useRef();

  const { isLoading, data = [], isError, error, refetch } = useQuery(['internationalSea'], InternationalSeaApi.InternationalSea);
  console.log('data', data)
  if(isError){
    toast.show(`出现了意料之外的问题，请联系管理员处理！`, { type: 'danger' });
  }
  if(data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  const receiveOnPress = async(item) => {
    try{
      const res = await InternationalSeaApi.Receive(item.poolId);
      console.log('res', res);
      dialogRef?.current.setShowDialog(false);
      if(res.code !== SUCCESS_CODE){
        toastInfoRef.current.toast(`${res.msg}`, 'danger');
        return;
      }
      toastInfoRef.current.toast(`领取成功！`, 'success');
      refetch();
    }catch(err) {
      console.log('err', err);
    }
  };

  const receiveMember = (item) => {
    dialogRef?.current.setShowDialog(true);
    dialogRef?.current.setDialogContent(item);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      progressBackgroundColor="rgba(0,0,0,0)"
      colors={['#409EFF', 'red', 'green', 'black']}
      progressViewOffset={50}
      onRefresh={refetch} 
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.contentContainerStyle} style={styles.screen} refreshControl={refreshControl}>
      {data?.data?.length ? data.data.map((item, index)=>{
        const day = moment(new Date(item.registerDate)).format('YYYY/MM/DD');
        const isLastIndex = data.data.length - 1 === index;
        return (
          <View style={[styles.itemArea]} key={index}>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>姓名：</Text>
              </View>
              <Text style={styles.text}>{item.name || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>微信号：</Text>
              </View>
              <Text style={styles.text}>{item.weChatName || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>手机号：</Text>
              </View>
              <Text style={styles.text}>{item.mobile}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>身份证号：</Text>
              </View>
              <Text style={styles.text}>{item.idNo}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>籍贯：</Text>
              </View>
              <Text style={styles.text}>{item.hometown || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>位置信息：</Text>
              </View>
              <Text style={styles.text}>{item.location || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>会员来源：</Text>
              </View>
              <Text style={styles.text}>{SEAS_SOURCE_TYPE[item.sourceType]}</Text>
            </View>
            <View style={[styles.textArea, styles.lastItem]}>
              <View style={styles.leftArea}>
                <View style={styles.titleArea}>
                  <Text style={styles.text}>注册日期：</Text>
                </View>
                <Text style={styles.text}>{day}</Text>
              </View>
              <TouchableOpacity style={styles.pressBtn} onPress={() => receiveMember(item)}>
                <Text style={styles.btnText}>领取</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }) : <EmptyArea />}
      <ReceiveDialog ref={dialogRef} receive={receiveOnPress}/>
      <ToastInfoInModal ref={toastInfoRef}/>
      {footer()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 10
  },
  screen: {
    flex: 1
  },
  itemArea: {
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 10, 
    marginBottom: 10, 
    borderRadius: 8
  },
  textArea: {
    height: 40, 
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderColor: '#CCCCCC', 
    width: '100%', 
    paddingLeft: 10,
    color: '#000'
  },
  titleArea: {
    width: 80
  },
  text: {
    color: '#000'
  },
  pressBtn: {
    marginRight: 10, 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 3, 
    backgroundColor: '#409EFF'
  },
  btnText: {
    color: '#fff', 
    textAlign: 'center'
  },
  lastItem: {
    borderBottomWidth: 0, 
    justifyContent: 'space-between'
  },
  leftArea: {
    flexDirection: 'row'
  }
});

export default InternationalSea;