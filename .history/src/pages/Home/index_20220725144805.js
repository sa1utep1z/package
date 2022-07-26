import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl} from "react-native";
import { Text } from '@rneui/themed';

import { header, homeFooter, empty } from "./listComponent";
import CompanyDetailDialog from '../../components/Home/CompanyDetailDialog';
import CompanyListDialog from "../../components/Home/CompanyListDialog";
import NAVIGATION_KEYS from "../../navigator/key";
import HeaderCenterSearch from "../../components/Header/HeaderCenterSearch";
import { SUCCESS_CODE } from "../../utils/const";
import httpRequest from '../../utils/httpRequest';

const Home = (props) => {
  const {navigation} = props;
  const [refreshing, setRefreshing] = useState(false);
  const detailRef = useRef(null);
  const listRef = useRef(null);

  let DATA = [];
  for(let i = 0; i < 30; i++){
    DATA.push({
      title: `企业芜湖${i+1}`,
      index: i + 1,
      id: i,
      time: `2022-07-${i+1}`
    })
  }

  useEffect(()=>{
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    getHomeData();
  }, [])

  const getHomeData = async() => {
    console.log('执行了这行代码');
    const res = await httpRequest.post('admin/app/index/orderPage', {
      pageSize: 0,
      pageNumber: 0
    });
    console.log('res', res);
    if(res.code !== SUCCESS_CODE){
      console.log('res',res);
      // toast.show(`${res.msg}`, {
      //   type: 'danger'
      // });
      return;
    }
  };

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";

  const gotoList = (item) => {
    if(item.index%2 === 0){
      listRef.current.setShowList(true);
      return;
    }
    navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
      companyName: item.title
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.itemArea}>
      <Text style={styles.item_flex1}>{item.index}</Text>
      <TouchableOpacity style={{flex: 2}} onPress={()=>detailRef.current.setShowDetail(true)}>
        <Text style={styles.itemPress}>{item.title}</Text>
      </TouchableOpacity>
      <Text style={styles.item_flex2}>{item.time}</Text>
      <TouchableOpacity style={{flex: 1}} onPress={()=>gotoList(item)}>
        <Text style={styles.itemPress}>进入</Text>
      </TouchableOpacity>
    </View>
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => console.log('刷新了123')}
    />
  );

  return(
    <>
      <FlatList
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={header}
        ListFooterComponent={homeFooter}
        ListEmptyComponent={empty}
      />
      <CompanyDetailDialog ref={detailRef} message={msg} />
      <CompanyListDialog ref={listRef} navigation={navigation} />
    </>
)};

const styles = StyleSheet.create({
  itemArea: {
    height: 35, 
    marginHorizontal: 10, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCCCCC', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  item_flex1: {
    flex: 1, 
    textAlign: 'center'
  },
  item_flex2: {
    flex: 2, 
    textAlign: 'center'
  },
  itemPress: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#409EFF',
    height: '100%'
  },
  icon: {
    fontSize: 20,
    color: '#999999',
    marginRight: 10
  }
})


export default Home;