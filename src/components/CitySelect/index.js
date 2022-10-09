import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Text, Dialog, CheckBox } from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useToast } from "react-native-toast-notifications";
import { ErrorMessage } from 'formik';
import SearchInput from '../SearchInput';
import EmptyArea from '../EmptyArea';
import { deepCopy, checkedType } from '../../utils';
import { CityData } from '../../assets/City';
import { color } from '@rneui/base';

const CitySelect = ({
    field,
    form,
    canSearch,
    bottomButton,
    selectList,
    showLittleTitle, //这是名单模块中顶部筛选栏的label样式开关
    formalLabel = true, //一般表单label默认显示，除非有意关掉
    lastButton, //selectItem一行是否添加元素
    title,
    singleSelect = false, //单选
    placeholder,
    noBorder,
    labelAreaStyle,
    selectContainerStyle,
    selectAreaStyle,
    selectAreaTextStyle,
    autoSubmit = false,
    inPageField = false, // 由于跟顶部筛选栏及表单内部公用一个选择项，所以在这里配置一个“是否在页面中表单”的配置项用来控制他们不同位置的外观表现；
    otherPressFunc,
    ...rest
}) => {
    const toast = useToast();
    const [list, setList] = useState([]);
    const [showSelectItems, setShowSelectItems] = useState(false);
    const [selectedItemList, setSelectedItemList] = useState([]);
    const [index, setIndex] = useState(0);
    const [province, setProvince] = useState([]); // 省
    const [city, setCity] = useState([]); // 市
    const [area, setArea] = useState([]); // 区
    const [tabTitle, setTabTitle] = useState(['请选择']); // 选中的
    const [proTabTitle, setProTabTitle] = useState(''); // 省名
    const [cityTabTitle, setCityTabTitle] = useState(''); // 市名
    const [areaTabTitle, setAreaTabTitle] = useState(''); // 区名

    const selectIndex = (i) => {
        setIndex(i);
        if (i === 0) {
            setList(province);
        } else if (i === 1) {
            setList(city);
        } else {
            setList(area);
        }
    };

    const FlattListItem = ({ item, pressItem, checkedItem, isLastIndex }) => {
        return useMemo(() => (
            // return (
            <>
                <TouchableOpacity
                    style={[styles.scrollItem, isLastIndex && { borderBottomWidth: 0 }]}
                    onPress={() => pressItem(item)}>
                    <Text style={{ color: (!!checkedItem || item.name === cityTabTitle || item === areaTabTitle) ? '#409EFE' : '#333' }}>{item.name || item}</Text>
                    <AntDesign
                        name='right'
                        color='#999'
                        size={16}
                    />
                </TouchableOpacity>
            </>
        ))

    };
    
    useMemo(() => {
        //单选？设置为filed表单内数组第一个元素；
        if (field.value && field.value.length && singleSelect) {
            selectList.map(item => item.isChecked = item.name === field.value[0].name);
            setList(selectList);
            return;
        }
        //默认多选，那就需要根据表单传的id回来找并且打勾；
        const fieldValueList = field.value ? field.value.map(item => item.value) : '';
        selectList.map(item => item.isChecked = fieldValueList.includes(item.value));
        setList(selectList);
    }, [showSelectItems])

    const pressItem = (item) => {
        // 单选
        if (singleSelect) {
            const newList = [item];
            let arry = []
            setSelectedItemList(newList);
            const newArr = deepCopy(list);
            if (index === 0) {
                newArr.map(data => {
                    if (data.name === item.name) {
                        data.isChecked = true;
                        if (tabTitle.length < 2) {
                            arry = tabTitle.splice(0, 1, data.name, '请选择');
                        } else {
                            arry = tabTitle.splice(0, 1, data.name);
                        }
                        setProTabTitle(item.name);
                    } else {
                        data.isChecked = false
                    }
                    if (!!data.isChecked && data.city.length) {
                        setIndex(1)
                        setList(data.city);
                        setCity(data.city);
                    }
                });
                // setList(newArr);
                setProvince(newArr);
            } else if (index === 1) {
                newArr.map(data => {
                    if (data.name === item.name) {
                        data.isChecked = true;
                        if (tabTitle.length < 3) {
                            arry = tabTitle.splice(1, 1, data.name, '请选择');
                        } else {
                            arry = tabTitle.splice(1, 1, data.name);
                        }
                        setCityTabTitle(item.name);
                    } else {
                        data.isChecked = false
                    }
                    if (!!data.isChecked && data.districtAndCounty.length) {
                        setIndex(2)
                        setList(data.districtAndCounty);
                        setArea(data.districtAndCounty);
                    }
                });
            } else {
                arry = tabTitle.splice(2, 1, item);
                setAreaTabTitle(item);
            }
            return;
        }
    };

    const itemName = () => {
        const type = checkedType(field.value);
        switch (type) {
            case 'Array':
                return field.value.length && field.value.length !== 0 && field.value.map(item => item.title).join('、');
            case 'String':
                return field.value;
        }
    };

    const checkFieldValueType = () => {
        const type = checkedType(itemName());
        switch (type) {
            case 'String':
                return false;
            case 'Undefined':
                return true;
            case 'Object':
                return true;
            default:
                return true;
        }
    };

    // 重置
    const clear = () => {
        setIndex(0);
        setTabTitle(['请选择'])
        setProvince([]);
        setCity([]);
        setArea([]);
        setProTabTitle('');
        setCityTabTitle('');
        setAreaTabTitle('');
    }

    const confirm = () => {
        if ((proTabTitle && cityTabTitle && areaTabTitle) !== '请选择') {
            form.setFieldValue(field.name, proTabTitle + '/' + cityTabTitle + '/' + areaTabTitle);
            form.setFieldValue('province', proTabTitle);
            form.setFieldValue('city', cityTabTitle);
            form.setFieldValue('area', areaTabTitle);
            //是否自动提交表单
            if (autoSubmit) {
                form.handleSubmit();
            }
            setShowSelectItems(!showSelectItems);
            clear();
        }
    };

    const cancelClose = () => {
        setShowSelectItems(!showSelectItems);
        clear();
    }

    const clearSelected = () => {
        // setSelectedItemList([]);
        const newArr = deepCopy(list);
        if (newArr.find(item => item.isChecked)) {
            newArr.map(item => item.isChecked = false);
        } else {
            newArr.map(item => item.isChecked = true);
        }
        setList(newArr);
        form.setFieldValue(field.name, []);
    };

    const clearFieldValue = () => {
        form.setFieldValue(field.name, []);
        if (autoSubmit) {
            form.handleSubmit();
        }
    };

    const touchItem = () => setShowSelectItems(!showSelectItems);

    return (
        <>
            <View style={[styles.selectItemArea, inPageField && styles.pageFieldStyle, selectContainerStyle]}>
                {showLittleTitle &&
                    <Text style={styles.showLittleTitleText}>{title}：</Text>
                }
                {formalLabel &&
                    <View style={[styles.labelArea, labelAreaStyle]}>
                        {rest.isRequired && <Text style={styles.required}>*</Text>}
                        <Text style={styles.label}>{title}：</Text>
                    </View>
                }
                <View style={styles.rightArea}>
                    <TouchableOpacity
                        style={[styles.selectArea, !inPageField && { paddingLeft: 20 }, !showLittleTitle && styles.selectArea_noLittle, noBorder && styles.noBorder, selectAreaStyle]}
                        onPress={touchItem}>
                        <Text
                            style={[styles.selectText, checkFieldValueType() && styles.noItem, selectAreaTextStyle]}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {itemName() || placeholder || `请选择${title}`}
                        </Text>
                        {checkedType(field.value) === 'String' && !field.value &&
                            <AntDesign
                                name={showSelectItems ? 'up' : 'down'}
                                size={30}
                                style={{ paddingHorizontal: 10 }}
                                color={checkFieldValueType() ? 'black' : '#E3E3E3'}
                            />}
                    </TouchableOpacity>
                    {checkedType(field.value) === 'String' && !!field.value.length &&
                        <TouchableOpacity onPress={clearFieldValue} style={{ height: '100%', paddingHorizontal: 10, justifyContent: 'center' }}>
                            <AntDesign
                                name='closecircle'
                                size={30}
                                color='#999999'
                            />
                        </TouchableOpacity>}
                </View>
                {lastButton}
            </View>
            <ErrorMessage
                name={field.name}
                component={Text}
                style={{ color: 'red', fontSize: 22, textAlign: 'center' }}
            />

            <Dialog
                isVisible={showSelectItems}
                overlayStyle={styles.overlayStyle}
                onBackdropPress={() => setShowSelectItems(!showSelectItems)}>
                <View style={styles.dialogTitleArea}>
                    <Text style={styles.dialogTitle}>请选择{title}</Text>
                </View>
                <View style={styles.header}>
                    {
                        tabTitle.map((tabItem, tabIndex) => {
                            const active = index === tabIndex;
                            return (
                                <TouchableOpacity key={tabIndex} style={[styles.tabItem]} onPress={() => selectIndex(tabIndex)}>
                                    <Text style={[styles.tabItem_text, active && styles.tabItem_titleStyle_active]}>{tabItem}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
                    {list.length ?
                        <FlatList
                            data={list}
                            style={[styles.scrollArea, canSearch && styles.canSearchWithScrollView]}
                            // ListHeaderComponent={tabHead()}
                            renderItem={({ item, index }) => {
                                const checkedItem = item.isChecked;
                                const isLastIndex = index === list.length - 1;
                                return <FlattListItem item={item} pressItem={pressItem} checkedItem={checkedItem} isLastIndex={isLastIndex} />
                            }}
                            keyboardShouldPersistTaps="handled"
                            keyExtractor={item => item.name}
                            getItemLayout={(data, index) => ({ length: 35, offset: 35 * index, index })}
                            initialNumToRender={15}
                        // stickyHeaderIndices={[0]}
                        /> : <EmptyArea withSearch />
                    }
                </View>
                {bottomButton && <View style={styles.bottomButtonArea}>
                    <TouchableOpacity style={styles.bottomLeft} onPress={cancelClose}>
                        <Text style={styles.leftText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomRight} onPress={() => confirm()}>
                        <Text style={styles.rightText}>确认</Text>
                    </TouchableOpacity>
                </View>}
            </Dialog>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        // paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderColor: 'rgba(0, 0, 0, .05)',
        backgroundColor: '#fff',
        borderRadius: 6
    },
    tabItem: {
        flex: 1,
        // justifyContent: 'center'
    },
    tabItem_text: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
    },
    tabItem_titleStyle_active: {
        color: '#409EFF',
        fontWeight: 'bold',
    },
    selectItemArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 60
    },
    pageFieldStyle: {
        paddingHorizontal: 28,
        height: 91,
        borderBottomWidth: 2,
        borderColor: 'rgba(0, 0, 0, .05)'
    },
    showLittleTitleText: {
        fontSize: 28,
        color: '#000',
        fontWeight: 'bold'
    },
    rightArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    selectArea: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    selectArea_noLittle: {
        paddingRight: 10
    },
    noBorder: {
        borderBottomWidth: 0
    },
    selectText: {
        flex: 1,
        color: 'black',
        fontSize: 28,
    },
    noItem: {
        color: '#999999'
    },
    overlayStyle: {
        padding: 0,
        paddingTop: 20,
        borderRadius: 6
    },
    dialogTitleArea: {
        marginBottom: 10
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    selectAll: {
        position: 'absolute',
        right: 20
    },
    selectAll_text: {
        color: '#409EFF'
    },
    searchInputStyle: {
        height: 35,
        marginBottom: 0,
        paddingHorizontal: 0,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomWidth: 0
    },
    scrollArea: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        maxHeight: 300,
        borderRadius: 8
    },
    scrollItem: {
        minHeight: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#E3E3E3'
    },
    checkBox_containerStyle: {
        height: 20,
        margin: 0,
        padding: 0,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        marginRight: 5,
        borderWidth: 1
    },
    checkBox_icon: {
        fontFamily: "iconfont",
        color: '#409EFF',
        fontSize: 20
    },
    falseColor: {
        color: '#DDDDDD'
    },
    canSearchWithScrollView: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    },
    bottomButtonArea: {
        flexDirection: 'row',
        height: 45
    },
    bottomLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 6,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E3E3E3'
    },
    leftText: {
        fontSize: 16,
        color: '#999999'
    },
    bottomRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 6,
        borderTopWidth: 1,
        borderColor: '#E3E3E3'
    },
    rightText: {
        fontSize: 16,
        color: '#409EFF'
    },
    labelArea: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    label: {
        textAlign: 'center',
        fontSize: 32
    },
    required: {
        color: 'red',
        textAlign: 'center',
        textAlignVertical: 'top',
        alignSelf: 'flex-start',
        marginTop: 25,
        fontSize: 25
    },
})

export default CitySelect;