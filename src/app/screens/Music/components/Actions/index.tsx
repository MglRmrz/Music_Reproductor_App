import React, {useEffect, useState, FC} from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDynamicStyleSheet} from 'react-native-dark-mode';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';

import dynamicStyles from './style';
import {
  changeToLineMode,
  changeToRandomMode,
} from '../../../../redux/actions/musicActions';
import {updateFavorite} from '../../../../redux/actions/allSongsActions';
import {ShowToast} from '../../../../../utils/toast';
import {ModalLetter} from '../ModalLetter';

const Actions: FC<any> = (props: any) => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const [mode, setMode] = useState('RANDOM');
  const {t} = useTranslation('ActionsMusic');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMode();
  }, []);

  /* useEffect(() => {
    if (props.musicReducer.errorFavorite) {
      ShowToast(t('errorAddFavorite'));
    }
  }, [props.musicReducer]); */

  const getMode = async () => {
    const data = await AsyncStorage.getItem('@Mode');
    setMode(data || 'RANDOM');
  };

  const changeMode = async () => {
    if (mode === 'RANDOM') {
      await AsyncStorage.setItem('@Mode', 'LINE');

      props.changeToLineMode();

      setMode('LINE');
    } else {
      await AsyncStorage.setItem('@Mode', 'RANDOM');

      props.changeToRandomMode();

      setMode('RANDOM');
    }
  };

  const updateFavoriteSong = async () => {
    const {current} = props.musicReducer;
    props.updateFavorite(current, true).then(() => {
      ShowToast(
        !current.isFavorite ? t('addedFavorite') : t('removedFavorite'),
      );
    });
  };

  const getStateFavorite = () => {
    if (props.musicReducer.current.isFavorite) {
      return (
        <AntDesign name="star" size={20} color={styles.iconActive.color} />
      );
    } else {
      return <AntDesign name="staro" size={20} color={styles.icon.color} />;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={changeMode}>
        {mode === 'RANDOM' && (
          <FontAwesome name="random" size={20} color={styles.icon.color} />
        )}
        {mode === 'LINE' && (
          <Entypo name="retweet" size={20} color={styles.icon.color} />
        )}
      </TouchableOpacity>
      {!props.musicReducer.loadingFavorite && (
        <TouchableOpacity onPress={updateFavoriteSong}>
          {getStateFavorite()}
        </TouchableOpacity>
      )}
      {props.musicReducer.loadingFavorite && (
        <View>
          <ActivityIndicator size="small" color="#00F1DF" />
        </View>
      )}
      <TouchableOpacity onPress={props.onShare}>
        <AntDesign name="sharealt" size={20} color={styles.icon.color} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setOpen(true)}>
        <MaterialIcons name="queue-music" size={20} color={styles.icon.color} />
      </TouchableOpacity>

      <ModalLetter
        isOpen={open}
        onClose={(data: boolean) => {
          setOpen(data);
        }}
        text={props.musicReducer.current.lyrics}
      />
    </View>
  );
};

const mapStateToProps = ({musicReducer}: any) => {
  return {
    musicReducer,
  };
};

const mapDispatchToProps = {
  changeToLineMode,
  changeToRandomMode,
  updateFavorite,
};

// eslint-disable-next-line prettier/prettier
export default connect<any, any>(mapStateToProps, mapDispatchToProps)(Actions);
