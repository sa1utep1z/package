import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import Clipboard from '@react-native-clipboard/clipboard';

import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { openDialog, setTitle, setRightArea } from "../../../../redux/features/PageDialog";
import { TAB_OF_LIST, SUCCESS_CODE, WORK_TYPE_NAME } from "../../../../utils/const";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearch from "../../../../components/List/HeaderSearch";
import WaterMark from "../../../../components/WaterMark";
import Question from "../../../../components/PageDialog/OrderMessage/Question";
import OrderDetail from "../../../../components/PageDialog/OrderMessage/OrderDetail";
import NAVIGATION_KEYS from "../../../../navigator/key";
import Footer from '../../../../components/FlatList/Footer';
import Empty from '../../../../components/FlatList/Empty';
import CreateOrderApi from "../../../../request/CreateOrderApi";
import HomeApi from '../../../../request/HomeApi';
import { deepCopy } from "../../../../utils";

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const OrderManage = () => {
  const toast = useToast();

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

  useEffect(()=>{
    console.log('searchContent', searchContent);
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      QueryOrderList(searchContent);
      getTypeList();
    }, 0)
    return () => timer && clearTimeout(timer);
  },[searchContent])

  const [listData, setListData] = useState([]);
  const [typeNum, setTypeNum] = useState(TAB_OF_LIST.ORDER_MANAGE);
  const [index, setIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [searchContent, setSearchContent] = useState({...firstPage});

  const showQuestion = () => {
    dispatch(setTitle('温馨提示'));
    dispatch(openDialog(<Question />));
  };

  const getTypeList = async() => {
    try {
      const res = await CreateOrderApi.GetType();
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      const newList = deepCopy(TAB_OF_LIST.ORDER_MANAGE);
      newList.map(item => {
        if(item.type === 'total'){
          item.num = res.data.total;
        }else if(item.type === 'ifShelf'){
          item.num = res.data.ifShelf;
        }else if(item.type === 'unShelf'){
          item.num = res.data.unShelf;
        }
      })
      setTypeNum(newList);
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const QueryOrderList = async(params) => {
    setListLoading(true);
    try {
      const res = await CreateOrderApi.QueryOrderList(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setListData(res.data.content);
      setHasNext(res.data.hasNext);
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    } finally{
      setListLoading(false);
    }
  };
  
  const filter = values => {
    const params = {
      ...searchContent,
      companyId: values.enterprise.length ? values.enterprise[0].value : '',
      recruitStart: values.dateRange.startDate,
      recruitEnd: values.dateRange.endDate
    }
    QueryOrderList(params);
  };

  const createOrder = (type, order) => navigation.navigate(NAVIGATION_KEYS.CERATE_ORDER, { type, orderId: order?.orderId});

  const CopyOrder = async(order) => {
    const params = {
      orderId: order.orderId,
      num: 1
    };
    try {
      const res = await CreateOrderApi.CopyOrder(params);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('复制成功', {type: 'success'});
      refresh();
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const ContinueOrder = async(order) => {
    try {
      const res = await CreateOrderApi.ContinueOrder(order.orderId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('续单成功', {type: 'success'});
      refresh();
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const changeOrder = async(order, ifShelf) => {
    try {
      if(ifShelf){
        const res = await CreateOrderApi.StopOrder(order.orderId); //下架
        if(res?.code !== SUCCESS_CODE){
          toast.show(`${res?.msg}`, {type: 'danger'});
          return;
        }
        toast.show('下架成功', {type: 'success'});
      }else{
        const res = await CreateOrderApi.onOrder(order.orderId); //上架
        if(res?.code !== SUCCESS_CODE){
          toast.show(`${res?.msg}`, {type: 'danger'});
          return;
        }
        toast.show('上架成功', {type: 'success'});
      }
      refresh();
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const DeleteOrder = async(order) => {
    try {
      const res = await CreateOrderApi.DeleteOrder(order);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      toast.show('删除订单成功', {type: 'success'});
      refresh();
    } catch (error) {
      console.log('error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  //一键复制
  const _handleClipboardContent = async (content) => {
    Clipboard.setString(content);
    try {
      const text = await Clipboard.getString();
      console.log('text', text);
      if(text){
        toast.show('复制成功', {type: 'success'});
      }
    } catch (error) {
      toast.show('复制成功', {type: 'danger'});
      console.log('复制失败error', error);
    }
  };

  const titleOnPress = async(order) => {
    try {
      const orderDetailRes = await HomeApi.orderDetail(order.orderId);
      const orderTextRes = await HomeApi.orderTextDetail(order.orderId);
      if(orderDetailRes?.code !== SUCCESS_CODE){
        toast.show(`${orderDetailRes?.msg}`, {type: 'danger'});
        return;
      }
      if(orderTextRes?.code !== SUCCESS_CODE){
        toast.show(`${orderTextRes?.msg}`, {type: 'danger'});
        return;
      }
      const orderData = {
        orderName: orderDetailRes.data.orderName, 
        recruitRange: orderDetailRes.data.recruitRange, 
        orderPolicyDetail: orderDetailRes.data.orderPolicyDetail, 
        orderTextDetail: orderTextRes.data
      };
      dispatch(setTitle('岗位信息'));
      dispatch(openDialog(<OrderDetail orderData={orderData}/>));
      dispatch(setRightArea({
        title: '一键复制',
        press: () => _handleClipboardContent(orderTextRes.data) 
      }));
    } catch (error) {
      console.log('titleOnPress->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
    
  };

  const deleteRow = (rowMap, rowKey) => {
    DeleteOrder(rowKey.item.orderId);
    console.log('rowMap', rowMap);
    console.log('rowKey', rowKey);
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const selectIndex = (tab, index) => {
    setIndex(index);
    const params = {...searchContent};
    if(index === 1){
      params.recruit = true;
    }else if(index === 2){
      params.recruit = false;
    }
    QueryOrderList(params);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <View style={styles.renderItem_item}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{width: 120, height: 120, marginRight: 20}}
              source={{uri: item.imageUrl || 'https://reactnative.dev/img/tiny_logo.png'}}
            />
            <View style={{flex: 1, height: 120}}>
              <TouchableOpacity style={{flex: 1}} onPress={()=>titleOnPress(item)}>
                <Text style={{fontSize: 32, color: '#409EFF'}}>{item.orderName}</Text>
              </TouchableOpacity>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 26, color: '#FF4040', marginRight: 5}}>{item.enterpriseName}</Text>
                <Text style={{fontSize: 26, color: '#000000', marginHorizontal: 10}}>|</Text>
                <Text style={{fontSize: 26, color: '#333333'}}>{WORK_TYPE_NAME[item.workType]}</Text>
                <Text style={{fontSize: 26, color: '#000000', marginHorizontal: 10}}>|</Text>
                <Text style={{fontSize: 26, color: '#333333'}}>{item.recruitNumber}人</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 26, color: '#333333'}}>招聘时段：</Text>
                  <Text style={{fontSize: 26, color: '#409EFF'}}>{`${moment(item.recruitStart).format('MM-DD')}~${moment(item.recruitEnd).format('MM-DD')}`}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  <Text style={{fontSize: 26, color: '#333333'}}>工期：</Text>
                  <Text style={{fontSize: 26, color: '#409EFF'}}>{moment(item.orderDuration).format('YYYY-MM-DD')}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{fontSize: 20, color: '#ffffff', backgroundColor: '#409EFF', padding: 10, borderTopLeftRadius: 6, borderBottomLeftRadius: 6}}>{item.debitType === 'DAILY'? '日借支': item.debitType === 'WEEKLY' ? '周借支': item.debitType === 'MONTHLY' ? '月借支' : '借支'}</Text>
                <Text style={{fontSize: 20, color: '#ffffff', backgroundColor: '#E6A042', padding: 10, borderTopRightRadius: 6, borderBottomRightRadius: 6}}>{`${item.debitLimit || '无'}${item.debitType === 'DAILY' ? '元/天' : item.debitType === 'WEEKLY' ? '元/周': item.debitType === 'MONTHLY' ? '元/月' : ''}`}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end', marginRight: 20, flex: 1, justifyContent: 'center'}}>
                <Text style={{fontSize: 26, color: '#333333'}}>创建日期：</Text>
                <Text style={{fontSize: 26, color: '#409EFF'}}>{moment(item.createdDate).format('YYYY-MM-DD')}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <TouchableOpacity style={{padding: 10, backgroundColor: '#409EFF', borderRadius: 6, marginRight: 10}} onPress={()=>CopyOrder(item)}>
                <Text style={{fontSize: 20, color: '#ffffff'}}>复制</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: '#409EFF', borderRadius: 6, marginRight: 10}} onPress={()=>ContinueOrder(item)}>
                <Text style={{fontSize: 20, color: '#ffffff'}}>续单</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding: 10, backgroundColor: item.ifShelf ? '#E6A042' : '#409EFF', borderRadius: 6}} onPress={()=>changeOrder(item, item.ifShelf)}>
                <Text style={{fontSize: 20, color: '#ffffff' }}>{item.ifShelf ? '下架' : '上架'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={{width: 110, height: 110, position: 'absolute', right: 0, paddingHorizontal: 30, paddingTop: 30}} onPress={() => createOrder('change', item)}>
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
    <TouchableOpacity
      style={styles.backRightBtn}
      onPress={() => deleteRow(rowMap, data)}>
      <AntDesign
        name='delete'
        size={36}
        color='#ffffff'
      />
    </TouchableOpacity>
  );

  const refresh = () => {
    const params = {...firstPage};
    if(index === 1){
      params.recruit = true;
    }else if(index === 2){
      params.recruit = false;
    }
    QueryOrderList(params);
    getTypeList();
  };

  const onEndReached = () => {
    if(hasNext){
      console.log('还有下一页')
    }else{
      console.log('触底了！')
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch
        filterFun={filter}
        singleSelect
        noStoreAndStaff
        noSearchInput
        placeholder="请输入企业名称"
        startText="开始日期："
        endText="结束日期："
      />
      <View style={styles.tab_containerStyle}>
        {typeNum.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={()=>selectIndex(tabItem, tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.num || 0}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <SwipeListView
        data={listData}
        rightOpenValue={-120}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        refreshing={listLoading}
        initialNumToRender={4}
        onRefresh={refresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        ListFooterComponent={<Footer showFooter={listData.length} hasNext={hasNext}/>}
        ListEmptyComponent={<Empty otherEmptyStyle={{height: 500}} />}
      />
      <Button
        title="新建订单"
        onPress={() => createOrder('create')}
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
    top: 1,
    width: 120,
    height: 242,
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