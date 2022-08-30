import React, {useState, useRef, useEffect} from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, AppState} from "react-native";
import { Text } from '@rneui/themed';
import { useToast } from "react-native-toast-notifications";
import { useSelector, useDispatch } from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import { Header, empty } from "./listComponent";
import CompanyListDialog from "../../components/Home/CompanyListDialog";
import NAVIGATION_KEYS from "../../navigator/key";
import HeaderCenterSearch from "../../components/Header/HeaderCenterSearch";
import { SUCCESS_CODE } from "../../utils/const";
import HomeApi from "../../request/HomeApi";
import { setRoleInfo } from "../../redux/features/RoleInfo";

let timer;
const firstPage = {pageSize: 20, pageNumber: 0};

const Home = (props) => {
  const dispatch = useDispatch();

  const {navigation} = props;

  const toast = useToast();

  const listRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const [bannerList, setBannerList] = useState([]);
  const [searchContent, setSearchContent] = useState({...firstPage});
  const [showList, setShowList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [nextPage, setNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeacher, setIsSeacher] = useState(false); // 是否搜索历史
  const [load, setLoad] = useState(true);
  const tody = moment().format('YYYY-MM-DD')
  const tomorrow = moment().add(1, 'd').format("YYYY-MM-DD");
 
  useEffect(() => {
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    //监听事件，并保证全局只有一个监听进程。
    const eventListener = AppState.addEventListener('change', handleChange);
    return () => eventListener.remove();
  }, [])

  useEffect(()=>{
    getBannerList();
    getRoleInfo();
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      getList(searchContent);
    }, 0)
    return () => timer && clearTimeout(timer);
  }, [searchContent])

  //这里是作为一个监听程序，监听该页面是否在前台，如果切换桌面再返回页面，则将页面reload一下，防止组件还保留以前的状态（时间）；
  const handleChange = (state) => {
    if (state === 'active') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: NAVIGATION_KEYS.HOME,
            },
          ],
        }),
      );
    }
  };

  const getRoleInfo = async() => {
    try{
      const res = await HomeApi.getRoleInfo();
      // console.log('getRoleInfo --> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      dispatch(setRoleInfo(res.data.systemIdentities));
    }catch(err){
      console.log('err', err);
      toast.show(`获取用户角色失败，请联系管理员`, { type: 'danger' });
    }
  };

  const getList = async(params) => {
    setIsLoading(true);
    console.log('首页数据请求参数：', params);
    try{
      const res = await HomeApi.HomePage(params);
      console.log('首页数据', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      //初始数据
      setOriginData(res.data);
      //渲染的列表（有下一页时）
      if(nextPage){
        setShowList([...showList, ...res.data.content]);
        setNextPage(false);
        return;
      }
      //无下一页（第一页）
      setShowList(res.data.content);
    }catch(err){
      console.log('err', err);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }finally{
      setIsLoading(false);
    }
  };

  const getBannerList = async() => {
    try{
      const res = await HomeApi.GetBannerList();
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setBannerList(res.data);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, {type: 'danger'});
    }
  };

  const gotoList = async(item) => {
    try {
      const {current} = listRef;
      if(item.num > 1){
        current?.setShowList(true);
        const params = {
          companyId: item?.companyId,
          recruitStart: searchContent?.recruitStart,
          recruitEnd: searchContent?.recruitEnd
        }
        const res = await HomeApi.CompanyList(params);
        if(res.code !== SUCCESS_CODE){
          toast.show(`${res?.msg}`, { type: 'danger' });
          return;
        }
        const filterList = res.data.filter(data => data.recruitRange === item.recruitRange);
        const newList = {
          companyName: item.companyName,
          list: filterList
        };
        current?.setList(newList);
        return;
      }
      navigation.navigate(NAVIGATION_KEYS.COMPANY_DETAIL, {
        companyName: item.companyName,
        orderId: item.orderId,
        orderName: item.orderName,
        bannerList
      });
    } catch (error) {
      current?.setShowList(false);
    }
  };

  const onEndReached = () => {
    if(!load) return;
    setLoad(false);
    if(originData.hasNext){
      const nextPage = {...searchContent, pageNumber: searchContent.pageNumber += 1};
      setSearchContent(nextPage);
      setNextPage(true);
    }
  };

  const search = (values) => {
    setSearchContent({...searchContent, ...firstPage, companyName: values});
    if (values) {
      setIsSeacher(true)
    } else if (!values && (searchContent.recruitStart !== tody || searchContent.recruitEnd !== tody)) {
      setIsSeacher(true)
    } else {
      setIsSeacher(false)
    }
    console.log('搜索的值：', values)
  };

  const setRangeDate = (rangeDate) => {
    if ((rangeDate.startDate === tody && rangeDate.endDate === tody) || (rangeDate.startDate === tomorrow && rangeDate.endDate === tomorrow)) {
      setIsSeacher(false)
      setSearchContent({...searchContent, ...firstPage, recruitStart: rangeDate.startDate, recruitEnd: rangeDate.endDate, ifShelf: rangeDate.ifShelf});
    } else {
      setIsSeacher(true)
      setSearchContent({...searchContent, ...firstPage, recruitStart: rangeDate.startDate, recruitEnd: rangeDate.endDate, ifShelf: null});
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemArea}>
        <Text style={styles.item_flex1}>{index+1}</Text>
        <TouchableOpacity style={isSeacher ? styles.touchItemArea : styles.touchItemArea1} onPress={()=>gotoList(item)}>
          <Text style={styles.itemPress} numberOfLines={1} ellipsizeMode='tail'>{item.companyName}</Text>
        </TouchableOpacity>
        <Text style={styles.item_flex2}>{item.recruitNum}人</Text>
        {
          isSeacher && (
            <Text style={styles.item_flex2}>{item.recruitRange}</Text>
          )
        }
      </View>
  )};

  const refresh = () => {
    setSearchContent({...searchContent, ...firstPage});
  };

  const refreshControl = (
    <RefreshControl
      refreshing={isLoading}
      onRefresh={refresh}
    />
  );

  return(
    <View style={{flex: 1, backgroundColor: '#EEF4F7'}}>
      <FlatList
        data={showList}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        refreshControl={refreshControl}
        ListHeaderComponent={<Header search={search} isSeacher={isSeacher} range={setRangeDate} bannerList={bannerList}/>}
        ListEmptyComponent={empty}
        ListFooterComponent={<Text style={styles.bottomText}>{nextPage ? '加载中...' : '没有更多数据'}</Text>}
        removeClippedSubviews
        initialNumToRender={15}
        keyboardShouldPersistTaps='handled'
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
        onScrollEndDrag={()=>setLoad(true)}
      />
      <CompanyListDialog ref={listRef}/>
    </View>
)};

const styles = StyleSheet.create({
  itemArea: {
    height: 80, 
    marginHorizontal: 31, 
    backgroundColor: '#fff', 
    borderBottomWidth: 2, 
    borderColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    alignItems: 'center'
  },
  touchItemArea: {
    flex: 2, 
    height: '100%', 
    alignItems: 'flex-start', 
    justifyContent: 'center',
    textAlign: 'left',
    paddingLeft: 15
  },
  touchItemArea1: {
    flex: 2, 
    height: '100%', 
    alignItems: 'flex-start', 
    justifyContent: 'center',
    textAlign: 'left',
    marginLeft: 50,
    paddingLeft: 30,
  },
  item_flex1: {
    flex: 1, 
    textAlign: 'center',
    fontSize: 28
  },
  item_flex2: {
    flex: 2, 
    textAlign: 'center',
    fontSize: 25
  },
  itemPress: {
    color: '#409EFF',
    fontSize: 32,
  },
  icon: {
    fontSize: 20,
    color: '#999999',
    marginRight: 10
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26,
    color: '#CCCCCC'
  }
})


export default Home;