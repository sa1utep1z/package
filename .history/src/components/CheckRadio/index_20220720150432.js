import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox, Text, Icon } from "@rneui/themed";

const CheckRadio = ({
  checked,
  onClick,
  showAll= false
}) => {

  return (
    <TouchableOpacity style={styles.touchArea} onPress={onClick}>
      {showAll &&<Text style={[styles.showAll_Text, checked && styles.showAll_Text_selected]}>全选</Text>}
      <CheckBox
        center
        checked={checked}
        onPress={onClick}
        containerStyle={styles.checkBox_containerStyle}
        checkedIcon={
          <Icon
            size={20}
            name='dot-circle-o'
            type='font-awesome'
            color='#409EFF'
          />
        }
        uncheckedIcon={
          <Icon
            size={20}
            name='circle-o'
            type='font-awesome'
            color='#DDDDDD'
        />}
      />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  touchArea: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  showAll_Text: {
    fontSize: 13, 
    color: '#999999'
  },
  showAll_Text_selected: {
    color: '#000'
  },
  checkBox_containerStyle: {
    width: 20, 
    height: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 0, 
    margin: 0, 
    backgroundColor: 'rgba(0,0,0,0)'
  }
})

export default CheckRadio;