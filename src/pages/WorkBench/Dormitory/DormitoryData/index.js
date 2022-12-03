import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';

import DormitoryDataListApi from "../../../../request/Dormitory/DormitoryDataListApi";
import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import { openDialog, setTitle } from "../../../../redux/features/PageDialog";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { ROOM_TYPE_LIST, ROOM_TYPE_COLOR, SUCCESS_CODE } from '../../../../utils/const';
import RoomData from '../../../../components/PageDialog/Dormitory/RoomData';

let timer;
const originNumber = {
  totalMale: 0, //总
  totalFemale: 0,
  freeMale: 0, //空余
  freeFemale: 0, 
  stayMale: 0, //已占用
  stayFemale: 0,
  occupy: 0, //占用
  fix: 0, //维修
};
const DormitoryData = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();
  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [searchContent, setSearchContent] = useState({});
  const [floorsList, setFloorsList] = useState([]);
  const [originData, setOriginData] = useState({});
  const [topNumber, setTopNumber] = useState(originNumber);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  useEffect(()=>{
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      searchContent.roomBuildingId && getRoomList(searchContent);
    }, 0);
    return () => timer && clearTimeout(timer);
  }, [searchContent])
  
  const getRoomList = async(params) => {
    try {
      setLoading(true);
      console.log('getRoomList -> params', params);
      const res = await DormitoryDataListApi.getRoomList(params);
      console.log('getRoomList -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setOriginData(res.data);
      if(res.data){
        setTopNumber(res.data.total);
        setFloorsList(res.data.floorsList);
      }else{
        setTopNumber(originNumber);
      }
    } catch (error) {
      console.log('getRoomList -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };
  
  const roomOnPress = (room, floor) => {
    if(room.flag === 3 || room.flag === 4) {
      toast.show(`房间${room.flag === 3 ? '维修': '占用'}中！`, {type: 'warning'});
      return;
    }
    const roomMsg = {...room, floor: floor.floorName, building: originData.buildingName};
    dispatch(setTitle('房间住宿信息'));
    dispatch(openDialog(<RoomData navigation={navigation} room={roomMsg} refresh={refresh} />));
  };

  const filterFun = (values) => {
    const search = {
      roomBuildingId: values.buildingNum.length ? values.buildingNum[0].value : '',
      roomFloorId: values.floorNum.length ? values.floorNum[0].value : '',
      ability: values.liveType[0].value,
      str: values.search,
    };
    setSearchContent(search);
  };

  const refresh = () => setSearchContent({...searchContent});

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterFun={filterFun}
        autoQueryBuilding
        filterBuildingAndFloor
        filterLiveType
        filterMemberInfo
        buildingCanDelete={false}
      />
      <View style={[styles.totalArea, !showSearch && {paddingTop: 20}]}>
        <View style={styles.topArea}>
          <View style={styles.topArea_top}>
            <View style={styles.topArea_top_left}>
              <Text style={styles.topFont}>总床位：<Text style={styles.normalColor}>{topNumber.totalMale + topNumber.totalFemale}</Text><Text style={styles.topFont_little}>（ 男<Text style={styles.maleColor}>:{topNumber.totalMale}</Text> 女:<Text style={styles.femaleColor}>{topNumber.totalFemale}</Text> ）</Text></Text>
            </View>
            <View style={styles.topArea_top_right}>
              <Text style={styles.topFont}>空余：<Text style={styles.normalColor}>{topNumber.freeMale + topNumber.freeFemale}</Text><Text style={styles.topFont_little}>（ 男:<Text style={styles.maleColor}>{topNumber.freeMale}</Text> 女:<Text style={styles.femaleColor}>{topNumber.freeFemale}</Text> ）</Text></Text>
            </View>
          </View>
          <View style={styles.topArea_bottom}>
            <View style={styles.topArea_bottom_left}>
              <Text style={styles.topFont}>已入住：<Text style={styles.normalColor}>{topNumber.stayMale + topNumber.stayFemale}</Text><Text style={styles.topFont_little}>（ 男:<Text style={styles.maleColor}>{topNumber.stayMale}</Text> 女:<Text style={styles.femaleColor}>{topNumber.stayFemale}</Text> ）</Text></Text>
            </View>
            <View style={styles.topArea_bottom_right}>
              <View style={styles.topArea_bottom_right_left}>
                <Text style={styles.topFont}>占用：<Text style={styles.normalColor}>{topNumber.occupy}</Text></Text>
              </View>
              <View style={styles.topArea_bottom_right_right}>
                <Text style={styles.topFont}>维修中：<Text style={styles.normalColor}>{topNumber.fix}</Text></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomArea}>
          {originData ? <>
            <Text style={styles.topTitle}>{originData.buildingName || '无'}</Text>
            {loading && <ActivityIndicator size={36} color="#409EFF" style={styles.loadingIcon} />}
            <View style={styles.bottomArea_top}>
              {ROOM_TYPE_LIST.map(type => <View key={type.value} style={[styles.typeItemArea, type.value === 'occupying' && styles.occupying]}>
                <View style={[styles.typeColor, {backgroundColor: type.color}]}></View>
                <Text style={styles.typeFont}>{type.label}</Text>
              </View>)}
            </View>
            <ScrollView style={styles.bottomArea_bottom} showsVerticalScrollIndicator={false} >
              {floorsList.map((floorList, floorListIndex) => <View key={floorList.floorId} style={[styles.floorArea, floorListIndex === 0 && {marginTop: 10}]}>
                  <View style={styles.floorArea_left}>
                    <Text style={styles.floorArea_leftText}>{floorList.floorName}F</Text>
                  </View>
                  <View style={styles.floorArea_right}>
                    {floorList.roomList.map(room => <View key={room.roomId} style={styles.roomArea}>
                      <TouchableOpacity activeOpacity={(room.flag === 3 || room.flag === 4) ? 1 : 0.2} style={[styles.roomTouchArea, {backgroundColor: ROOM_TYPE_COLOR[room.flag], borderColor: ROOM_TYPE_COLOR[room.flag]}]} onPress={()=>roomOnPress(room, floorList)}>
                        {room.flag === 3 && <MaterialCommunityIcons name="tools" size={24} color="#333333" style={styles.icon} />}
                        <Text style={styles.roomNum}>{room.name}</Text>
                        <View style={{flex: 1}}>
                          <Text style={styles.bottomNum}>定员：{room.total}</Text>
                          <Text style={styles.bottomNum}>空余：{room.free}</Text>
                          <Text style={[styles.bottomNum, {fontSize: 22}]}>类别：{room.male ? '男' : '女'}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>)}
                  </View>
                </View>)}
            </ScrollView>
          </> : <View style={styles.emptyArea}>
            <Foundation name="page-remove" size={72} color="#999999" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>暂无房间</Text>
          </View>}
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  totalArea: {
    flex: 1,
  },
  topFont: {
    fontSize: 24, 
    color: '#333333'
  },
  topFont_little: {
    fontSize: 22, 
    color: '#333333'
  },
  normalColor: {
    color: '#409EFF'
  },
  maleColor: {
    color: '#0000ff'
  },
  femaleColor: {
    color: '#eb00d8'
  },
  topArea: {
    height: 100, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 8, 
    marginHorizontal: 20, 
    marginBottom: 20
  },
  topArea_top: {
    flex: 1, 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF'
  },
  topArea_top_left: {
    flex: 1, 
    borderRightWidth: 1, 
    borderColor: '#EFEFEF', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  topArea_top_right: {
    width: 310, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  topArea_bottom: {
    flex: 1, 
    flexDirection: 'row'
  },
  topArea_bottom_left: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRightWidth: 1, 
    borderColor: '#EFEFEF'
  },
  topArea_bottom_right: {
    width: 310, 
    flexDirection: 'row'
  },
  topArea_bottom_right_left: {
    width: 150, 
    borderRightWidth: 1, 
    borderColor: '#EFEFEF', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  topArea_bottom_right_right: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  bottomArea: {
    flex: 1, 
    marginHorizontal: 20, 
    borderTopRightRadius: 20, 
    borderTopLeftRadius: 20, 
    backgroundColor: '#FFFFFF'
  },
  topTitle: {
    fontSize: 30, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#333333', 
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF', 
    paddingVertical: 5
  },
  loadingIcon: {
    top: 7,
    right: 10, 
    position: 'absolute'
  },
  bottomArea_top: {
    height: 50, 
    paddingTop: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderBottomWidth: 1, 
    borderColor: '#EFEFEF'
  },
  typeItemArea: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  occupying: {
    flex: 0, 
    width: 220
  },
  typeColor: {
    width: 38, 
    height: 24, 
    borderRadius: 5, 
    marginRight: 6,
  },
  typeFont: {
    fontSize: 22, 
    color: '#333333'
  },
  bottomArea_bottom: {
    flex: 1, 
    backgroundColor: '#FFFFFF'
  },
  floorArea: {
    marginBottom: 10, 
    flexDirection: 'row', 
    borderWidth: 1, 
    marginHorizontal: 10, 
    borderRadius: 8, 
    borderColor: '#EFEFEF'
  },
  floorArea_left: {
    width: 100, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRightWidth: 1, 
    borderColor: '#EFEFEF'
  },
  floorArea_leftText: {
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#333333'
  },
  floorArea_right: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingLeft: 10, 
    paddingTop: 10
  },
  roomArea: {
    width: '25%', 
    height: 200
  },
  roomTouchArea: {
    flex: 1, 
    marginRight: 10, 
    marginBottom: 10, 
    paddingBottom: 10, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  icon: {
    position: 'absolute', 
    right: 6, 
    top: 6
  },
  roomNum: {
    height: 60, 
    fontSize: 28, 
    color: '#000000', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  bottomNum: {
    flex: 1, 
    fontSize: 24, 
    color: '#000000', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  emptyArea: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyIcon: {
    marginBottom: 10
  },
  emptyText: {
    fontSize: 26, 
    color: '#999999'
  },
});

export default DormitoryData;