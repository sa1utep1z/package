import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import { openDialog, setTitle } from "../../../../redux/features/PageDialog";
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { ROOM_TYPE_LIST, ROOM_TYPE_COLOR } from '../../../../utils/const';
import RoomData from '../../../../components/PageDialog/Dormitory/RoomData';

const DormitoryData = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    dispatch(openListSearch());
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
  }, [])

  useEffect(()=>{
    let roomData = [];
    for(let floor = 1; floor < 13; floor ++){
      let roomList = [];
      for(let room = 1; room < 9; room ++){
        roomList.push({
          floor,
          roomName: `${floor}0${room}`,
          maxNum: 8,
          emptyNum: room % 5 === 0 ? 0 : room % 4 === 0 ? 0 : room % 3 === 0 ? 8 : room % 2 === 0 ? Math.ceil(Math.random()*7) : 0,
          roomType: floor % 2 === 0 ? 'female' : 'male',
          roomStatus: room % 5 === 0 ? 'occupying' : room % 4 === 0 ? 'occupying' : room % 3 === 0 ? 'full' : room % 2 === 0 ? 'notFull' : 'emptyRoom'
        })
      }
      roomData.push({
        floor,
        roomList
      });
    }
    setRoomData(roomData);
  },[])
  
  const roomOnPress = (room) => {
    console.log('room', room)
    if(room.roomStatus === 'occupying') return;
    dispatch(setTitle('房间住宿信息'));
    dispatch(openDialog(<RoomData navigation={navigation} room={room} />));
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterBuildingAndFloor
        filterLiveType
        filterMemberInfo
      />
      <View style={[styles.totalArea, !showSearch && {paddingTop: 20}]}>
        <View style={styles.topArea}>
          <View style={styles.topArea_top}>
            <View style={styles.topArea_top_left}>
              <Text style={styles.topFont}>总床位：<Text style={styles.normalColor}>300</Text><Text style={styles.topFont_little}>（ 男<Text style={styles.maleColor}>200</Text> 女<Text style={styles.femaleColor}>100</Text> ）</Text></Text>
            </View>
            <View style={styles.topArea_top_right}>
              <Text style={styles.topFont}>空余：<Text style={styles.normalColor}>70</Text><Text style={styles.topFont_little}>（ 男<Text style={styles.maleColor}>40</Text> 女<Text style={styles.femaleColor}>30</Text> ）</Text></Text>
            </View>
          </View>
          <View style={styles.topArea_bottom}>
            <View style={styles.topArea_bottom_left}>
              <Text style={styles.topFont}>已入住：<Text style={styles.normalColor}>200</Text><Text style={styles.topFont_little}>（ 男<Text style={styles.maleColor}>100</Text> 女<Text style={styles.femaleColor}>100</Text> ）</Text></Text>
            </View>
            <View style={styles.topArea_bottom_right}>
              <View style={styles.topArea_bottom_right_left}>
                <Text style={styles.topFont}>占用：<Text style={styles.normalColor}>10</Text></Text>
              </View>
              <View style={styles.topArea_bottom_right_right}>
                <Text style={styles.topFont}>维修中：<Text style={styles.normalColor}>99</Text></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.bottomArea}>
          <View style={styles.bottomArea_top}>
            {ROOM_TYPE_LIST.map(type => <View key={type.value} style={[styles.typeItemArea, type.value === 'occupying' && styles.occupying]}>
              <View style={[styles.typeColor, {backgroundColor: type.color}]}></View>
              <Text style={styles.typeFont}>{type.label}</Text>
            </View>)}
          </View>
          <ScrollView style={styles.bottomArea_bottom}>
            {roomData.map((floorList, floorListIndex) => <View key={floorList.floor} style={[styles.floorArea, floorListIndex === 0 && {marginTop: 10}]}>
                <View style={styles.floorArea_left}>
                  <Text style={styles.floorArea_leftText}>{floorList.floor}F</Text>
                </View>
                <View style={styles.floorArea_right}>
                  {floorList.roomList.map((room, roomIndex) => <View key={roomIndex} style={styles.roomArea}>
                    <TouchableOpacity activeOpacity={room.roomStatus === 'occupying' ? 1 : 0.2} style={[styles.roomTouchArea, {backgroundColor: ROOM_TYPE_COLOR[room.roomStatus]}]} onPress={()=>roomOnPress(room)}>
                      <Text style={styles.roomNum}>{room.roomName}</Text>
                      <View style={{flex: 1}}>
                        <Text style={styles.bottomNum}>定员：{room.maxNum}</Text>
                        <Text style={styles.bottomNum}>空余：{room.emptyNum}</Text>
                        <Text style={[styles.bottomNum, {fontSize: 22}]}>类别：{room.roomType === 'female' ? '女' : '男'}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>)}
                </View>
              </View>)}
          </ScrollView>
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
    borderRadius: 6
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
  }
});

export default DormitoryData;