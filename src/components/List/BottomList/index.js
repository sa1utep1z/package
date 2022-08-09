import React, {useState, useMemo, useEffect} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
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
    isLoading = false,
    nowSelectIndex = false,
    ...rest
  }) => {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(list);
  const [tabList, setTabList] = useState(tab);

  useEffect(()=>{
    return () => dispatch(setTabName(''));
  },[])

  useMemo(()=>{
    setShowList(list);
    setTabList(tab);
    nowSelectIndex && nowSelectIndex(index);
  },[list, tab, index]);

  const selectIndex = (i) => {
    setIndex(i);
    const selectItem = tabList.find((item, index) => index === i);
    const tabName = selectItem.type;
    dispatch(setTabName(tabName));
  };

  return (
    <>
      <Tab
        value={index}
        onChange={(index) => selectIndex(index)}
        variant="primary"
        indicatorStyle={{backgroundColor: '#fff'}}
        containerStyle={styles.tab_containerStyle}>
        {tabList && tabList.map((tab, tabIndex) => {
          const active = tabIndex === index;
          return (
            <Tab.Item
              title={tab.title}
              key={tab.type}
              buttonStyle={styles.tabItem_buttonStyle}
              containerStyle={styles.tabItem_containerStyle}>
                <>
                  <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tab.title}</Text>
                  <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabNumberList[tab.type] || 0}</Text>
                </>
            </Tab.Item>
          )
        })}
      </Tab>
      {/* <TabView value={index} onChange={setIndex} animationType="spring"> */}
        {/* {tabList.map((tab, index)=> (
          <TabView.Item key={index} style={styles.tabView}> */}
            {listHead}
            <FlatList 
              data={showList}
              style={styles.flatListStyle}
              renderItem={renderItem}
              keyExtractor={(item,index) => index}
              getItemLayout={(data, index)=>({length: 80, offset: 80 * index, index})}
              refreshing={isLoading}
              onRefresh={()=>console.log('刷新')}
              initialNumToRender={15}
              ListFooterComponent={showList?.length && listFooter}
              ListEmptyComponent={empty}
              onEndReachedThreshold={0.01}
              onEndReached={onEndReached}
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
    fontSize: 32, textAlign: 'center'
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
  }
});

export default BottomList;