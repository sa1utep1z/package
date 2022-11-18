import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, CheckBox } from '@rneui/themed';

const HeaderRadioItem = ({
  field,
  form,
  label,
  radioList,
  otherLabelStyle,
  rightComponent,
}) => {

  const radioOnPress = (radio) => {
    form.setFieldValue(field.name, [radio]);
    form.submitForm();
  };

  return (
    <View style={styles.radioArea}>
      <Text style={[styles.radioTitle, otherLabelStyle]}>{label}：</Text>
      <View style={styles.radioControlArea}>
        {radioList.map((radio, radioIndex) => (
          <TouchableOpacity key={radioIndex} style={styles.radioItem} onPress={() => radioOnPress(radio)}>
            <CheckBox
              center
              size={32}
              pointerEvents={'none'}
              checked={field.value[0].value === radio.value}
              containerStyle={styles.checkBox}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
            <Text style={styles.radioItemText}>{radio.label}</Text>
          </TouchableOpacity>
        ))}
        {rightComponent}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  radioArea: {
    flex: 1,
    flexDirection: 'row'
  },
  radioTitle: {
    fontSize: 28, 
    color: '#000000', 
    alignSelf: 'center'
  },
  radioControlArea: {
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
    paddingLeft: 10
  },
  radioItem: {
    flexDirection: 'row', 
    marginRight: 20
  },
  checkBox: {
    padding: 0, 
    alignSelf: 'center', 
    marginRight: 5
  },
  radioItemText: {
    fontSize: 26, 
    color: '#999999', 
    textAlignVertical: 'center'
  }
})

export default HeaderRadioItem;