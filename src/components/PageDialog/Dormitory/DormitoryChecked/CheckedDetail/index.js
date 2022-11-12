import React, {useState} from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Shadow } from 'react-native-shadow-2';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";

import { closeDialog } from "../../../../../redux/features/PageDialog";
import ImageZoom from '../../../../../components/ImageZoom';

const CheckedDetail = ({
  detailData,
  isDialog2, //是否是二级弹窗，是的话则不显示底部按钮；
}) => {
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

  const rejectOnPress = () => dispatch(closeDialog());

  const passOnPress = () => console.log('确认', detailData);

  const modalOnPress = () => setIsVisible(!isVisible);

  const imageOnPress = (imgList, imgIndex) => {
    setIsVisible(true);
    setImageUrls(imgList);
    setImgIndex(imgIndex);
  };

  return (
    <View style={styles.totalArea}>
      <View style={styles.topArea}>
        <Text style={styles.dateText}>点检日期：2022-05-03</Text>
        <View style={styles.bottomTextArea}>
          <Text style={styles.bottomTextArea_left}>楼栋：241栋</Text>
          <Text style={styles.bottomTextArea_right}>房间：504</Text>
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
                    <Text style={styles.rightText}>{detailData.hygieneStatus === 1 ? '合格' : '不合格'}</Text>
                    <AntDesign style={{marginLeft: 6}} name={detailData.hygieneStatus === 1 ? "checkcircle" : "closecircle"} size={28} color={detailData.hygieneStatus === 1 ? "#3dab6b" : "red"} />
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>宿舍卫生照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {detailData.hygieneImages.length ? <>
                      {detailData.hygieneImages.map((image, imageIndex) => (
                      <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(detailData.hygieneImages, imageIndex)}>
                        <Image style={styles.image} source={{ uri: `${image.url}` }} />
                      </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.textLine}>
                  <Text style={styles.titleText}>宿舍设施状况</Text>
                  <View style={styles.textLine_right}>
                    <Text style={styles.rightText}>{detailData.facilityStatus === 1 ? '正常' : detailData.facilityStatus === 2 ? '维修中' : detailData.facilityStatus === 3 ? '损坏' : '丢失'}</Text>
                    <AntDesign style={{marginLeft: 6}} name={detailData.facilityStatus === 1 ? 'checkcircle' : detailData.facilityStatus === 2 ? 'pausecircle' : detailData.facilityStatus === 3 ? 'exclamationcircle' : 'questioncircle'} size={28} color={detailData.facilityStatus === 1 ? '#3dab6b' : detailData.facilityStatus === 2 ? '#d2d655' : detailData.facilityStatus === 3 ? '#a93d3d' : '#999999'} />
                  </View>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>宿舍设施照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {detailData.facilityImages.length ? <>
                      {detailData.facilityImages.map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(detailData.facilityImages, imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.titleText}>本期水表数</Text>
                  <Text style={styles.rightText}>{`${detailData.waterNum} 立方`}</Text>
                </View>
                <View style={styles.listItem}>
                  <Text style={styles.titleText}>本期电表数</Text>
                  <Text style={styles.rightText}>{`${detailData.electricNum} 度`}</Text>
                </View>
                <View style={styles.photoArea}>
                  <Text style={styles.titleText}>水/电表现场照片</Text>
                  <View style={styles.rightPhotosArea}>
                    {detailData.waterAndElectricImages.length ? <>
                      {detailData.waterAndElectricImages.map((image, imageIndex) => (
                        <TouchableOpacity key={imageIndex} onPress={() => imageOnPress(detailData.waterAndElectricImages, imageIndex)}>
                          <Image style={styles.image} source={{ uri: `${image.url}` }} />
                        </TouchableOpacity>))}
                    </> : <Text style={styles.image_null_text}>无</Text>}
                  </View>
                </View>
                <View style={styles.longTextArea}>
                  <Text style={styles.longTextTitle}>本次点检情况描述</Text>
                  <Text style={styles.longText}>哇哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</Text>
                </View>
                <View style={styles.lastItem}>
                  <Text style={styles.titleText}>下次点检日期</Text>
                  <Text style={styles.rightText}>2022-05-17</Text>
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
    minHeight: 100,
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