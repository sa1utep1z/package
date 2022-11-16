import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import HeaderCenterSearch from "../../../../components/Header/HeaderCenterSearch";
import HeaderSearchOfDormitory from '../../../../components/HeaderSearchOfDormitory';
import { openListSearch } from "../../../../redux/features/listHeaderSearch";
import { ROOM_TYPE_LIST, ROOM_TYPE_COLOR } from '../../../../utils/const';

const DormitoryData = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const showSearch = useSelector(state => state.listHeaderSearch.canSearch);

  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerCenterArea: ({...rest}) => <HeaderCenterSearch routeParams={rest}/>
    })
    dispatch(openListSearch());
  }, [])

  useEffect(()=>{
    let roomData = [];
    for(let floor = 1; floor < 13; floor ++){
      let roomList = [];
      for(let room = 1; room < 9; room ++){
        roomList.push({
          roomName: `${floor}0${room}`,
          maxNum: 8,
          emptyNum: room % 5 === 0 ? 0 : room % 4 === 0 ? 0 : room % 3 === 0 ? 8 : room % 2 === 0 ? Math.ceil(Math.random()*7) : 0,
          roomType: floor % 2 === 0 ? 'female' : 'male',
          roomStatus: room % 5 === 0 ? 'occupying' : room % 4 === 0 ? 'fixing' : room % 3 === 0 ? 'full' : room % 2 === 0 ? 'notFull' : 'emptyRoom'
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
    console.log('room', room);
  };

  return (
    <View style={styles.screen}>
      <HeaderSearchOfDormitory 
        filterBuildingAndFloor
        filterLiveType
        filterMemberInfo
      />
      <View style={[{flex: 1}, !showSearch && {paddingTop: 20}]}>
        <View style={{height: 100, backgroundColor: '#FFFFFF', borderRadius: 8, marginHorizontal: 20, marginBottom: 10}}>
          <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#EFEFEF'}}>
            <View style={{flex: 1, borderRightWidth: 1, borderColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: '#333333'}}>总床位：<Text style={{color: '#409EFF'}}>300</Text><Text style={{fontSize: 22, color: '#333333'}}>（ 男<Text style={{color: '#0000ff'}}>200</Text> 女<Text style={{color: '#eb00d8'}}>100</Text> ）</Text></Text>
            </View>
            <View style={{width: 310, borderRightWidth: 1, borderColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: '#333333'}}>空余：<Text style={{color: '#409EFF'}}>70</Text><Text style={{fontSize: 22, color: '#333333'}}>（ 男<Text style={{color: '#0000ff'}}>40</Text> 女<Text style={{color: '#eb00d8'}}>30</Text> ）</Text></Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, borderRightWidth: 1, borderColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: '#333333'}}>已入住：<Text style={{color: '#409EFF'}}>200</Text><Text style={{fontSize: 22, color: '#333333'}}>（ 男<Text style={{color: '#0000ff'}}>100</Text> 女<Text style={{color: '#eb00d8'}}>100</Text> ）</Text></Text>
            </View>
            <View style={{width: 310, flexDirection: 'row'}}>
              <View style={{width: 150, borderRightWidth: 1, borderColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 24, color: '#333333'}}>占用：<Text style={{color: '#409EFF'}}>10</Text></Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 24, color: '#333333'}}>维修中：<Text style={{color: '#409EFF'}}>99</Text></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1, marginHorizontal: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#FFFFFF'}}>
          <View style={{height: 50, flexDirection: 'row'}}>
            {ROOM_TYPE_LIST.map(type => <View key={type.value} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#EFEFEF'}}>
              <View style={{width: 38, height: 24, borderRadius: 5, marginRight: 6, backgroundColor: type.color}}></View>
              <Text style={{fontSize: 22, color: '#333333'}}>{type.label}</Text>
            </View>)}
          </View>
          <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            {roomData.map((floorList, floorListIndex) => <View key={floorList.floor} style={[{marginBottom: 10, flexDirection: 'row', borderWidth: 1, marginHorizontal: 10, borderRadius: 8, borderColor: '#EFEFEF'}, floorListIndex === 0 && {marginTop: 10}]}>
                <View style={{width: 100, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#EFEFEF'}}>
                  <Text style={{fontSize: 30, fontWeight: 'bold', color: '#333333'}}>{floorList.floor}F</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 10, paddingTop: 10}}>
                  {floorList.roomList.map((room, roomIndex) => <View key={roomIndex} style={{width: '25%', height: 200}}>
                    <TouchableOpacity style={{flex: 1, marginRight: 10, marginBottom: 10, paddingBottom: 10, borderRadius: 6, backgroundColor: ROOM_TYPE_COLOR[room.roomStatus]}} onPress={()=>roomOnPress(room)}>
                      <Text style={{height: 60, fontSize: 28, color: '#000000', fontWeight: 'bold', textAlign: 'center', textAlignVertical: 'center'}}>{room.roomName}</Text>
                      <View style={{flex: 1}}>
                        <Text style={{flex: 1, fontSize: 24, color: '#000000', textAlign: 'center', textAlignVertical: 'center'}}>定员：{room.maxNum}</Text>
                        <Text style={{flex: 1, fontSize: 24, color: '#000000', textAlign: 'center', textAlignVertical: 'center'}}>空余：{room.emptyNum}</Text>
                        <Text style={{flex: 1, fontSize: 22, color: '#000000', textAlign: 'center', textAlignVertical: 'center'}}>类别：{room.roomType === 'female' ? '女' : '男'}</Text>
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
  tabArea: {
    height: 120, 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF'
  },
  tabItem: {
    flex: 1, 
    justifyContent: 'center'
  },
  tabText: {
    fontSize: 28, 
    color: '#333333', 
    textAlign: 'center'
  },
  tabText_selected: {
    color: '#409EFF', 
    fontWeight: 'bold', 
    fontSize: 32
  },
  tabNumberText: {
    fontSize: 28, 
    textAlign: 'center'
  },
  tabNumberText_selected: {
    color: '#409EFF', 
    fontWeight: 'bold', 
    fontSize: 32
  },
  listHeadArea: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    backgroundColor: '#ffffff'
  },
  titleText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#333333'
  },
  headTitle: {
    flex: 1, 
    textAlign: 'center', 
    fontSize: 26, 
    color: '#333333'
  },
  buttonContainerStyle: {
    margin: 20
  },  
  buttonStyle: {
    height: 80,
    backgroundColor: '#409EFF',
    borderWidth: 0,
    borderRadius: 50
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10
  }
});

export default DormitoryData;