import React, {useState, useRef, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { HIRE_DATA_BOX_TAG_LIST } from "../../../../../../utils/const";
import NormalDialog from '../../../../../../components/NormalDialog';
import FilterMore from "../../../../../../components/NormalDialog/FilterMore";

const Tag = ({
  lastButton = false,
  tagList = [],
  tagAreaStyle,
  CompanyList
}) => {
  const dialogRef = useRef(null);

  const [selectTag, setSelectTag] = useState('');
  const [dialogContent, setDialogContent] = useState({});

  useEffect(()=>{
    tagList.length && setSelectTag(tagList[0].value);
  },[])

  const chooseTag = (tag) => setSelectTag(tag.value);

  const filterMore = () => {
    console.log('你点击了筛选更多');
    dialogRef?.current.setShowDialog(true);
    setDialogContent({
      dialogTitle: '筛选更多',
      dialogComponent: <FilterMore CompanyList={CompanyList}/>
    })
  };

  return (
    <>
      <View style={[styles.tagsArea, tagAreaStyle]}>
        <View style={{flexDirection: 'row'}}>
          {tagList.map((tag, tagIndex) => {
            const isSelected = selectTag === tag.value;
            return (
              <TouchableOpacity key={tagIndex} style={[styles.tag, isSelected && styles.selectedTag]} onPress={() => chooseTag(tag)}>
                <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{tag.title}</Text>
              </TouchableOpacity>
          )})}
        </View>
        {lastButton && (
          <TouchableOpacity style={styles.lastButtonStyle} onPress={filterMore}>
            <Text style={styles.lastButtonText}>筛选更多</Text>
          </TouchableOpacity>
        )}
      </View>
      <NormalDialog 
        ref={dialogRef}
        dialogContent={dialogContent}
      />
    </>
  )
};

const styles = StyleSheet.create({
  tagsArea: {
    height: 70, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tag: {
    height: 40,
    paddingHorizontal: 10,
    marginRight: 30, 
    borderRadius: 5, 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#E5E5E5'
  },
  selectedTag: {
    backgroundColor: '#409EFF', 
    borderWidth: 0
  },
  tagText: {
    fontSize: 26, 
    textAlign: 'center', 
    color: '#999999'
  },
  selectedTagText: {
    color: '#fff'
  },
  lastButtonStyle: {
    height: 40, 
    width: 160, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#409EFF', 
    borderRadius: 5
  },
  lastButtonText: {
    fontSize: 26, 
    color: '#fff'
  }
});

export default Tag;