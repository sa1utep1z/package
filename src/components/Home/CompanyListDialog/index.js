import React, {useState, useImperativeHandle, forwardRef, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import NAVIGATION_KEYS from '../../../navigator/key';
import EmptyArea from '../../EmptyArea';
import HomeApi from '../../../request/HomeApi';
import CompanyDetailDialog from '../CompanyDetailDialog';

const CompanyListDialog = (props, ref) => {
  const detailRef = useRef(null);
  const navigation = useNavigation();

  const [showList, setShowList] = useState(false);
  const [orderMsg, setOrderMsg] = useState({}); // 订单详情
  const [list, setList] = useState({
    companyName: '',
    list: []
  });

  useEffect(() => {
    setShowList(false);
    return () => setShowList(false);
  }, [])

  useImperativeHandle(ref, () => {
    return { setShowList, setList };
  }, []);

  const gotoDetail = (item) => {
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.companyName,
      orderId: item.orderId,
      orderName: item.orderName,
    });
  };

  // 获取订单详情
  const orderDetail = async (item) => {
    detailRef.current.setShowDetail(true);
    const res = await HomeApi.orderDetail(item.orderId);
    const data = res.data;
    const orderData = Object.assign({}, {orderName: data.orderName, recruitRange: data.recruitRange, orderPolicyDetail: data.orderPolicyDetail});
    setOrderMsg(orderData);
  };

  return (
    <>
      <Dialog
        isVisible={showList}
        onBackdropPress={()=> setShowList(!showList)}>
        <View style={styles.listArea}>
          <Text style={styles.listTitle}>{list.companyName || '无'}</Text>
          <AntDesign
            name='closecircleo'
            size={26}
            style={styles.icon}
            onPress={()=> setShowList(!showList)}
          />
          <View style={styles.listHead}>
            <Text style={[styles.head, styles.flex_1]}>序号</Text>
            <Text style={[styles.head, styles.flex_4]}>订单名称</Text>
            <Text style={[styles.head, styles.flex_1]}>详情</Text>
          </View>
          <ScrollView style={styles.scrollArea}>
            {list.list.length ? list.list.map((item, index) => {
              const isLastIndex = index === list.length - 1;
              return (
                <View style={[styles.listItem, isLastIndex && styles.noBorder]} key={item.orderId}>
                  <Text style={[styles.item, styles.flex_1]}>{index + 1}</Text>
                  <TouchableOpacity style={[styles.gotoDetail, styles.flex_4]} onPress={() => orderDetail(item)}>
                    <Text style={[styles.item, styles.gotoDetailPress]}>{item.orderName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.gotoDetail, styles.flex_1]} onPress={() => gotoDetail(item)}>
                    <Text style={styles.gotoDetailPress}>进入</Text>
                  </TouchableOpacity>
                </View>
              )
            }) : <EmptyArea /> }
          </ScrollView>
        </View>
      </Dialog>
      <CompanyDetailDialog ref={detailRef} message={orderMsg}/>
    </>
  )
};

const styles = StyleSheet.create({
  flex_1: {
    flex: 1
  },
  flex_4: {
    flex: 4
  },
  noBorder: {
    borderBottomWidth: 0
  },
  listArea: {
    maxHeight: 450, 
    minHeight: 50
  },
  listTitle: {
    textAlign: 'center',
    fontSize: 18, 
    marginBottom: 15
  },
  scrollArea: {
    borderRadius: 8
  },
  icon: {
    position: 'absolute', 
    top: 0, 
    right: 0, 
    color: '#000'
  },
  listHead: {
    height: 45, 
    backgroundColor: '#e7f3ff', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  head: {
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  headText: {
    fontWeight: 'bold'
  },
  gotoDetail: {
    alignItems: 'center'
  },
  listItem: {
    minHeight: 40, 
    paddingVertical: 5, 
    backgroundColor: '#fdfdfd', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#E3E3E3'
  },
  item: {
    textAlign: 'center', 
    fontSize: 13
  },
  gotoDetailPress: {
    fontSize: 13, 
    color: '#409EFF'
  }
})

export default forwardRef(CompanyListDialog);