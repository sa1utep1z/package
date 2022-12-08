import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { useSelector } from 'react-redux';

import Card from "../../components/Card";
import NAVIGATION_KEYS from "../../navigator/key";
import HomeApi from "../../request/HomeApi";
import { WORKBENCH_LIST } from "./workBenchList";
import { SUCCESS_CODE } from '../../utils/const';
import { deepCopy } from "../../utils";

const WorkBench = (props) => {
  const {navigation} = props;

  const toast = useToast();

  const permission = useSelector((state) => state.UserPermission.permission);

  const [showList, setShowList] = useState(WORKBENCH_LIST);

  useEffect(() => {
    getSeaPermission(); //关于公海的筛选；
  }, [])

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
    } finally {
      filterDormitory(); //关于订单/宿舍的筛选；
    }
  };

  const filterDormitory = () => {
    const copyList = deepCopy(showList);
    const dormitoryList = copyList.filter(module => module.key === 'dormitory')[0].list;
    const businessList = copyList.filter(module => module.key === 'business')[0].list;
    if(permission.length){
      if(!permission.includes('menu-dormitoryManage-dailyManage-checkManage')){ //点检
        const findOutIndex = dormitoryList.findIndex(type => type.key === 'dormitoryCheckList');
        dormitoryList.splice(findOutIndex, 1);
      }
      if(!permission.includes('menu-dormitoryManage-dailyManage-disciplineManage')){ //查房
        const findOutIndex = dormitoryList.findIndex(type => type.key === 'dormitoryViolation');
        dormitoryList.splice(findOutIndex, 1);
      }
      if(!permission.includes('menu-dormitoryManage-bedDataManage-bedData')){ //态势
        const findOutIndex = dormitoryList.findIndex(type => type.key === 'dormitoryData');
        dormitoryList.splice(findOutIndex, 1);
      }
      if(!permission.includes('menu-affairsManage')){
        const moduleIndex = copyList.findIndex(module => module.key === 'business');
        copyList.splice(moduleIndex, 1);
      }
      if(!permission.includes('menu-affairsManage-orderManage')){
        const findOutIndex = businessList.findIndex(type => type.key === 'orderManage');
        businessList.splice(findOutIndex, 1);
      }
      if(!permission.includes('menu-affairsManage-companyManage')){
        const findOutIndex = businessList.findIndex(type => type.key === 'businessManage');
        businessList.splice(findOutIndex, 1);
      }
    }
    setShowList(copyList);
  };

  const gotoPage = (item) => navigation.navigate(item.routeName);

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} >
      {showList?.length && showList.map((item, index) => (
        <Card
          key={index}
          title={item.moduleName}
          style={index === showList.length - 1 && styles.cardStyle}
          content={
            <View style={styles.cardContent}>
              {item?.list?.length ? item.list.map((box, index) => (
                <TouchableOpacity key={index} style={styles.cardItem} onPress={() => gotoPage(box)}>
                  <View style={styles.imgBox}>
                    <Image style={styles.img} source={box.imgBackground}/>
                    {box.iconSource && <Image style={[
                      styles.icon, 
                      box.routeName === NAVIGATION_KEYS.MY_COMMISSION && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.LEAVING_LIST && {left: 20, top: 14},
                      box.routeName === NAVIGATION_KEYS.HIRE_REPORT_FORM && {left: 11, top: 20},
                      box.routeName === NAVIGATION_KEYS.COMPLAINT_PLATE && {left: 22, top: 14}
                    ]} source={box.iconSource}/>}
                  </View>
                  <Text style={styles.title}>{box.title}</Text>
                </TouchableOpacity>
                )
              ) : <Text style={{fontSize: 26, marginLeft: 40}}>无</Text>}
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
  cardStyle: {
    marginBottom: 64
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