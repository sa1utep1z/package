import React, {useRef, useState, useEffect, useCallback} from "react";
import { useIsFocused } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
  const scrollViewRef = useRef(null);

  const toast = useToast();

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  const [listData, setListData] = useState([]);
  const [typeNum, setTypeNum] = useState(TAB_OF_LIST.ORDER_MANAGE);
  const [index, setIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [searchContent, setSearchContent] = useState({...firstPage});
  const [nextPage, setNextPage] = useState(false);

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

  const showQuestion = () => {
    dispatch(setTitle('温馨提示'));
    dispatch(openDialog(<Question />));
  };
  
  useEffect(()=>{
    if(!isFocused) return;
    timer = setTimeout(()=>{
      QueryOrderList(searchContent);
      getTypeList(searchContent);
    }, 0)
    return () => timer && clearTimeout(timer);
  },[searchContent, isFocused])

  const getTypeList = async(searchContent) => {
    const params = {
      companyId: searchContent.companyId || '',
      recruitStart: searchContent.recruitStart || '',
      recruitEnd: searchContent.recruitEnd || ''
    };
    try {
      console.log('getTypeList -> params', params);
      const res = await CreateOrderApi.GetType(params);
      console.log('getTypeList->res', res);
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
      console.log('getTypeList->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  const QueryOrderList = async(params) => {
    setListLoading(true);
    try {
      console.log('QueryOrderList -> params', params);
      const res = await CreateOrderApi.QueryOrderList(params);
      console.log('QueryOrderList->res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setHasNext(res.data.hasNext);
      if(nextPage){
        setListData([...listData, ...res.data.content]);
        setNextPage(false);
        return;
      }
      setListData(res.data.content);
    } catch (error) {
      console.log('QueryOrderList->error', error);
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
    setSearchContent(params);
  };

  const createOrder = (type, order) => navigation.navigate(NAVIGATION_KEYS.CERATE_ORDER, {
    type, 
    orderId: order?.orderId
  });

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
      console.log('CopyOrder->error', error);
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
      console.log('ContinueOrder->error', error);
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
      console.log('changeOrder->error', error);
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
      console.log('DeleteOrder->error', error);
      toast.show(`出现了意料之外的问题，请联系管理员处理`, { type: 'danger' });
    }
  };

  //一键复制
  const _handleClipboardContent = async (content) => {
    Clipboard.setString(content);
    try {
      const text = await Clipboard.getString();
      if(text){
        toast.show('复制成功', {type: 'success'});
      }
    } catch (error) {
      console.log('复制失败->error', error);
      toast.show('复制失败', {type: 'danger'});
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

  const selectIndex = (tab, index) => {
    setListData([]);
    setIndex(index);
    const params = {...searchContent, ...firstPage};
    switch(index){
      case 0:
        params.recruit = '';
        break;
      case 1:
        params.recruit = true;
        break;
      case 2:
        params.recruit = false;
        break;
    }
    setSearchContent(params);
  };

  const refresh = () => {
    const params = {...searchContent, ...firstPage};
    if(index === 1){
      params.recruit = true;
    }else if(index === 2){
      params.recruit = false;
    }
    setSearchContent(params);
  };

  const onEndReached = () => {
    if(hasNext){
      const params = {
        ...searchContent,
        pageNumber: searchContent.pageNumber += 1
      };
      setSearchContent(params);
      setNextPage(true);
    }
  };

  const renderHiddenItem = (rowData) => (
    <TouchableOpacity
      style={styles.backRightBtn}
      onPress={() => DeleteOrder(rowData.item.orderId)}>
      <AntDesign
        name='delete'
        size={36}
        color='#ffffff'
      />
    </TouchableOpacity>
  );
  
  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItem}>
        <View style={[styles.renderItem_item, {backgroundColor: item?.orderNo ? '#ffffff' : '#c8f5b4'}]}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.imgBpx}
              source={{uri: item.imageUrl || 'https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/zdrl_logo.jpg'}}
              defaultSource={require('../../../../assets/images/logo.png')}
            />
            <View style={styles.topArea}>
              <TouchableOpacity style={styles.topTitle} onPress={()=>titleOnPress(item)}>
                <Text style={styles.topTitle_text} numberOfLines={1} ellipsizeMode="tail">{item.orderName}</Text>
              </TouchableOpacity>
              <View style={styles.centerArea}>
                <Text style={styles.enterpriseName}>{item.enterpriseName}</Text>
                <Text style={styles.centerLine}>|</Text>
                <Text style={styles.normalText}>{WORK_TYPE_NAME[item.workType] || '无'}</Text>
                <Text style={styles.centerLine}>|</Text>
                <Text style={styles.normalText}>{item.recruitNumber || '0'}人</Text>
              </View>
              <View style={styles.bottomArea}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.normalText}>招聘时段：</Text>
                  <Text style={styles.rangeTime_text}>{`${moment(item.recruitStart).format('MM/DD')}~${moment(item.recruitEnd).format('MM/DD')}`}</Text>
                </View>
                <View style={{flexDirection: 'row', marginLeft: 20}}>
                  <Text style={styles.normalText}>工期：</Text>
                  <Text style={styles.rangeTime_text}>{moment(item.orderDuration).format('YYYY-MM-DD')}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.itemBottomArea}>
            <View style={styles.leftArea}>
              <View style={styles.leftArea_title}>
                <Text style={styles.leftArea_title_leftType}>{item.debitType === 'DAILY'? '日借支': item.debitType === 'WEEKLY' ? '周借支': item.debitType === 'MONTHLY' ? '月借支' : '借支'}</Text>
                <Text style={styles.leftArea_title_rightType}>{`${item.debitLimit || '无'}${item.debitType === 'DAILY' ? '元/天' : item.debitType === 'WEEKLY' ? '元/周': item.debitType === 'MONTHLY' ? '元/月' : ''}`}</Text>
              </View>
              <View style={styles.leftArea_rightDate}>
                <Text style={styles.leftArea_rightDate_text}>创建日期：</Text>
                <Text style={styles.rangeTime_text}>{moment(item.createDate).format('YYYY-MM-DD')}</Text>
              </View>
            </View>
            <View style={styles.rightArea}>
              <TouchableOpacity style={styles.rightArea_button} onPress={()=>CopyOrder(item)}>
                <Text style={styles.rightArea_button_text}>复制</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightArea_button} onPress={()=>ContinueOrder(item)}>
                <Text style={styles.rightArea_button_text}>续单</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.rightArea_rightButton, {backgroundColor: item.ifShelf ? '#E6A042' : '#409EFF'}]} onPress={()=>changeOrder(item, item.ifShelf)}>
                <Text style={styles.rightArea_button_text}>{item.ifShelf ? '下架' : '上架'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.comeInArea} onPress={() => createOrder('change', item)}>
            <View style={styles.comeInArea_text}>
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
        useFlatList={true}
        ref={scrollViewRef}
        data={listData}
        rightOpenValue={-120}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item,index) => item.orderId}
        getItemLayout={(data, index)=>({length: 274, offset: 274 * index, index})}
        refreshing={listLoading}
        initialNumToRender={4}
        onRefresh={refresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        ListFooterComponent={<Footer showFooter={listData.length} hasNext={hasNext}/>}
        ListEmptyComponent={<Empty otherEmptyStyle={{height: 900}} />}
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
};

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
    margin: 20
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
  },
  imgBpx: {
    width: 120, 
    height: 120, 
    marginRight: 20
  },
  topArea: {
    flex: 1,
    height: 120
  },
  topTitle: {
    flex: 1, 
    marginRight: 60
  },
  topTitle_text: { 
    fontSize: 32, 
    color: '#409EFF'
  },
  centerArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  enterpriseName: {
    fontSize: 26, 
    color: '#FF4040', 
    marginRight: 5
  },
  centerLine: {
    fontSize: 26, 
    color: '#000000',
    marginHorizontal: 10
  },
  normalText: {
    fontSize: 26, 
    color: '#333333'
  },
  bottomArea: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  rangeTime_text: {
    fontSize: 26, 
    color: '#409EFF'
  },
  itemBottomArea: {
    flex: 1, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    flexDirection: 'row'
  },
  leftArea_title: {
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  leftArea_title_leftType: {
    fontSize: 20, 
    color: '#ffffff', 
    backgroundColor: '#409EFF', 
    padding: 10, 
    borderTopLeftRadius: 6, 
    borderBottomLeftRadius: 6
  },
  leftArea_title_rightType: {
    fontSize: 20, 
    color: '#ffffff', 
    backgroundColor: '#E6A042', 
    padding: 10, 
    borderTopRightRadius: 6, 
    borderBottomRightRadius: 6
  },
  leftArea_rightDate: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginRight: 20, 
    justifyContent: 'center'
  },
  leftArea_rightDate_text: {
    fontSize: 26, 
    color: '#333333'
  },
  comeInArea: {
    width: 110, 
    height: 110, 
    position: 'absolute', 
    right: 0, 
    paddingHorizontal: 30, 
    paddingTop: 30
  },
  comeInArea_text: {
    width: 50, 
    height: 50, 
    backgroundColor: '#3F9EFE',
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightArea: {
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  rightArea_button: {
    padding: 10, 
    backgroundColor: '#409EFF', 
    borderRadius: 6, 
    marginRight: 10
  },
  rightArea_rightButton: {
    padding: 10, 
    borderRadius: 6
  },
  rightArea_button_text: {
    fontSize: 20, 
    color: '#ffffff'
  }
});

export default OrderManage;