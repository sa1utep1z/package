import React, {useRef, useEffect, useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "react-native-toast-notifications";

import HeaderRightButtonOfList from '../../../../components/List/HeaderRightButtonOfList';
import HeaderSearch from "../../../../components/List/HeaderSearch";
import CenterSelectDate from "../../../../components/List/CenterSelectDate";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import BottomList from "../../../../components/List/BottomList";
import NAVIGATION_KEYS from "../../../../navigator/key";
import { MEMBER_INFO, TAB_OF_LIST, SUCCESS_CODE, SIGN_UP_STATUS, today } from "../../../../utils/const";
import ListApi from "../../../../request/ListApi";
import NormalDialog from "../../../../components/NormalDialog";
import FormCompanyDetail from "../../../../components/NormalDialog/FormCompanyDetail";
import FormMemberDetail from "../../../../components/NormalDialog/FormMemberDetail";

const SignUpList = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const dialogRef = useRef(null);

  const [memberInfoList, setMemberInfoList] = useState(MEMBER_INFO);
  const [dialogContent, setDialogContent] = useState({});
  const [searchContent, setSearchContent] = useState({ 
    pageSize: 20, 
    pageNumber: 0, 
    startDate: today, 
    endDate: today
  });
  const [showList, setShowList] = useState({
    content: []
  });
  const [tabList, setTabList] = useState(TAB_OF_LIST.SIGN_UP_LIST);

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <HeaderRightButtonOfList />,
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    // getTypeList()
  }, [])

  const getTypeList = async() => {
    const params = {
      companyIds: searchContent?.companyIds || [],  
      storeIds: searchContent?.storeIds || [],
      recruitIds: searchContent?.names || [],
      startDate: searchContent?.startDate || '',
      endDate: searchContent?.endDate || ''
      // str: searchContent?
    };
    try{
      const res = await ListApi.GetTypeList(params);
      console.log('res', res);
      if(res.data?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res.data?.msg}`, {type: 'danger'});
        return;
      }
      console.log('res', res);
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  }

  const { isLoading, data, isError, status } = useQuery(['myMembers', searchContent], ListApi.SignUpList);
  if(isError){
    toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
  }
  if(status === 'success' && data?.code !== SUCCESS_CODE){
    toast.show(`${data?.msg}`, { type: 'danger' });
  }

  useMemo(()=>{
    // getTypeList();
  },[searchContent])

  useMemo(()=>{
    if(data){
      // 如果当前的渲染列表中hasNext为true且当前页面与接口请求数据的pageNumber不一样，就将新数据与目前渲染列表衔接到一起并渲染出来；
      if(showList?.hasNext && data.data.pageNumber !== showList.pageNumber){
        const concatList = showList.content.concat(data.data.content);
        showList.content = concatList;
        showList.pageNumber = data.data.pageNumber;
        showList.hasNext = data.data.hasNext;
        setShowList(showList);  
        return;
      }
      data.data.content.map(item => item.itemId = item.flowId);
      setShowList(data.data);
    }
  },[data])

  const filter = (values) => {
    const companyIds = values.enterprise.length ? values.enterprise.map(item => item.value) : [];
    const storeIds = values.store.length ? values.store.map(item => item.storeId) : [];
    const names = values.staff.length ? values.staff.map(item => item.value) : [];

    setSearchContent({
      pageSize: 20, 
      pageNumber: 0,
      startDate: values.dateRange.startDate, 
      endDate: values.dateRange.endDate, 
      str: values.search,
      companyIds,
      storeIds,
      names
    });
  };

  const msg = "这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容这里是富文本内容";


  const selectIndex = (selectIndex) => {
    console.log('selectIndex', selectIndex);
    // switch(selectIndex){
    //   case 0:
    //     searchContent.returnVisitResult = '';
    //     break;
    //   case 1:
    //     searchContent.returnVisitResult = 'PREPARING';
    //     break;
    //   case 2:
    //     searchContent.returnVisitResult = 'HAVE_WILL';
    //     break;
    //   case 3:
    //     searchContent.returnVisitResult = 'NO_WILL';
    //     break;
    // }
    // setSearchContent({ ...searchContent });
  };
  
  const onEndReached = () => {
    console.log('你滑到底了！');
  };

  const selectFactory = (item) => {
    console.log('呵呵', item);
  }

  const transferFactory = async(item) => {
    navigation.navigate(NAVIGATION_KEYS.TRANSFER_FACTORY, {
      item,
      selectFactory
    })
  }

  const pressFactory = async(item) => {
    try{
      const res = await ListApi.FactoryMessage(item.flowId);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '岗位信息',
        dialogComponent: <FormCompanyDetail message={res.data}/>,
        rightTitle: '转厂/转单',
        rightTitleOnPress: () => transferFactory(item)
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const pressName = async(item) => {
    try{
      const res = await ListApi.MemberMessage(item.flowId);
      console.log('res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`请求失败，请稍后重试。${res?.msg}`, {type: 'danger'});
        return;
      }
      dialogRef.current.setShowDialog(true);
      setDialogContent({
        dialogTitle: '会员信息',
        dialogComponent: <FormMemberDetail memberInfoList={res.data}/>,
      });
    }catch(err){
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const renderItem = ({item}) => {
    const renderList = [
      { fieldName: item.companyShortName, pressFun: () => pressFactory(item), textStyle: {color: '#409EFF', textAlign: 'left'}, itemStyle: {justifyContent: 'flex-start'}},
      { fieldName: item.name, pressFun: () => pressName(item)},
      { fieldName: SIGN_UP_STATUS[item.signUpStatus], pressFun: () => console.log('点击待处理')},
      { fieldName: item.mobile || '无', pressFun: () => {
        if(item.mobile){
          console.log('点击拨打电话');
        }
      }, textStyle: {color: '#409EFF', fontSize: 26}}
    ];
    return (
      <View key={item.id} style={styles.listStyle}>
        {renderList.map((renderItem, index) => (
          <TouchableOpacity key={index} style={[styles.listItem, renderItem.itemStyle]} onPress={renderItem.pressFun}>
            <Text style={[
              styles.itemText, 
              renderItem.textStyle
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">{renderItem.fieldName}</Text>
            {/* {renderItem.fieldName === item.mobile && <Entypo name='phone' size={30} color='#409EFF'/>} */}
          </TouchableOpacity>
        ))}
      </View>
    )
  };

  return (
    <View style={styles.screen}>
      <HeaderSearch 
        filterFun={filter} 
      />
      <CenterSelectDate />
      <BottomList
        list={showList?.content}
        isLoading={isLoading}
        renderItem={renderItem}
        onEndReached={onEndReached}
        tab={TAB_OF_LIST.SIGN_UP_LIST}
        nowSelectIndex={selectIndex}
      />
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10
  },
  listStyle: {
    height: 80,
    borderBottomWidth: 2, 
    borderBottomColor: 'rgba(0, 0, 0, .05)',
    flexDirection: 'row', 
    marginHorizontal: 34
  },
  listItem: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemText: {
    fontSize: 28,
    color: '#000',
    textAlign: 'center'
  }
});

export default SignUpList;