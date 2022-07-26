import React, {useState, useMemo} from "react";
import { View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { Tab, TabView, Text, Badge } from "@rneui/themed";

import { listFooter, empty } from "../../../pages/Home/listComponent";

const BottomList = ({
    list,
    tabList,
    showFactoryDetail,
    showMemberDetail,
    showSignUpDetail,
    callMemberPhone
  }) => {
  const [index, setIndex] = useState(0);
  const [showList, setShowList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);



  useMemo(()=>{
    setShowList(list);
  },[list])

  const renderItem = ({item}) => {
    return (
      <View key={item.id} style={styles.listStyle}>
        <TouchableOpacity key={1} style={styles.listFirst} onPress={showFactoryDetail}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={2} style={styles.listFlex5} onPress={showMemberDetail}>
          <Text>{item.person}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={3} style={styles.listFlex5} onPress={showSignUpDetail}>
          <Text>{item.type}</Text>
        </TouchableOpacity>
        <TouchableOpacity key={4} style={styles.listLast} onPress={callMemberPhone}>
          <Text>{item.phone}</Text>
        </TouchableOpacity>
      </View>
    )
  };

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
            <TouchableOpacity style={styles.touchArea} key={tabIndex}>
              <Text style={[active && {color: '#409EFF', fontWeight: 'bold'}]} onPress={setIndex}>{tab.title}<Text> ({list.length})</Text></Text>
            </TouchableOpacity>
              // <Tab.Item
              //   title={tab.title}
              //   key={tab.type}
              //   titleStyle={[styles.tabItem_titleStyle, active && styles.tabItem_titleStyle_active]}
              //   buttonStyle={styles.tabItem_buttonStyle}
              // />
          )
        })}
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        {tabList.map((tab, index)=> (
          <TabView.Item key={index} style={styles.tabView}>
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
          </TabView.Item>
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
   padding: 0
  },
  touchArea: {
    flex: 1, 
    textAlign: 'center', 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
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
  },
  listStyle: {
    minHeight: 35, 
    maxHeight: 35,
    borderColor: '#e3e3e3', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
    marginHorizontal: 8,
    paddingLeft: 2
  },
  listFirst: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'flex-start'
  },
  listFlex5: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  listLast: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
});

export default BottomList;