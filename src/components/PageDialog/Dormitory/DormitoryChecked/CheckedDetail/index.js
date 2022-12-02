import React, {useState, useEffect} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";

import { closeDialog } from "../../../../../redux/features/PageDialog";
import DormitoryCheckListApi from "../../../../../request/Dormitory/DormitoryCheckListApi";
import ImageZoom from '../../../../../components/ImageZoom';
import { SUCCESS_CODE, DORMITORY_FACILITY_NAME, DORMITORY_FACILITY_ICON, DORMITORY_FACILITY_COLOR } from '../../../../../utils/const';

const CheckedDetail = ({
  item,
  isDialog2, //是否是二级弹窗，是的话则不显示底部按钮；
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [isVisible, setIsVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [checkedDetail, setCheckedDetail] = useState({});

  useEffect(()=>{
    queryRoomDetail(item.id);
  }, [item])

  const queryRoomDetail = async(id) => {
    try {
      const res = await DormitoryCheckListApi.queryCheckedDetail(id);
      console.log('queryRoomDetail -> res', res);
      if(res?.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}`, {type: 'danger'});
        return;
      }
      setCheckedDetail(res.data);
    } catch (error) {
      console.log('queryRoomDetail -> error', error);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => dispatch(closeDialog());

  const modalOnPress = () => setIsVisible(!isVisible);

  const imageOnPress = (imgList, imgIndex) => {
    setIsVisible(true);
    setImageUrls(imgList);
    setImgIndex(imgIndex);
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <Text style={styles.dateText}>点检日期：{moment(checkedDetail.date).format('YYYY-MM-DD')}</Text>
        <View style={styles.bottomTextArea}>
          <Text style={styles.bottomTextArea_left}>楼栋：{checkedDetail.buildingName || '无'}</Text>
          <Text style={styles.bottomTextArea_right}>房间：{checkedDetail.roomName || '无'}</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollViewArea} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollView_total}>
          <Shadow style={styles.dormitoryArea}>
            <View style={{borderRadius: 10}}>
              <View style={styles.dormitoryArea_topArea}>
                <Text style={styles.dormitoryArea_topAreaText}>宿舍点检详情</Text>
              </View>
              <View style={styles.dormitoryArea_bottomArea}>
                <View style={styles.textLine}>
                  <Text style={styles.titleText}>宿舍卫生状况</Text>
                  <View style={styles.textLine_right}>
                    <Text style={styles.rightText}>{checkedDetail.hygieneStatus === 'QUALIFIED' ? '合格' : '不合格'}</Text>
                    <AntDesign style={{marginLeft: 6}} name={checkedDetail.hygieneStatus === 'QUALIFIED' ? "checkcircle" : "closecircle"} size={28} color={checkedDetail.hygieneStatus === 'QUALIFIED' ? "#3dab6b" : "red"} />
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>宿舍卫生照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {checkedDetail?.hygieneImg?.length ? <>
                      {checkedDetail.hygieneImg.map((image, imageIndex) => (
                      <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(checkedDetail.hygieneImg, imageIndex)}>
                        <Image style={styles.image} source={{ uri: `${image.url}` }} />
                      </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.textLine}>
                  <Text style={styles.titleText}>宿舍资产状况</Text>
                  <View style={styles.textLine_right}>
                    <Text style={styles.rightText}>{DORMITORY_FACILITY_NAME[checkedDetail.assetStatus]}</Text>
                    <AntDesign style={{marginLeft: 6}} name={DORMITORY_FACILITY_ICON[checkedDetail.assetStatus]} size={28} color={DORMITORY_FACILITY_COLOR[checkedDetail.assetStatus]} />
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>宿舍资产照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {checkedDetail?.assetImg?.length ? <>
                      {checkedDetail.assetImg.map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(checkedDetail.assetImg, imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.textLine}>
                  <Text style={styles.titleText}>消防设施状况</Text>
                  <View style={styles.textLine_right}>
                    <Text style={styles.rightText}>{DORMITORY_FACILITY_NAME[checkedDetail.fireDeviceStatus]}</Text>
                    <AntDesign style={{marginLeft: 6}} name={DORMITORY_FACILITY_ICON[checkedDetail.fireDeviceStatus]} size={28} color={DORMITORY_FACILITY_COLOR[checkedDetail.fireDeviceStatus]} />
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>消防设施照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {checkedDetail?.fireDeviceImg?.length ? <>
                      {checkedDetail.fireDeviceImg.map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(checkedDetail.fireDeviceImg, imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.titleText}>本期水表数</Text>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.rightText}>{`${checkedDetail.waterNum}  立方`}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 8}}>
                      <Ionicons style={styles.rightAreaIcon} name='water' size={36} color='#409EFF' />
                    </View>
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>水表现场照</Text>
                  <View style={styles.rightPhotosArea}>
                    {checkedDetail.waterImg ? <>
                      {[checkedDetail.waterImg].map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress([checkedDetail.waterImg], imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.titleText}>本期电表数</Text>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.rightText}>{`${checkedDetail.electricNum}  度`}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 8}}>
                      <MaterialCommunityIcons style={[styles.rightAreaIcon, {transform: [{ rotateZ: '5deg' }]}]} name='lightning-bolt' size={36} color='#ffd700' />
                    </View>
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>电表现场照</Text>
                  <View style={styles.rightPhotosArea}>
                    {checkedDetail.electricImg ? <>
                      {[checkedDetail.electricImg].map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress([checkedDetail.electricImg], imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.longTextArea}>
                  <Text style={styles.longTextTitle}>本次点检情况描述</Text>
                  <Text style={styles.longText}>{checkedDetail.desc}</Text>
                </View>
                <View style={styles.lastItem}>
                  <Text style={styles.titleText}>下次点检日期</Text>
                  <Text style={styles.rightText}>{moment(checkedDetail.nextDate).format('YYYY-MM-DD')}</Text>
                </View>
              </View>
            </View>
          </Shadow>
        </View>
      </ScrollView>
      {!isDialog2 && <View style={styles.bottomArea}>
        <View style={styles.leftArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={rejectOnPress}>
            <Text style={styles.closeText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rightArea}>
          <TouchableOpacity style={styles.buttonArea} onPress={passOnPress}>
            <Text style={styles.confirmText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>}
      <ImageZoom 
        index={imgIndex} 
        isVisible={isVisible} 
        imageUrls={imageUrls} 
        onShowModal={modalOnPress} 
        onCancel={modalOnPress} 
      />
    </View>
  )
};

const styles = StyleSheet.create({
  totalArea: {
    height: 900
  },
  topArea: {
    marginHorizontal: 30,
    backgroundColor: '#979797',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 10
  },
  dateText: {
    fontSize: 26, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#FFFFFF', 
    paddingVertical: 8
  },
  bottomTextArea: {
    flexDirection: 'row'
  },
  bottomTextArea_left: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    borderRightWidth: 1, 
    borderColor: '#FFFFFF', 
    paddingVertical: 6
  },
  bottomTextArea_right: {
    flex: 1, 
    fontSize: 24, 
    color: '#FFFFFF', 
    textAlign: 'center', 
    paddingVertical: 6
  },
  scrollViewArea: {
    flex: 1
  },
  scrollView_total: {
    marginHorizontal: 30, 
    marginVertical: 30
  },
  bottomArea: {
    height: 100, 
    flexDirection: 'row'
  },
  leftArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#E3E3E3'
  },
  rightArea: {
    flex: 1, 
    borderTopWidth: 1, 
    borderColor: '#E3E3E3'
  },
  buttonArea: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  closeText: {
    fontSize: 28, 
  },
  confirmText: {
    fontSize: 28, 
    color: '#409EFF'
  },
  dormitoryArea: {
    width: '100%', 
  },
  dormitoryArea_topArea: {
    height: 60, 
    backgroundColor: '#EFEFEF', 
    justifyContent: 'center', 
    borderTopRightRadius: 10, 
    borderTopLeftRadius: 10
  },
  dormitoryArea_topAreaText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  dormitoryArea_bottomArea: {
    padding: 10
  },
  textLine: {
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  textLine_right: {
    flexDirection: 'row', 
    paddingRight: 20, 
    alignItems: 'center'
  },
  photoArea: {
    minHeight: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF'
  },
  photoArea_leftText: {
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#409EFF',
    backgroundColor: '#ECF5FF'
  },
  rightPhotosArea: {
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 10, 
    paddingTop: 10
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 10,
    marginBottom: 10
  },
  image_null_text: {
    fontSize: 24, 
    color: '#333333', 
    paddingLeft: 10
  },
  longTextArea: {
    minHeight: 50,
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  longTextTitle: {
    width: 230, 
    height: '100%', 
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold', 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF', 
    textAlign: 'center', 
    textAlignVertical: 'center'
  },
  longText: {
    flex: 1, 
    paddingVertical: 10,
    paddingHorizontal: 20, 
    fontSize: 24, 
    color: '#333333'
  },
  listItem: {
    height: 50, 
    flexDirection: 'row', 
    borderTopWidth: 1, 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  lastItem: {
    height: 50, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#409EFF', 
    alignItems: 'center'
  },
  titleText: {
    width: 230,
    height: '100%', 
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRightWidth: 1, 
    borderColor: '#409EFF', 
    backgroundColor: '#ECF5FF',
    fontSize: 24, 
    color: '#333333', 
    fontWeight: 'bold'
  },
  rightText: {
    fontSize: 24, 
    paddingLeft: 20, 
    color: '#333333'
  },
})

export default CheckedDetail;