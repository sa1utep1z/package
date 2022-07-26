import React, {useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@rneui/themed';

import { openListSearch, closeListSearch } from "../../../redux/features/listHeaderSearch";
import { openHomeSearch, closeHomeSearch } from "../../../redux/features/homeSearch";

const HeaderCenterSearch = ({routeParams}) => {
  const dispatch = useDispatch();

  const {options: {headerTitle}, route: {name}} = routeParams;

  const check = (name) => {
    if(['INTERVIEW_LIST', 'LEAVING_LIST', 'SIGN_UP_LIST', 'WAIT_TO_ENTRY_LIST', 'NEWEST_STATE'].includes(name.toUpperCase())){
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
          containerStyle={styles.icon}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  centerArea: {
    alignSelf: 'flex-end'
  },
  title: {
    textAlign: 'center', 
    fontSize: 18, 
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