import React, {useState, useImperativeHandle, forwardRef} from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import { Text, Dialog } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import NAVIGATION_KEYS from '../../../navigator/key';
import HomeApi from '../../../request/HomeApi';

const CompanyListDialog = (props, ref) => {
  const navigation = useNavigation();

  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);

  useImperativeHandle(ref, () => {
    return { setShowList, setList };
  }, []);

  let DATA = [];
  for(let i = 0; i < 20; i++){
    DATA.push({
      title: `企业芜湖${i+1}`,
      name: `龙华CN${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    })
  }

  const gotoDetail = (item) => {
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.title
    });
  }

  console.log('list', list)
  return (
    <Dialog
      isVisible={showList}
      onBackdropPress={()=> setShowList(!showList)}>
      <View style={styles.listArea}>
        <Text style={styles.listTitle}>龙华CN</Text>
        <AntDesign
          name='closecircleo'
          size={26}
          style={styles.icon}
          onPress={()=> setShowList(!showList)}
        />
        <View style={styles.listHead}>
          <Text style={[styles.head, styles.flex_1]}>序号</Text>
          <Text style={[styles.head, styles.flex_4]}>订单名称</Text>
          <Text style={[styles.gotoDetail, styles.flex_1, styles.headText, {textAlign: 'center'}]}>详情</Text>
        </View>
        <ScrollView style={styles.scrollArea}>
          {list?.length && list.map((item, index) => {
            const isLastIndex = index === list.length - 1;
            return (
              <View style={[styles.listItem, isLastIndex && styles.noBorder]} key={item.orderId}>
                <Text style={[styles.item, styles.flex_1]}>{index + 1}</Text>
                <Text style={[styles.item, styles.flex_4]}>{item.companyName}</Text>
                <TouchableOpacity style={[styles.gotoDetail, styles.flex_1, {borderWidth: 1}]} onPress={() => gotoDetail(item)}>
                  <Text style={styles.gotoDetailPress}>进入</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </Dialog>
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