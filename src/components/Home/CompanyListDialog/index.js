import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';

import NAVIGATION_KEYS from '../../../navigator/key';
import EmptyArea from '../../EmptyArea';
import HomeApi from '../../../request/HomeApi';
import { SUCCESS_CODE } from '../../../utils/const';
import { openDialog, setTitle } from "../../../redux/features/PageDialog";
import OrderDetail from "../../../components/PageDialog/OrderMessage/OrderDetail";

const CompanyListDialog = (props, ref) => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();

  const [showList, setShowList] = useState(false);
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
      currentTime: props.props,
    });
    setShowList(false)
  };

  const orderDetail = async(item) => {
    try{
      const orderDetailRes = await HomeApi.orderDetail(item.orderId); //获取订单名称及订单日期；
      const orderTextRes = await HomeApi.orderTextDetail(item.orderId); //获取订单详情；
      if(orderDetailRes?.code !== SUCCESS_CODE && orderTextRes?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const recruitRange = String(orderDetailRes.data.recruitRange).substring(5, 11) + String(orderDetailRes.data.recruitRange).substring(16, 21);
      const orderData = {
        orderName: orderDetailRes.data.orderName, 
        orderTextDetail: orderTextRes.data,
        recruitRange,
      };
      dispatch(setTitle('岗位信息'));
      dispatch(openDialog(<OrderDetail orderData={orderData}/>));
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
      console.log('orderDetail -> err', err);
    }
  };

  return (
    <>
      <Dialog
        animationType="fade"
        isVisible={showList}
        overlayStyle={styles.dialogStyle}
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
              const isLastIndex = index === list.list.length - 1;
              const isSingular = index % 2 !== 0;
              return (
                <View style={[styles.listItem, isLastIndex && styles.noBorder, isSingular && {backgroundColor: '#FDFDFD'}]} key={item.orderId}>
                  <Text style={[styles.item, styles.flex_1, {height: '100%', borderRightWidth: 1, borderColor: '#409EFF'}]}>{index + 1}</Text>
                  <TouchableOpacity style={[styles.gotoDetail, styles.flex_4, {minHeight: 40, justifyContent: 'center', borderRightWidth: 1, borderColor: '#409EFF'}]} onPress={() => orderDetail(item)}>
                    <Text style={[styles.item, styles.gotoDetailPress]}>{item.orderName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.gotoDetail, styles.flex_1, {minHeight: 40, justifyContent: 'center'}]} onPress={() => gotoDetail(item)}>
                    <Text style={styles.gotoDetailPress}>进入</Text>
                  </TouchableOpacity>
                </View>
              )
            }) : <EmptyArea /> }
          </ScrollView>
        </View>
      </Dialog>
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
  dialogStyle: {
    padding: 20,
    borderRadius: 6,
    width: '80%'
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
    borderWidth: 1,
    borderColor: '#409EFF'
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#409EFF',
    borderBottomWidth: 0,
    borderRightWidth: 0
  },
  head: {
    textAlign: 'center', 
    textAlignVertical: 'center',
    fontWeight: 'bold',
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#409EFF'
  },
  headText: {
    fontWeight: 'bold'
  },
  gotoDetail: {
    alignItems: 'center'
  },
  listItem: {
    minHeight: 40, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#409EFF'
  },
  item: {
    textAlign: 'center', 
    textAlignVertical: 'center',
    fontSize: 13
  },
  gotoDetailPress: {
    fontSize: 13, 
    color: '#409EFF',
    paddingHorizontal: 2
  }
})

export default forwardRef(CompanyListDialog);