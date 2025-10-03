import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../Constants/colors';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const CustomDropdown = ({ dropdownPosition,items, value, onChange, dropDownKey,placeholder, multiple = true, style = {} }) => {
    const [isFocus, setIsFocus] = useState(false);
    const [searchData, setSearchData] = useState('');
    const [dropData, setDropData] = useState(items); // State for dropdown items


    useEffect(() => {
        setDropData(items);
    }, [items]);

    const handleAddOption = () => {
        console.log('asasasasasasaasasasas',searchData)
        if (searchData.trim() !== '' && !dropData.some(item => item.label.toLowerCase() === searchData.toLowerCase())) {
            const newItem = { label: searchData, value: searchData };
            setDropData([...items, newItem]);
            setSearchData('');
            if (multiple) {
                onChange([...value, searchData]); // Multi-select: add new option
            } else {
                onChange(newItem.value); // Single-select: set new value
            }
        }
    };

    return (
        <View>
            {multiple ? (
                <MultiSelect
                key={dropDownKey}
                dropdownPosition={dropdownPosition ? dropdownPosition : 'bottom'}
                    visibleSelectedItem={false}
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }, style]}
                    placeholderStyle={styles.placeholderStyle}
                    activeColor='#E60E81'
                    data={[
                        ...dropData,
                        ...(searchData.trim() &&
                        !dropData.some(item => item.label.toLowerCase() === searchData.toLowerCase())
                            ? [{ label: `+ Add "${searchData}"`, value: 'add_new' }]
                            : []),
                    ]}
                    search
                    
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={placeholder}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => {
                        setIsFocus(true)
                       
                    }}
                    onBlur={() => setIsFocus(false)}
                    itemContainerStyle={{ backgroundColor: '#262629',elevation: 5, }}
                    itemTextStyle={{ color: 'white' }}
                    onChange={selectedItems => {
                        if (selectedItems.includes('add_new')) {
                            handleAddOption();
                        } else {
                            onChange(selectedItems);
                        }
                    }}
                    onChangeText={setSearchData}
                />
            ) : (
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    dropdownPosition={dropdownPosition ? dropdownPosition : 'bottom'}
                    data={[
                        ...dropData,
                        ...(searchData.trim() &&
                        !dropData.some(item => item.label.toLowerCase() === searchData.toLowerCase())
                            ? [{ label: `+ Add "${searchData}"`, value: 'add_new' }]
                            : []),
                    ]}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={placeholder}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    itemContainerStyle={{ backgroundColor: '#262629',elevation: 10, }}
                    itemTextStyle={{ color: 'white' }}
                    activeColor='#E60E81'
                    onChange={selectedItem => {
                        if (selectedItem.value === 'add_new') {
                            handleAddOption();
                        } else {
                            onChange(selectedItem.value);
                        }
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'white',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'white',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default CustomDropdown;