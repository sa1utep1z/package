import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, CheckBox, Input } from '@rneui/themed';
import { WebView } from 'react-native-webview';

const RadioGroup = ({
  field,
  form,
  title,
  labelAreaStyle,
  arryDate,
  ...rest
}) => {
  const [radio, setRadio] = useState(false);
  const [groupDate, setGroupDate] = useState(arryDate);

  const pressCheck = (value) => {
    const res = arryDate.map((item) => {
      if (item.value === value) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item;
    })
    setGroupDate(res);
    console.log('打印选择的值：', value, arryDate)
  };

  return (
    <View style={styles.selectItemArea}>
      <View style={[styles.titleArea, labelAreaStyle]}>
        <Text style={{ fontSize: 32 }}>{title}: </Text>
      </View>
      <View style={styles.radioArea}>
        {
          groupDate.length > 0 && groupDate.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={[styles.radio, { marginRight: 20 }]}>
                <CheckBox
                  title={item.label}
                  center
                  size={40}
                  checked={item.checked}
                  onPress={() => pressCheck(item.value)}
                  containerStyle={styles.checkBox_containerStyle}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  textStyle={styles.test}
                />
              </TouchableOpacity>
            )
          })
        }
        <Input
        inputStyle={styles.input}
        placeholder="请输入备注说明"
        placeholderTextColor="#999999"
        containerStyle={styles.inputStyle}
        inputContainerStyle={styles.noBorder}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selectItemArea: {
    flex: 1,
    flexWrap: 'wrap',
    minHeight: 91,
    paddingLeft: 28,
    flexDirection: 'row',
    borderBottomColor: 'rgba(0,0,0,.05)',
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  titleArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  radioArea: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    flexWrap: 'wrap'
  },
  radio: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBox_containerStyle: {
    margin: 0,
    padding: 0,
    textAlignVertical: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: 5
  },
  checkBox_icon: {
    fontFamily: "iconfont",
    color: '#409EFF',
    fontSize: 20
  },
  falseColor: {
    color: '#DDDDDD'
  },
  test: {
    fontSize: 26,
    color: '#333',
    fontWeight: 'normal'
  },
  input: {
    // width: 150,
    height: 50,
    borderWidth: 1,
    fontSize: 24,
    color: '#333',
    borderColor: '#E5E5E5',
    marginRight: 15
  },
  inputStyle: {
    // width: 250,
    height: 60,
    marginTop: 10,
    borderWidth: 0,
  },
  noBorder: {
    // paddingVertical: 0,
    borderBottomWidth: 0
  }
})

export default RadioGroup;