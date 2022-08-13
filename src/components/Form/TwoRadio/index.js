import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from '@rneui/themed';
import { WebView } from 'react-native-webview';

const TwoRadio = ({
  field, 
  form, 
  title,
  labelAreaStyle,
  ...rest
}) => {
  const [radio, setRadio] = useState(false);

  const pressTrue = () => {
    radio && setRadio(!radio);
    form.setFieldValue(field.name, radio);
  };

  const pressFaild = () => {
    !radio && setRadio(!radio);
    form.setFieldValue(field.name, radio);
  }

  return (
    <View style={{flexDirection: 'row', borderColor: 'rgba(0, 0, 0, .05)', borderBottomWidth: 2, height: 91, paddingLeft: 28}}>
      <View style={[{justifyContent: 'center', alignItems: 'center', marginRight: 5}, labelAreaStyle]}>
        <Text style={{fontSize: 32}}>{title}: </Text>
      </View>
      <View style={styles.radioArea}>
        <TouchableOpacity style={[styles.radio, {marginRight: 20}]} onPress={pressTrue}>
          <CheckBox
            center
            size={40}
            checked={!radio}
            onPress={pressTrue}
            containerStyle={styles.checkBox_containerStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <Text style={{fontSize: 28}}>是</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radio} onPress={pressFaild}>
          <CheckBox
            center
            size={40}
            checked={radio}
            onPress={pressFaild}
            containerStyle={styles.checkBox_containerStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <Text style={{fontSize: 28}}>否</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  radioArea: {
    flex: 1,
    flexDirection: 'row', 
    backgroundColor: '#fff'
  },
  radio: {
    height: '100%', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  checkBox_containerStyle: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
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
  }
})

export default TwoRadio;