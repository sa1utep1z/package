import React from "react";
import { View, Modal, StyleSheet, Text, TouchableOpacity, PermissionsAndroid } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFS from 'react-native-fs';
import { useToast } from "react-native-toast-notifications";

const ImageZoom = ({
  imageUrls = [],
  isVisible = false,
  onShowModal = () => {},
  onCancel = () => {},
}) => {
  const Toast = useToast();
  // 保存图片方法
  const savePhoto = async (url) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: "App相册权限申请",
        message: "App需要保存图片到您的相册",
        buttonNeutral: "稍后询问",
        buttonNegative: "取消",
        buttonPositive: "确定"
      }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        let androidDownPath = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`;
        let DownloadFileOptions = {
          fromUrl: url, //下载路径
          toFile: androidDownPath 
        }
        let result = RNFS.downloadFile(DownloadFileOptions);
        result.promise.then((val) => {
          console.log('val',val)
          console.log("文件下载成功：" + androidDownPath)
          let promise = CameraRoll.saveToCameraRoll(androidDownPath);
          promise.then((result) => {
            console.log('保存成功！', result)
            Toast.show('保存成功！', {type: 'success'});
            onCancel();
          }).catch((error) => {
            Toast.show('保存失败！', {type: 'error'});
            console.log('保存失败！\n' + error);
          });
        })
      }
    } catch (err) {
      console.warn(err)
    }
  }


  const header = () => {
    return (
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => onCancel()}>
          <AntDesign
            name='close'
            color='#FFFEFE'
            size={30}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      <Modal visible={isVisible}>
        <ImageViewer imageUrls={imageUrls} renderHeader={header} enableSwipeDown saveToLocalByLongPress menuContext={{ saveToLocal: '保存图片到相册', cancel: '取消' }} onSave={(url) => savePhoto(url)} onShowModal={onShowModal} onSwipeDown={onCancel} Onclick={onCancel} />
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 9999,
  },
});

export default ImageZoom;