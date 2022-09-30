import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

/**选择图片*/
const SelectPhotos = ({
  field, 
  form, 
  label,
  rightButton,
  placeholder,
  inputStyle,
  ...rest
}) => {
  console.log('form', form);
  console.log('field.value', field.value);

  //从图库选择图片
  const selectPhotosOnPress = async () => {
    try {
      const pickerImage = await ImagePicker.openPicker({
        cropperChooseText: '确定',
        cropperCancelText: '取消',
        width: 300,
        hignt: 400,
        compressImageMaxWidth: 300,
        cropping: true,
      })
      const fileName = `${pickerImage.modificationDate}${Math.round(Math.random() * 1000000000000) + '.jpg'}`;
      const data = new FormData();
      const file = {
        uri: pickerImage.path, type: 'multipart/form-data', name: fileName,
      };
      data.append('file', file);
      restForm.setFieldValue('companyImages', data);
      console.log('选择图库照片：', pickerImage)
      return pickerImage;
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <View style={[{marginBottom: form.errors[field.name] ? 10 : 20}, inputStyle]}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={[{width: 120, height: 120, borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 4, justifyContent: 'center', alignItems: 'center'}, !!form.errors[field.name] && {borderColor: 'red'}]} onPress={selectPhotosOnPress}>
            <AntDesign
              name='plus'
              size={36}
              color='#999999'
            />
            <Text style={{fontSize: 20, color: '#999999'}}>上传</Text>
          </TouchableOpacity>
          {!!form.errors[field.name] && <View>
            <ErrorMessage
              name={field.name}
              style={styles.errorMessage}
              component={Text}
            />
          </View>}
        </View>
      </View>
    </View>
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
    flex: 1
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