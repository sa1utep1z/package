import React, {useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { Tab, TabView, Text, Badge } from "@rneui/themed";

import { listFooter, empty } from "../../../pages/Home/listComponent";

const BottomList = ({
    list,
    tab,
    renderItem,
    onEndReached,
    listHead,
    isLoading,
    nowSelectIndex,
    ...rest
  }) => {
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState([]);
  const [tabList, setTabList] = useState([]);

  useMemo(()=>{
    setShowList(list);
    setTabList(tab);
    nowSelectIndex(index);
  },[list, tab, index]);

  return (
    <>
      <Tab
        value={index}
        onChange={setIndex}
        variant="primary"
        indicatorStyle={styles.tab_indicatorStyle}
        containerStyle={styles.tab_containerStyle}>
        {tabList && tabList.map((tab, tabIndex) => {
          const active = tabIndex === index;
          return (
            <Tab.Item
              title={`${tab.title}(${tab.nums})`}
              key={tab.type}
              titleStyle={[styles.tabItem_titleStyle, active && styles.tabItem_titleStyle_active]}
              buttonStyle={styles.tabItem_buttonStyle}
              containerStyle={styles.tabItem_containerStyle}
            />
          )
        })}
      </Tab>
      {/* <TabView value={index} onChange={setIndex} animationType="spring"> */}
        {/* {tabList.map((tab, index)=> (
          <TabView.Item key={index} style={styles.tabView}> */}
            {listHead}
            <FlatList 
              data={showList}
              style={{backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E3E3E3'}}
              renderItem={renderItem}
              keyExtractor={item => item.poolId}
              getItemLayout={(data, index)=>({length: 35, offset: 35 * index, index})}
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
  tab_indicatorStyle: {
    backgroundColor: '#409EFF',
    height: 3,
    borderRadius: 4
  },
  tab_containerStyle: {
    backgroundColor: '#fff'
  },
  tabItem_titleStyle: {
    color: '#000', 
    fontSize: 13,
    width: '100%', 
    paddingVertical: 0, 
    paddingHorizontal: 0
  },
  tabItem_containerStyle: {
    height: 50, 
    justifyContent: 'center'
  },
  tabItem_titleStyle_active: {
    color: '#409EFF', 
    fontWeight: 'bold', 
    fontSize: 14
  },
  tabItem_buttonStyle: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 60,
  },
  tabView: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3', 
    backgroundColor: '#fff'
  }
});

export default BottomList;