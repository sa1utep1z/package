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
  radioItemsStyle,
  labelStyle,
  showLabel = true,
  ...rest
}) => {

  const radioOnPress = (radio) => {
    form.setFieldValue(field.name, [radio]);
  };

  return (
    <View style={!form.errors[field.name] && styles.selectArea}>
      <View style={styles.container}>
        {showLabel ? <Text style={[styles.labelText, labelStyle]}>{label}：</Text> : <></>}
        <View style={{flex: 1}}>
          <View style={[{flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 6}, form.errors[field.name] && styles.errorBorder, radioItemsStyle]}>
            {radioList.map((radio, radioIndex) => {
              return (
                <TouchableOpacity key={radioIndex} style={{maxWidth: `${(1/radioList.length) * 100}%`, minHeight: 60,  flexDirection: 'row', alignItems: 'center', padding: 5}} onPress={() => radioOnPress(radio)}>
                  <CheckBox
                    center
                    size={30}
                    pointerEvents={'none'}
                    checked={!!field?.value?.length ? field.value[0].value === radio.value : false}
                    containerStyle={{padding: 0}}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <Text style={[{fontSize: 26, color: '#333333', paddingRight: 10}, !field?.value?.length && styles.itemText_none]}>{radio.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {!!form.errors[field.name] && 
            <ErrorMessage
              name={field.name}
              style={styles.errorMessage}
              component={Text}
          />}
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  selectArea: {
    marginBottom: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  labelText: {
    height: 60,
    textAlignVertical: 'center',
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
    fontSize: 22,
    marginBottom: 10
  },
  errorBorder: {
    borderColor: 'red'
  },
  errorBorder_radio: {
    borderColor: 'red'
  }
})

export default RadioSelect;