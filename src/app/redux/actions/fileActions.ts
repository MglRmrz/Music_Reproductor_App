import { PermissionsAndroid, PermissionStatus } from 'react-native';
import fileTypes from '../types/fileTypes';
import { Dispatch } from 'redux';
import { ISong } from '../../models/song.model';
import TrackPlayer, { Track } from 'react-native-track-player';
import MusicFiles from 'react-native-get-music-files';
import Database from '../../database';

/**
 * @description Obtiene las canciones del dispositivo
 */
export const getSongs = () => async (dispatch: Dispatch) => {
    dispatch({
        type: fileTypes.loadingGetSongs
    });

    try {
        const hasExternalReadPermissions: boolean = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        // Request Permissions
        if (!hasExternalReadPermissions) {
            const resp: PermissionStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permitir lectura',
                    message: 'Permitir que esta aplicación lea sus archivos',
                    buttonPositive: 'Permitir',
                    buttonNegative: 'Rechazar'
                }
            )

            if (resp === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Puedes leer archivos');
            }
        }

        const songs: ISong[] = await MusicFiles.getAll({
            id: true,
            blured : true,
            artist : true,
            duration : true,
            cover : true,
            genre : true,
            title : true,
            createBLur: true,
            minimumSongDuration : 10000 // get songs bigger than 10000 miliseconds duration
        });
        dispatch({
            type: fileTypes.getSongs,
            payload: songs
        });
        await Database.setSongs(songs);
        activateTrackPlayer(songs);
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description Comienza a reproducir una lista de canciones
 * @param songs Lista de reproducción que va a ser reproducida
 */
export const activateTrackPlayer = async (songs: ISong[]) => {
    try {
        const tracks: Track[] = songs.map(({id, author, title, path, album, genre, duration, cover}) => {
            return {
                id,
                artist: author ? author : '',
                title,
                url: path,
                album: album ? album : 'Unknown',
                genre,
                artwork: cover ? cover : require('../../../assets/images/music_notification.png'),
                duration: +duration,
                pitchAlgorithm: TrackPlayer.PITCH_ALGORITHM_MUSIC
            } as Track
        });

        // console.log(tracks[25]);
        // console.log(tracks[32]);

        TrackPlayer.add(tracks);
        await TrackPlayer.play();
    } catch (error) {
        console.log('Error activateTrackPlayer: ', error)
    }
}

/**
 * @description Obtiene la duración de una canción en formato mm:ss Ej: 4:13
 * @param durationInMilisecons Duración de la canción en milisegundos
 */
export const getDuration = (durationInMilisecons: number): string => {
    const date: Date = new Date(durationInMilisecons);
    return `${date.getMinutes()}:${date.getSeconds()}`;
}