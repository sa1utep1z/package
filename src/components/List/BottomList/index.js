import React, {useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { Tab, TabView, Text, Badge } from "@rneui/themed";

import { listFooter, empty } from "../../../pages/Home/listComponent";

const BottomList = ({
    list = [],
    tab = [],
    renderItem,
    onEndReached,
    listHead,
    isLoading = false,
    nowSelectIndex = false,
    ...rest
  }) => {
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState(list);
  const [tabList, setTabList] = useState(tab);

  useMemo(()=>{
    setShowList(list);
    setTabList(tab);
    nowSelectIndex && nowSelectIndex(index);
  },[list, tab, index]);

  return (
    <>
      <Tab
        value={index}
        onChange={setIndex}
        variant="primary"
        indicatorStyle={{backgroundColor: '#fff'}}
        containerStyle={styles.tab_containerStyle}>
        {tabList.map((tab, tabIndex) => {
          const active = tabIndex === index;
          return (
            <Tab.Item
              title={tab.title}
              key={tab.type}
              buttonStyle={styles.tabItem_buttonStyle}
              containerStyle={styles.tabItem_containerStyle}
              >
                <View>
                  <Text style={[{fontSize: 32, textAlign: 'center'}, active && styles.tabItem_titleStyle_active]}>{tab.title}</Text>
                  <Text style={[{fontSize: 32, textAlign: 'center'}, active && styles.tabItem_titleStyle_active]}>{tab.nums || 0}</Text>
                </View>
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
              style={{backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E3E3E3'}}
              renderItem={renderItem}
              keyExtractor={item => item.itemId}
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
    justifyContent: 'center',
    backgroundColor: '#fff'
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
  }
});

export default BottomList;