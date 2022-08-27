import React, {useState} from "react";
import { Text, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

const Tab = ({
  renderRoute,
  renderScene
}) => {
  const [index, setIndex] = useState(0);

  const renderLabel = ({ route, focused, color }) => (
    <Text style={[{fontSize: 28, color}, focused && {fontWeight: 'bold'}]}>
      {route.title}
    </Text>
  );

  const tabBar = props => (
    <TabBar
      pressColor="rgba(0,0,0,0)"
      activeColor="#409EFF"
      inactiveColor="#999999"
      style={styles.tabBarStyle}
      indicatorStyle={styles.tabBarIndicatorStyle}
      renderLabel={renderLabel}
      {...props}
    />
  );
  
  return (
    <TabView
      lazy
      swipeEnabled={false}
      renderTabBar={tabBar}
      onIndexChange={setIndex}
      renderScene={renderScene}
      navigationState={{ index, routes: renderRoute }}
    />
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    backgroundColor: '#fff'
  },
  tabBarIndicatorStyle: {
    backgroundColor: '#409EFF' 
  }
});

export default Tab;