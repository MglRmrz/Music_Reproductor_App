import React, { FC, useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from  'react-native';
import { IProps } from './PropsInterface';
import { staticStyles, dynamicStyleSheet } from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AutoScrolling from 'react-native-auto-scrolling';
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dark-mode';
import { theme } from '../../../assets/themes';

export const ListOfDirs: FC<IProps> = ({navigation, songs = [], onChangeList}) => {
    const [dirs, setDirs] = useState<IDir[]>([]);
    const isDarkMode = useDarkMode();
    const dynamicStyles = useDynamicStyleSheet(dynamicStyleSheet);

    useEffect(() => {
        const songsPath: string[] = songs.map(song => song.path);
        const allDirs: IDir[] = [];
        songsPath.forEach((path, i) => {
            const pathArray: string[] = path.split('/');
            const index: number = pathArray.length - 2;
            const found = allDirs.find(dir => {
                if (dir.name.toLowerCase() === pathArray[index].toLowerCase()) {
                    return true;
                }
            });
            if (!found) {
                let newPath: string = '';
                for (let i = 0; i < pathArray.length-1; i++) {
                    newPath += pathArray[i]+'/';
                }
                allDirs.push({name: pathArray[index].toLowerCase(), path: newPath.toLowerCase(), id: i.toString()});
            }
        });
        setDirs(allDirs);
    }, [songs])

    const _renderItem = ({item}: {item: IDir}) => {

        return(
            <View style={staticStyles.containerCard}>
                <TouchableOpacity style={{width: '90%'}}>
                    <View style={[staticStyles.card, dynamicStyles.borderColor]}>
                        <FontAwesome 
                            name="folder-open-o" 
                            size={50} 
                            color={isDarkMode ? theme().light : theme().text} 
                        />
                    </View>
                    {
                        item.name.length > 18 ? 
                        <AutoScrolling>
                            <Text style={[staticStyles.dirName, dynamicStyles.colorText]}>
                                {item.name}
                            </Text>
                        </AutoScrolling> :
                        <Text style={[staticStyles.dirName, dynamicStyles.colorText]}>
                            {item.name}
                        </Text>
                    }
                    {
                        item.path.length > 20 ? 
                        <AutoScrolling>
                            <Text style={[staticStyles.pathText, dynamicStyles.colorText]}>
                                {item.path}
                            </Text>
                        </AutoScrolling> :
                        <Text style={[staticStyles.pathText, dynamicStyles.colorText]}>
                            {item.path}
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <View style={{marginHorizontal: 10}}>
            <View style={[staticStyles.options, dynamicStyles.borderColor]}>
                <TouchableOpacity 
                    style={[staticStyles.iconOptions, dynamicStyles.backgroundIconOption]} 
                    onPress={() => onChangeList('SONGS')}
                >
                    <Entypo 
                        name="list" 
                        color={isDarkMode ? theme().light : theme().text}
                        size={20} 
                    />
                </TouchableOpacity>
            </View>

            <FlatList 
                data={dirs}
                renderItem={_renderItem}
                numColumns={2}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

interface IDir {
    name: string,
    path: string,
    id: string
}