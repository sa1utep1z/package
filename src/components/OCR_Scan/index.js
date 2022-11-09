import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text, PermissionsAndroid, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import ImagePicker from 'react-native-image-crop-picker';
import ScaleView from 'react-native-scale-view';

import HomeApi from '../../request/HomeApi';
import { SUCCESS_CODE } from '../../utils/const';

const OCR_Scan = ({
  restForm,
  uploadOtherFunc, //识别图片同时触发的其他函数
  setButtonLoading, //识别图片的按钮loading
}, ref) => {
  const toast = useToast();

  const [modalVisible, setModalVisible] = useState(false);

  const closeOCR = () => setModalVisible(false);

  useImperativeHandle(ref, () => {
    return { setModalVisible };
  }, []);
  
  // 获取权限
  const takePhoto = async () => {
    try {
      let isOpen = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (Platform.OS === 'android' && !isOpen) {
        let res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (res !== 'granted') {
          Alert.alert('相机权限未开启', '请在手机的“设置”选项中允许访问您的摄像头和麦克风');
        }
      }
      openCamera();
    } catch (error) {
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setModalVisible(false);
    }
  };
  
  //调用相机拍照
  const openCamera = async () => {
    try {
      const cameraImage = await ImagePicker.openCamera({
        cropperChooseText: '确定',
        cropperCancelText: '取消',
        cropping: false,
        multiple: false,
        compressImageQuality: 0.2,
      });
      const fileName = `${cameraImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
      uploadImage(fileName, cameraImage.path);
    } catch (error) {
      console.log('openCamera->err', err);
      // toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    }
  };

  //从图库选择图片
  const selectPhoto = async () => {
    try{
      const pickerImage = await ImagePicker.openPicker({
        cropperChooseText: '确定',
        cropperCancelText: '取消',
        width: 300,
        height: 400,
        compressImageMaxWidth: 300,
        cropping: true,
      });
      const fileName = `${pickerImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
      uploadImage(fileName, pickerImage.path);
    } catch (err) {
      console.log('selectPhoto->err', err);
      // toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally {
      setModalVisible(false);
    }
  };

  // 上传图片
  const uploadImage = async (fileName, localFilePath) => {
    setButtonLoading(true);
    const data = new FormData();
    data.append('file', { uri: localFilePath, type: 'multipart/form-data', name: fileName });
    try {
      const res = await HomeApi.ocrReq(data);
      if(res.code !== SUCCESS_CODE){
        toast.show(`${res?.msg}，请重新尝试`, {type: 'danger'});
        return;
      }
      toast.show('识别成功', {type: 'success'});
      restForm.setFieldValue('memberName', res.data.name);
      restForm.setFieldValue('memberIdCard', res.data.idNo);
      restForm.setFieldValue('memberFrom', res.data.address);
      uploadOtherFunc && uploadOtherFunc(res.data);
      setButtonLoading(false);
    } catch (error) {
      setButtonLoading(false);
      toast.show(`出现了意料之外的问题，请联系系统管理员处理`, { type: 'danger' });
    } finally{
      setModalVisible(false);
      setButtonLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={closeOCR}>
        <ScaleView designWidth={750}>
          <TouchableOpacity activeOpacity={1} style={styles.totalArea} onPress={closeOCR}>
            <View style={styles.boxArea}>
              <Text style={styles.titleText}>请选择图片来源</Text>
              <AntDesign style={styles.closeIcon} name="closecircle" size={48} color="#999999" onPress={closeOCR}/>
              <TouchableOpacity style={styles.takePhotoButton}>
                <Text style={styles.takePhotoButtonText} onPress={takePhoto}>拍照上传</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectPhotoButton}>
                <Text style={styles.selectPhotoButtonText} onPress={selectPhoto}>从相册选择</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScaleView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  totalArea: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    justifyContent: 'center'
  },
  boxArea: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 32, 
    marginHorizontal: 40, 
    padding: 30, 
    shadowColor: "#000", 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  titleText: {
    fontSize: 36, 
    color: '#333333', 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  closeIcon: {
    right: 30, 
    top: 30,
    position: 'absolute'
  },
  takePhotoButton: {
    backgroundColor: '#409EFF', 
    borderRadius: 50, 
    paddingVertical: 20, 
    marginTop: 40, 
    marginHorizontal: 20
  },
  takePhotoButtonText: {
    fontSize: 28, 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  selectPhotoButton: {
    backgroundColor: '#409EFF', 
    borderRadius: 50, 
    paddingVertical: 20, 
    marginTop: 40, 
    marginBottom: 30, 
    marginHorizontal: 20
  },
  selectPhotoButtonText: {
    fontSize: 29, 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    textAlign: 'center'
  }
})

export default forwardRef(OCR_Scan);