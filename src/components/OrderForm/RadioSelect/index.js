import React, {useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ErrorMessage} from 'formik';
import { CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**单选*/
const RadioSelect = ({
  field, 
  form, 
  label,
  radioList = [],
  ...rest
}) => {

  const radioOnPress = (radio) => {
    form.setFieldValue(field.name, [radio]);
  };

  return (
    <View style={!form.errors[field.name] && styles.selectArea}>
      <View style={styles.container}>
        <Text style={styles.labelText}>{label}：</Text>
        <View style={[{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6}, form.errors[field.name] && styles.errorBorder]}>
          {radioList.map((radio, radioIndex) => {
            const isLastIndex = radioIndex === radioList.length - 1;
            return (
              <View key={radio.value} style={[{flex: 1, borderRightWidth: 1, borderColor: '#E5E5E5'}, isLastIndex && {borderRightWidth: 0}, form.errors[field.name] && styles.errorBorder_radio]}>
                <TouchableOpacity style={{flex: 1, minHeight: 60,  flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={() => radioOnPress(radio)}>
                  <CheckBox
                    center
                    size={30}
                    pointerEvents={'none'}
                    checked={!!field?.value?.length ? field.value[0].value === radio.value : false}
                    containerStyle={{padding: 0}}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <View style={{flex: 1}}>
                    <Text style={[{fontSize: 26, color: '#333333'}, !field.value.length && styles.itemText_none]}>{radio.label}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </View>
      {!!form.errors[field.name] && <View style={{flexDirection: 'row'}}>
        <Text style={[styles.labelText, {opacity: 0}]}>{label}：</Text>
        <ErrorMessage
          name={field.name}
          style={styles.errorMessage}
          component={Text}
        />
      </View>}
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  labelText: {
    minWidth: 150,
    fontSize: 28,
    color: '#333333'
  },
  itemText: {
    fontSize: 26,
    color: '#333333'
  },
  itemText_none: {
    fontSize: 26,
    color: '#999999'
  },
  errorMessage: {
    color: 'red',
    fontSize: 22
  },
  errorBorder: {
    borderColor: 'red'
  },
  errorBorder_radio: {
    borderColor: 'red'
  }
})

export default RadioSelect;