import React, {useRef, useState, useMemo} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import moment from "moment";
import { useToast } from "react-native-toast-notifications";

import InternationalSeaApi from "../../../../request/InternationalSeaApi";
import EmptyArea from "../../../../components/EmptyArea";
import NormalDialog from "../../../../components/NormalDialog";
import { SEAS_SOURCE_TYPE, SUCCESS_CODE } from "../../../../utils/const";
import { replaceMobile } from "../../../../utils";

const InternationalSea = () => {
  const toast = useToast();

  const dialogRef = useRef(null);

  const [dialogContent, setDialogContent] = useState({});
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { isLoading, data = {data: []}, isError, status, refetch } = useQuery(['internationalSea', refresh], InternationalSeaApi.InternationalSea);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系管理员处理！`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(() => {
    if(data && data?.data.length){
      data.data.map(item => item.selected = false);
      setList(data.data);
    }
  }, [data])

  const receiveOnPress = async(item) => {
    try{
      const res = await InternationalSeaApi.Receive(item.poolId);
      if(res.code !== SUCCESS_CODE){
        toast.show(`领取失败，${res.msg}`, { type: 'danger' });
        return;
      }
      toast.show(`领取成功`, { type: 'success' });
      const findItem = list.find(listItem => listItem.poolId === item.poolId);
      findItem.selected = !item.selected;
      setList([...list]);
    }catch(err) {
      toast.show(`出现了意料之外的问题，请联系管理员处理！`, { type: 'danger' });
    }finally{
      dialogRef?.current.setShowDialog(false);
    }
  };

  const receiveMember = (item) => {
    dialogRef?.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '温馨提示',
      dialogComponent: <Text style={{textAlign: 'center', marginVertical: 20}}>确定领取该会员吗？</Text>,
      confirmOnPress: () => receiveOnPress(item)
    });
  };

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      progressBackgroundColor="rgba(0,0,0,0)"
      colors={['#409EFF', 'red', 'green', 'black']}
      progressViewOffset={50}
      onRefresh={() => refetch()} 
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
              <Text style={styles.text}>{item.userName || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>微信昵称：</Text>
              </View>
              <Text style={styles.text}>{item.weChatName || '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>手机号：</Text>
              </View>
              <Text style={styles.text}>{item.mobile ? replaceMobile(item.mobile) : '无'}</Text>
            </View>
            <View style={styles.textArea}>
              <View style={styles.titleArea}>
                <Text style={styles.text}>身份证号：</Text>
              </View>
              <Text style={styles.text}>{item.idNo || '无'}</Text>
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
              <TouchableOpacity style={[styles.pressBtn, item.selected && {backgroundColor: '#CCCCCC'}]} onPress={() => receiveMember(item)}>
                <Text style={styles.btnText}>{item.selected ? '已领取':'领取'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }) : <EmptyArea />}
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 28
  },
  screen: {
    flex: 1
  },
  itemArea: {
    alignItems: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: 28, 
    marginBottom: 28, 
    borderRadius: 10
  },
  textArea: {
    minHeight: 60, 
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    width: '100%', 
    paddingHorizontal: 20,
    color: '#000'
  },
  titleArea: {
    minWidth: 160
  },
  text: {
    color: '#000',
    fontSize: 28
  },
  pressBtn: {
    marginRight: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 2, 
    borderRadius: 8, 
    backgroundColor: '#409EFF'
  },
  btnText: {
    fontSize: 28,
    color: '#fff', 
    textAlign: 'center'
  },
  lastItem: {
    height: 100,
    borderBottomWidth: 0, 
    justifyContent: 'space-between'
  },
  leftArea: {
    flexDirection: 'row'
  }
});

export default InternationalSea;