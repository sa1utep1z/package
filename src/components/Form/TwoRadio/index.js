import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, CheckBox} from '@rneui/themed';
import { WebView } from 'react-native-webview';

const TwoRadio = ({field, form, ...rest}) => {
  const [radio, setRadio] = useState(false);

  const pressTrue = () => {
    radio && setRadio(!radio);
    form.setFieldValue('tip', radio);
  };

  const pressFaild = () => {
    !radio && setRadio(!radio);
    form.setFieldValue(field.name, radio);
  }

  return (
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
        <Text>是</Text>
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
        <Text>否</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  radioArea: {
    height: 48, 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 8
  },
  radio: {
    width: 60, 
    height: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  checkBox_containerStyle: {
    height: 20,
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