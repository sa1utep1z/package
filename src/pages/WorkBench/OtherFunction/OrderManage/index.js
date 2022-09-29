import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/themed';

import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { openDialog } from "../../../../redux/features/PageDialog";
import { TAB_OF_LIST } from "../../../../utils/const";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearch from "../../../../components/List/HeaderSearch";
import WaterMark from "../../../../components/WaterMark";
import Question from "../../../../components/PageDialog/OrderMessage/Question";
import NAVIGATION_KEYS from "../../../../navigator/key";

const OrderManage = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  useEffect(()=>{
    dispatch(openListSearch());
    navigation.setOptions({
      headerRight: () => <TouchableOpacity style={{width: 100, height: 100, justifyContent: 'center', alignItems: 'center'}} onPress={showQuestion}>
        <AntDesign
          name='questioncircleo'
          size={40}
          color='#000000'
        />
      </TouchableOpacity>,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  },[])

  const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({ 
        key: `${i}`, 
        text: `模式${i+1}：RP${25+i}元/小时`, 
        store: `龙华RP`, 
        type: '派遣工-小时工', 
        member: `${i*100}人`,
        rangeTime: `${moment().format('MM-DD')}~${moment().format('MM-DD')}`,
        time: `${moment().format('YYYY-MM-DD')}`,
        pay: '100元/天',
        createdDate: `${moment().format('YYYY-MM-DD')}`,
      }))
  );
  const [index, setIndex] = useState(0);

  const showQuestion = () => {
    dispatch(openDialog(<Question />));
  };
  
  const filter = values => {
    console.log('values', values);
  };

  const createOrder = () => {
    navigation.navigate(NAVIGATION_KEYS.CERATE_ORDER);
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const selectIndex = (index) => {
    console.log('index', index);
    setIndex(index);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <View style={styles.renderItem_item}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 120, height: 120, marginRight: 20}}
              source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}
            />
            <View style={{flex: 1, height: 120}}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 36, color: '#333333'}}>{item.text}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 26, color: '#FF4040', marginRight: 5}}>{item.store}</Text>
                <Text style={{fontSize: 26, color: '#000000', marginHorizontal: 10}}>|</Text>
                <Text style={{fontSize: 26, color: '#333333'}}>{item.type}</Text>
                <Text style={{fontSize: 26, color: '#000000', marginHorizontal: 10}}>|</Text>
                <Text style={{fontSize: 26, color: '#333333'}}>{item.member}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 26, color: '#333333'}}>招聘时段：</Text>
                  <Text style={{fontSize: 26, color: '#409EFF'}}>{item.rangeTime}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  <Text style={{fontSize: 26, color: '#333333'}}>工期：</Text>
                  <Text style={{fontSize: 26, color: '#409EFF'}}>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 20, color: '#ffffff', backgroundColor: '#409EFF', padding: 10, borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}>日借支</Text>
                <Text style={{fontSize: 20, color: '#ffffff', backgroundColor: '#E6A042', padding: 10, borderTopRightRadius: 6, borderBottomRightRadius: 6}}>{item.pay}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end', marginRight: 20}}>
                <Text style={{fontSize: 26, color: '#333333'}}>创建日期：</Text>
                <Text style={{fontSize: 26, color: '#409EFF'}}>{item.createdDate}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{padding: 10, backgroundColor: '#409EFF', borderRadius: 6, marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#ffffff'}}>复制</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: '#409EFF', borderRadius: 6, marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#ffffff'}}>续单</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: '#409EFF', borderRadius: 6}}>
                <Text style={{fontSize: 20, color: '#ffffff'}}>暂停</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{width: 110, height: 110, position: 'absolute', right: 0, paddingHorizontal: 30, paddingTop: 30}} onPress={createOrder}>
            <View style={{width: 50, height: 50, backgroundColor: '#3F9EFE', borderRadius: 10, justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign
                name='right'
                size={36}
                color='#ffffff'
              />
            </View>
          </TouchableOpacity>
        </View>
        <WaterMark />
      </View>
    )
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
        <TouchableOpacity
          style={styles.backRightBtn}
          onPress={() => deleteRow(rowMap, data.item.key)}>
          <AntDesign
            name='delete'
            size={36}
            color='#ffffff'
          />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <HeaderSearch
        filterFun={filter}
        noCompanyAndStatus
        noStoreAndStaff
        startText="开始日期："
        endText="结束日期："
      />
      <View style={styles.tab_containerStyle}>
        {TAB_OF_LIST.ORDER_MANAGE.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={()=>selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <SwipeListView
        data={listData}
        rightOpenValue={-120}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
      />
      <Button
        title="新建订单"
        onPress={createOrder}
        containerStyle={styles.buttonContainerStyle}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.titleStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  tab_containerStyle: {
    minHeight: 120, 
    flexDirection: 'row', 
    backgroundColor: '#fff'
  },
  tabItem: {
    flex: 1, 
    justifyContent: 'center'
  },
  tabItem_text: {
    fontSize: 32,
    color: '#333333',
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  },
  renderItem: {
    height: 274,
    paddingBottom: 30
  },
  renderItem_item: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 120,
    height: 244,
    backgroundColor: '#FF4040',
    right: 0
  },
  buttonContainerStyle: {
    margin: 30
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  }
});

export default OrderManage;