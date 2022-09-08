import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useToast } from "react-native-toast-notifications";

import Card from "../../components/Card";
import NAVIGATION_KEYS from "../../navigator/key";
import HomeApi from "../../request/HomeApi";
import { WORKBENCH_LIST } from "./workBenchList";
import { SUCCESS_CODE } from '../../utils/const';
import { deepCopy } from "../../utils";

const WorkBench = (props) => {
  const {navigation} = props;

  const toast = useToast();

  const [showList, setShowList] = useState(WORKBENCH_LIST);

  useEffect(() => {
    getSeaPermission();
  }, [])

  //第一次进来的时候获取是否展示公海;
  const getSeaPermission = async() => {
    try {
      const res = await HomeApi.SeasEnable();
      if(res.code !== SUCCESS_CODE){
        toast.show('获取公海权限失败', {type: 'danger'});
        return;
      }
      if(!res.data){
        const copyArr = deepCopy(showList);
        const List = copyArr.find(list => list.key === 'list').list;
        List.splice(List.findIndex(list => list.key === 'seas'), 1);
        setShowList(copyArr);
        return;
      }
      setShowList(WORKBENCH_LIST);
    } catch (error) {
      toast.show('获取公海权限失败,请联系管理员', {type: 'danger'});
    }
  };

  const gotoPage = (item) => {
    navigation.navigate(item.routeName);
  };

  return (
    <ScrollView style={styles.screen}>
      {showList?.length && showList.map((item, index) => (
        <Card
          key={index}
          title={item.moduleName}
          content={
            <View style={styles.cardContent}>
              {item?.list?.length && item.list.map((box, index) => (
                <TouchableOpacity key={index} style={styles.cardItem} onPress={() => gotoPage(box)}>
                  <View style={styles.imgBox}>
                    <Image style={styles.img} source={box.imgBackground}/>
                    <Image style={[
                      styles.icon, 
                      box.routeName === NAVIGATION_KEYS.MY_COMMISSION && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.LEAVING_LIST && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.HIRE_REPORT_FORM && {left: 11, top: 20},
                      box.routeName === NAVIGATION_KEYS.COMPLAINT_PLATE && {left: 22, top: 14}
                    ]} source={box.iconSource}/>
                  </View>
                  <Text style={styles.title}>{box.title}</Text>
                </TouchableOpacity>
                )
              )}
            </View>
          }
        />
      ))}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1, 
    backgroundColor: '#EEF4F7',
    paddingTop: 32
  },
  cardContent: {
    flex: 1, 
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  cardItem: {
    width: '25%', 
    height: 161, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  imgBox: {
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderColor: '#409EFF', 
    marginBottom: 5
  },
  img: {
    width: 92, 
    height: 92,
  },
  icon: {
    position: 'absolute',
    zIndex: 99,
    left: 18,
    top: 18
  },
  title: {
    fontSize: 26, 
    color: '#333333'
  }
});

export default WorkBench;