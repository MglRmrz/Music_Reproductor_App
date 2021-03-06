import React, {FC, useState, useEffect, Fragment} from 'react';
import {View, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDynamicStyleSheet, eventEmitter} from 'react-native-dark-mode';
import Feather from 'react-native-vector-icons/Feather';
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import { useTranslation } from 'react-i18next';

import dynamicStyles from './styles';

export const DarkMode: FC<any> = () => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const [mode, setMode] = useState(false);
  const { t } = useTranslation('DarkMode');

  const getDarkMode = async () => {
    try {
      const data = (await AsyncStorage.getItem('DarkMode')) || 'dark';
      setMode(data === 'dark' ? true : false);
    } catch (err) {
      console.log('a error ucurred');
    }
  };

  const updateDarkMode = async (newMode: boolean) => {
    try {
      eventEmitter.emit('currentModeChanged', newMode ? 'dark' : 'light');
      setMode(newMode);
    } catch (err) {
      console.log('a error ucurred');
    }
  };

  useEffect(() => {
    getDarkMode();
  }, []);

  return (
    <Fragment>
      <View style={styles.container}>
        <Feather name="moon" color={styles.text.color} size={20} />
        <Text style={styles.text}>{t('mode')}</Text>
        <SwitchToggle switchOn={mode} onPress={() => updateDarkMode(!mode)} />
      </View>
    </Fragment>
  );
};
