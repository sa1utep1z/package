import React, {useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { Tab, TabView, Text, Badge } from "@rneui/themed";

import { listFooter, empty } from "../../../pages/Home/listComponent";

const BottomList = ({
    list,
    tabList,
    renderItem
  }) => {
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useMemo(()=>{
    setShowList(list);
  },[list])

  return (
    <>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={styles.tab_indicatorStyle}
        containerStyle={styles.tab_containerStyle}
        variant="primary">
        {tabList.map((tab, tabIndex) => {
          const active = tabIndex === index;
          return (
            <Tab.Item
              title={tab.title}
              key={tab.type}
              titleStyle={[styles.tabItem_titleStyle, active && styles.tabItem_titleStyle_active]}
              buttonStyle={styles.tabItem_buttonStyle}
              containerStyle={styles.tabItem_containerStyle}
            />
          )
        })}
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        {tabList.map((tab, index)=> (
          // <TabView.Item key={index} style={styles.tabView}>
            <FlatList 
              data={showList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              getItemLayout={(data, index)=>({length: 35, offset: 35 * index, index})}
              refreshing={refreshing}
              initialNumToRender={15}
              onEndReachedThreshold={0.2}
              onRefresh={() => console.log('刷新了123')}
              onEndReached={()=>console.log('触底了')}
              ListFooterComponent={listFooter}
              ListEmptyComponent={empty}
            />
          {/* </TabView.Item> */}
        ))}
      </TabView>
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