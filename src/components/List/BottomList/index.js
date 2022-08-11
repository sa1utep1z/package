import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Tab, TabView, Text, Badge } from "@rneui/themed";
import { useSelector, useDispatch } from 'react-redux';

import { listFooter, empty } from "../../../pages/Home/listComponent";
import { setTabName } from "../../../redux/features/NowSelectTabNameInList";

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

  useEffect(() => {
    return () => dispatch(setTabName(''));
  }, [])

  useMemo(() => {
    setShowList(list);
    setTabList(tab);
  },[list, tab]);

  useMemo(()=>{
    nowSelectIndex && nowSelectIndex(index);
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
      {hasTab && <Tab
        value={index}
        onChange={(index) => selectIndex(index)}
        variant="primary"
        indicatorStyle={{ backgroundColor: '#fff' }}
        containerStyle={[styles.tab_containerStyle, tabStyle]}>
        {tabList && tabList.map((tab, tabIndex) => {
          const active = tabIndex === index;
          return (
            <Tab.Item
              title={tab.title}
              key={tab.type}
              buttonStyle={styles.tabItem_buttonStyle}
              containerStyle={styles.tabItem_containerStyle}>
              <>
                <Text
                  style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active, tabTextStyle]}>{tab.title}</Text>
                {!noNumber && <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tab.type] || 0}</Text>}
              </>
            </Tab.Item>
          )
        })}
      </Tab>}
      {/* <TabView value={index} onChange={setIndex} animationType="spring"> */}
        {/* {tabList.map((tab, index)=> (
          <TabView.Item key={index} style={styles.tabView}> */}
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
              ListFooterComponent={<Text style={styles.bottomText}>{hasNext ? '加载中...' : '没有更多数据'}</Text>}
              ListEmptyComponent={empty}
              onEndReachedThreshold={0.01}
              onEndReached={onEndReachedFunc}
              onScrollEndDrag={()=>setLoad(true)}
            />
          {/* </TabView.Item>
        ))} */}
      {/* </TabView> */}
    </>
  )
};

const styles = StyleSheet.create({
  tab_containerStyle: {
    backgroundColor: '#fff',
    height: 120
  },
  tabItem_titleStyle: {
    color: '#000',
    fontSize: 13,
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  tabItem_containerStyle: {
    backgroundColor: '#fff'
  },
  tabItem_text: {
    fontSize: 32,
    textAlign: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF',
    fontWeight: 'bold',
  },
  tabItem_buttonStyle: {
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  tabView: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: '#fff'
  },
  flatListStyle: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E3E3E3'
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 26
  }
});

export default BottomList;