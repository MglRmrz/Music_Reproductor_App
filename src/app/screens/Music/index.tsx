import React, {Component} from 'react';
import {Text, Image, View} from 'react-native';
import {connect} from 'react-redux';
import {destroy, getQueue} from 'react-native-track-player';
import AsyncStorage from '@react-native-community/async-storage';

import {IProps} from './interfaces/Props';
import {IState} from './interfaces/State';
import {BackgroundLayout} from '../../components/BackgroundLayout';
import {
  updateCurrentMusic,
  updateCurrentMusicForId,
  playInLine,
  playInRandom,
  changeToLineMode,
  changeToRandomMode,
  updateListSongsCurrent,
} from '../../redux/actions/musicActions';
import style from './style';
import {Progress} from './components/Progress';
import {isPlay} from '../../../utils/isPlay';
import share from '../../../utils/share';
import {HeaderMusic} from './components/HeaderMusic';

class Music extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  async componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
      musicReducer,
    } = this.props;
    // @ts-ignore
    const item = params.item;

    // guarda la ultima cancion reproducida
    AsyncStorage.setItem('@LastMusic', JSON.stringify(item));

    this.props.updateCurrentMusic(item);

    if (isPlay(musicReducer.current, item) && (await getQueue()).length > 0) {
      return;
    }
    const mode = (await AsyncStorage.getItem('@Mode')) || 'RANDOM';

    destroy();

    // @ts-ignore
    const songs = params.songs;
    await this.props.updateListSongsCurrent(songs);

    if (mode === 'RANDOM') {
      this.props.playInRandom(true);
    } else {
      this.props.playInLine(true);
    }
  }

  _onShare = async () => {
    share(this.props.musicReducer.current);
  };

  render() {
    const {
      musicReducer,
      navigation: {
        state: {params},
      },
    }: any = this.props;

    const item =
      Object.keys(musicReducer.current).length === 0
        ? params.item
        : musicReducer.current;

    return (
      <BackgroundLayout>
        <HeaderMusic item={item} navigation={this.props.navigation} />

        <View style={style.contentImage}>
          {item.cover ? (
            <Image
              style={style.image}
              source={{
                uri: 'file://' + item.cover,
              }}
            />
          ) : (
            <Image
              style={[style.image, {backgroundColor: '#838383'}]}
              source={require('../../../assets/images/music_notification.png')}
            />
          )}
          <Text style={style.author}>{item.author}</Text>
          <Text style={style.album}>{item.album}</Text>
        </View>

        <Progress
          duration={item.duration}
          changeToLineMode={this.props.changeToLineMode}
          changeToRandomMode={this.props.changeToRandomMode}
          musicReducer={musicReducer}
          onShare={this._onShare}
        />
      </BackgroundLayout>
    );
  }
}

const mapStateToProps = ({fileReducer, musicReducer}: any) => {
  return {
    musicReducer,
    fileReducer,
  };
};

const mapDispatchToProps = {
  playInLine,
  updateCurrentMusic,
  updateCurrentMusicForId,
  playInRandom,
  changeToLineMode,
  changeToRandomMode,
  updateListSongsCurrent,
};

// eslint-disable-next-line prettier/prettier
export default connect<any, any>(mapStateToProps, mapDispatchToProps)(Music);
