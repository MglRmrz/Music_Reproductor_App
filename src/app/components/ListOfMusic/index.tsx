import React, {FC, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useDynamicStyleSheet} from 'react-native-dark-mode';
import {useActionSheet} from '@expo/react-native-action-sheet';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import dynamicStyles from './styles';
import {MSong} from 'src/app/models/song.model';
import Ripple from 'react-native-material-ripple';
import {IProps} from './Interfaces/Props';
import {ShowToast} from '../../../utils/toast';
import AsyncStorage from '@react-native-community/async-storage';

export const ListOfMusic: FC<IProps> = ({
  songs,
  navigate,
  updateFavorite,
  paddingBottom = 0,
}: any) => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const {showActionSheetWithOptions} = useActionSheet();

  useEffect(() => {
    //order();
    //console.log(songs);
  }, [songs]);

  const order = (array: MSong[]) => {
    var newArray = array;
    newArray.sort(function(a: MSong, b: MSong) {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      return 0;
    });

    return newArray;
  };

  // abre la ventana de opciones
  const openOptions = (item: MSong) => {
    showActionSheetWithOptions(
      {
        title: item.title,
        options: [
          item.isFavorite ? 'Eliminar de favoritos' : 'Agregar a Favoritos',
          'Agregar a lista de reproduccion',
          'Editar informacion',
          'Compartir',
          'Eliminar',
          'Cancel',
        ],
        destructiveButtonIndex: 5,
        containerStyle: styles.actions,
        textStyle: styles.actionsText,
        titleTextStyle: styles.actionsText,
        showSeparators: true,
        separatorStyle: {backgroundColor: '#646464'},
      },
      async (index: number) => {
        switch (index) {
          case 0:
            await updateFavorite(item);
            ShowToast(
              !item.isFavorite
                ? 'Se agrego a favoritos'
                : 'Se elimino de favoritos',
            );
            break;
          case 2:
            navigate('UpdateSong', {item, songs});
            break;

          default:
            break;
        }
      },
    );
  };

  const openActionOrder = () => {
    showActionSheetWithOptions(
      {
        title: 'Modificar orden',
        options: ['Alfavetico', 'Duraciòn', 'Artista'],
        containerStyle: styles.actions,
        textStyle: styles.actionsText,
        titleTextStyle: styles.actionsText,
      },
      async (index: number) => {
        switch (index) {
          case 0:
            //order();
            break;
          case 2:
            break;

          default:
            break;
        }
      },
    );
  };

  const cutText = (txt: string): string => {
    if (txt.length > 35) {
      return txt.substring(0, 35) + '...';
    }

    return txt;
  };

  const getRandomMusic = async (max: number, min: number) => {
    const position = Math.floor(Math.random() * (max - min) + min);

    await AsyncStorage.setItem('@Mode', 'RANDOM');

    navigate('Music', {item: songs[position], songs});
  };

  if (songs.length === 0) {
    return (
      <Text
        style={[
          styles.textRandom,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 20,
          },
        ]}>
        No se encontraron canciones
      </Text>
    );
  }

  return (
    <View style={[styles.container, {paddingBottom}]}>
      <View style={styles.options}>
        <TouchableOpacity
          onPress={() => {
            getRandomMusic(songs.length - 1, 0);
          }}
          style={styles.random}>
          <FontAwesome name="random" size={15} color={styles.icon.color} />
          <Text style={styles.textRandom}>Reproduccion aleatoria</Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={styles.iconOptions}
            onPress={openActionOrder}>
            <MaterialIcons
              name="swap-calls"
              size={20}
              color={styles.iconOptions.color}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          backgroundColor: '#CECECE',
          height: 1,
          marginHorizontal: 10,
        }}
      />

      <ScrollView>
        {order(songs).map((item: MSong, key: number) => (
          <View key={key} style={styles.containerItem}>
            <Ripple
              rippleColor={styles.title.color}
              style={styles.containerItem}
              onPress={() => navigate('Music', {item, songs})}>
              <View style={styles.item}>
                {item.cover ? (
                  <Image
                    style={styles.image}
                    source={{
                      uri: 'file://' + item.cover,
                    }}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={require('../../../assets/images/music_notification.png')}
                  />
                )}

                <View style={styles.info}>
                  <Text style={styles.title}>{cutText(item.title)}</Text>
                  <Text style={styles.group}>{item.author}</Text>
                </View>
              </View>
            </Ripple>
            <TouchableOpacity
              onPress={() => {
                openOptions(item);
              }}
              style={styles.icon}>
              <SimpleLineIcons
                name="options-vertical"
                color={styles.title.color}
                size={15}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
