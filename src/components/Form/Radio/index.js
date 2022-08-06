import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from '@rneui/themed';
import { WebView } from 'react-native-webview';

const Radio = ({
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
    <View style={{flexDirection: 'row', paddingHorizontal: 10, borderColor: '#E3E3E3', borderBottomWidth: 1}}>
      <View style={[{width: 80, justifyContent: 'center', alignItems: 'center', marginRight: 5}, labelAreaStyle]}>
        <Text>{title}</Text>
      </View>
      <View style={styles.radioArea}>
        <TouchableOpacity style={styles.radio} onPress={pressTrue}>
          <CheckBox
            center
            checked={!radio}
            onPress={pressTrue}
            containerStyle={styles.checkBox_containerStyle}
            checkedIcon={<Text style={[styles.checkBox_icon, radio && styles.falseColor]}>{'\ue669'}</Text>}
            uncheckedIcon={<Text style={[styles.checkBox_icon, radio && styles.falseColor]}>{'\ue68d'}</Text>}
          />
          <Text>门店集合</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.radio} onPress={pressFaild}>
          <CheckBox
            center
            checked={radio}
            onPress={pressFaild}
            containerStyle={styles.checkBox_containerStyle}
            checkedIcon={<Text style={[styles.checkBox_icon, !radio && styles.falseColor]}>{'\ue669'}</Text>}
            uncheckedIcon={<Text style={[styles.checkBox_icon, !radio && styles.falseColor]}>{'\ue68d'}</Text>}
          />
          <Text>自行到厂</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  radioArea: {
    height: 48, 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    flex: 1
  },
  radio: {
    width: 120, 
    height: '100%', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  checkBox_containerStyle: {
    height: 20,
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    marginRight: 5,
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

export default Radio;