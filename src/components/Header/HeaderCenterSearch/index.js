import React, {useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@rneui/themed';

import { openListSearch, closeListSearch } from "../../../redux/features/listHeaderSearch";
import { openHomeSearch, closeHomeSearch } from "../../../redux/features/homeSearch";

const HeaderCenterSearch = ({routeParams}) => {
  const dispatch = useDispatch();

  const {options: {headerTitle}, route: {name}} = routeParams;

  //为什么需要将路由中的名字都写进数组呢？因为不同页面的顶部筛选开关控制路由位置/功能/样式不同，例如首页与名单的顶部筛选栏，但是通过顶部点击函数去修改展开/折叠状态的控件却是同一个，所以在这里就需要通过路由名称去检查展开或关闭函数的触发页面，再根据页面的不同去同步修改redux中的状态。
  const check = (name) => {
    if(['INTERVIEW_LIST', 'LEAVING_LIST', 'SIGN_UP_LIST', 'WAIT_TO_ENTRY_LIST', 'NEWEST_STATE', 'MY_MEMBERS', 'DATA_STATISTICS', 'LEAVING_MANAGE', 'ORDER_MANAGE'].includes(name.toUpperCase())){
      return 'list';
    }else if (['HOME'].includes(name.toUpperCase())){
      return 'home';
    }else {
      return 'wrong';
    }
  };

  const searchState = useSelector((state) => {
    switch(check(name)){
      case 'list': 
        return state.listHeaderSearch.canSearch;
      case 'home':
        return state.homeSearch.canSearch;
      default:
        return;
    }
  });

  const close = () => {
    switch(check(name)){
      case 'list': 
        return closeListSearch();
      case 'home':
        return closeHomeSearch();
      default:
        return;
    }
  };

  const open = () => {
    switch(check(name)){
      case 'list': 
        return openListSearch();
      case 'home':
        return openHomeSearch();
      default:
        return;
    }
  }

  //每次销毁组件的时候将redux内的搜索状态置为false
  useEffect(()=>{
    return () => {
      dispatch(close());
    }
  }, [])

  const changeSearchState = () => {
    if(searchState){
      dispatch(close());
      return;
    }
    dispatch(open());
  };

  return (
    <TouchableOpacity style={styles.centerArea} onPress={changeSearchState}>
      <Text style={[styles.title, searchState && {fontWeight: 'bold'}]}>{headerTitle}</Text>
      <View style={styles.iconArea}>
        <Icon
          type="feather"
          name={searchState ? 'chevron-up' : 'chevron-down'}
          color={searchState ? '#000' : "#bfbfbf"}
          size={40}
          containerStyle={styles.icon}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  centerArea: {
    alignSelf: 'center'
  },
  title: {
    textAlign: 'center', 
    fontSize: 36, 
    color: '#000'
  },
  iconArea: {
    height: 15, 
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    top: -5
  }
});

export default HeaderCenterSearch;