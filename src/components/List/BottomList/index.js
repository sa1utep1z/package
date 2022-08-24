import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text } from "@rneui/themed";
import { useDispatch } from 'react-redux';

import { empty } from "../../../pages/Home/listComponent";
import { setTabName } from "../../../redux/features/NowSelectTabNameInList";

let timer;
const BottomList = ({
    list = [],
    tab = [],
    tabNumberList = {},
    renderItem,
    onEndReached,
    listHead,
    onRefresh, //刷新函数
    isLoading = false, //是否加载中
    nowSelectIndex, //选择了哪个tab栏的函数
    hasTab = true, //是否要tab栏
    noNumber = false, //tab栏是否要统计数字
    tabTextStyle,
    tabStyle,
    hasNext = false, //是否有下一页
    renderItemHeight = 80, //列表中每一项的高度，作为优化项；
    ...rest
  }) => {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(list);
  const [tabList, setTabList] = useState(tab);
  //滑动到底部的时候会有多次触发底部函数，防抖作用；
  const [load, setLoad] = useState(true);

  useEffect(()=>{
    return () => {
      timer && clearTimeout(timer);
      dispatch(setTabName(''));
    };
  },[])

  useEffect(() => {
    setShowList(list);
    setTabList(tab);
  }, [list, tab])

  useMemo(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      nowSelectIndex && nowSelectIndex(index);
    });
  },[index])

  const selectIndex = (i) => {
    setIndex(i);
    const selectItem = tabList.find((item, index) => index === i);
    const tabName = selectItem.type;
    dispatch(setTabName(tabName));
  };

  const onEndReachedFunc = () => {
    if(!load) return;
    onEndReached && onEndReached();
    setLoad(false);
  };

  return (
    <>
      {hasTab && <View style={styles.tab_containerStyle}>
        {tabList.map((tabItem, tabIndex) => {
          const active = index === tabIndex;
          return (
            <TouchableOpacity key={tabIndex} style={styles.tabItem} onPress={()=>selectIndex(tabIndex)}>
              <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem.title}</Text>
              {!noNumber && <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tabItem.type] || 0}</Text>}
            </TouchableOpacity>
          )
        })}
      </View>}
      {listHead}
      <FlatList 
        data={showList}
        style={styles.flatListStyle}
        renderItem={renderItem}
        keyExtractor={(item,index) => index}
        getItemLayout={(data, index)=>({length: renderItemHeight, offset: renderItemHeight * index, index})}
        refreshing={isLoading}
        onRefresh={onRefresh}
        initialNumToRender={15}
        removeClippedSubviews
        ListFooterComponent={<Text style={styles.bottomText}>{hasNext ? '加载中...' : '没有更多数据'}</Text>}
        ListEmptyComponent={empty}
        onEndReachedThreshold={0.01}
        onEndReached={onEndReachedFunc}
        onScrollEndDrag={()=>setLoad(true)}
      />
    </>
  )
};

const styles = StyleSheet.create({
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
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  },
  flatListStyle: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E3E3E3'
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26,
    color: '#CCCCCC'
  }
});

export default BottomList;