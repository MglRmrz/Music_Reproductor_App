import React, {FC, useState, useEffect} from 'react';
import {useDynamicStyleSheet} from 'react-native-dark-mode';
import {Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { takePictureFromGallery } from '../../../../../utils/takePicture';
import fs from 'react-native-fs';
import { useTranslation } from 'react-i18next';

import dynamicStyles from './styles';

export const UpdateImage: FC<{
  cover: string;
  onChange(image: string): void;
}> = ({cover, onChange}: any) => {
  const styles = useDynamicStyleSheet(dynamicStyles);
  const [image, setImage] = useState('');
  const [pickerImage, setPickerImage] = useState<{uri: string, name: string} | null>(
    null,
  );
  const { t } = useTranslation('UpdateSong')

  useEffect(() => {
    return () => {
      if (pickerImage) {
        fs.moveFile(
          pickerImage.uri,
          `${fs.DocumentDirectoryPath}/temp/updateCover/${pickerImage.name}`,
        );
      }
    };
  }, [pickerImage]);

  /**
   * @description Abre el DocimentPicker
   */
  const openDocumentPiecker = async () => {
    try {
      const picker = await takePictureFromGallery();

      const existsDir = await fs.exists(
        `${fs.DocumentDirectoryPath}/temp/updateCover`,
      );
      const existsFile = await fs.exists(
        `${fs.DocumentDirectoryPath}/temp/updateCover/${picker.name}`,
      );

      if (!existsDir) {
        await fs.mkdir(`${fs.DocumentDirectoryPath}/temp/updateCover`);
      }

      if (!existsFile) {
        await fs.moveFile(
          picker.uri,
          `${fs.DocumentDirectoryPath}/temp/updateCover/${picker.name}`,
        );
      }

      const file = await fs.stat(
        `${fs.DocumentDirectoryPath}/temp/updateCover/${picker.name}`,
      );

      setImage(file.path);
      setPickerImage(picker);
      onChange(picker.uri);
    } catch (error) {
      if (error === 'canceled') {
        console.log('Picker canceled!');
        return;
      }

      console.error('Picker image Error: ', error);
    }
  };

  const showImage = (imagePath: string) => {
    if (imagePath) {
      return (
        <Image source={{uri: 'file://' + imagePath}} style={styles.image} />
      );
    } else {
      return (
        <Image
          source={require('../../../../../assets/images/music_notification.png')}
          style={styles.image}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('cover')}
      </Text>

      <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        <TouchableOpacity onPress={openDocumentPiecker}>
          {!image ? (
            showImage(cover)
          ) : (
            <Image source={{uri: 'file://' + image}} style={styles.image} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
