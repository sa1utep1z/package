import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity, Modal} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import FitImage from 'react-native-fit-image';

import { deepCopy } from '../../../utils';

/**选择图片*/
const SelectPhotos = ({
  field, 
  form, 
  label,
  inputStyle
}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [showImage, setShowImage] = useState({});

  //从图库选择图片
  const selectPhotosOnPress = async () => {
    try {
      const pickerImage = await ImagePicker.openPicker({
        cropperChooseText: '确定',
        cropperCancelText: '取消',
        width: 300,
        height: 400,
        compressImageMaxWidth: 300,
        cropping: true,
      })
      const fileName = `${pickerImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
      const data = new FormData();
      const file = {
        uri: pickerImage.path, type: 'multipart/form-data', name: fileName,
      };
      data.append('file', file);
      const copyList = deepCopy(field.value);
      copyList.push(file);
      form.setFieldValue(field.name, copyList);
      return pickerImage;
    } catch (err) {
      console.log('err', err);
    }
  };

  const pressImage = image => {
    setModalVisible(true);
    setShowImage(image);
  };

  const deleteImg = () => {
    setModalVisible(false);
    const imgName = showImage.name;
    const fieldValueIndex = field.value.findIndex(item => item.name === imgName);
    const copyList = deepCopy(field.value);
    copyList.splice(fieldValueIndex, 1);
    form.setFieldValue(field.name, copyList);
  };

  return (
    <>
      <View style={[{marginBottom: form.errors[field.name] && form.touched[field.name] ? 10 : 20}, inputStyle]}>
        <View style={styles.container}>
          <Text style={styles.labelText}>{label}：</Text>
          <View style={{flex: 1}}>
            <View style={styles.inputContainer}>
              {field.value.length ? field.value.map((image, imageIndex) => (
                <TouchableOpacity key={imageIndex} onPress={() => pressImage(image)}>
                  <Image
                    style={{width: 120, height: 120, marginRight: 20, marginBottom: 20}}
                    source={image.name === 'normal.jpg' ? require('../../../assets/images/order_normal_img.jpg') : {uri: `${image.uri}`}}
                  />
                </TouchableOpacity>
              )) : <></>}
              <TouchableOpacity style={[{width: 120, height: 120, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 4, justifyContent: 'center', alignItems: 'center'}, !!form.errors[field.name] && form.touched[field.name] && {borderColor: 'red'}]} onPress={selectPhotosOnPress}>
                <AntDesign
                  name='plus'
                  size={36}
                  color='#999999'
                />
                <Text style={{fontSize: 20, color: '#999999'}}>上传</Text>
              </TouchableOpacity>
            </View>
            <ErrorMessage
              name={field.name}
              style={styles.errorMessage}
              component={Text}
            />
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=>setModalVisible(false)}>
        <View style={{backgroundColor: 'rgba(0,0,0,.4)', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: '90%', maxHeight: '90%', minHeight: 50, backgroundColor: '#fff', borderRadius: 10, padding: 10}}>
            <TouchableOpacity style={{position: 'absolute', width: 50, height: 50, marginTop: 10, marginRight: 10, right: 0, backgroundColor: 'rgba(0,0,0,0)', zIndex: 999, justifyContent: 'center', alignItems: 'center'}} onPress={()=>setModalVisible(false)}>
              <AntDesign
                name='close'
                size={36}
                color='#999999'
              />
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', width: 50, height: 50, left: 0, marginLeft: 10, marginTop: 10, backgroundColor: 'rgba(0,0,0,0)', zIndex: 999, justifyContent: 'center', alignItems: 'center'}} onPress={deleteImg}>
              <AntDesign
                name='delete'
                size={30}
                color='#ff6666'
              />
            </TouchableOpacity>
            <FitImage source={{uri: showImage.name === 'normal.jpg' ? 'https://labor-prod.oss-cn-shenzhen.aliyuncs.com/laborMgt/labor/normal.jpg.jpg' : `${showImage.uri}`}}/>
          </View>
        </View>
      </Modal>
    </>
  )
};

const styles = StyleSheet.create({
  inputArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  }
})

export default SelectPhotos;