import musicTypes from '../types/musicTypes';

const INITIAL_STATE = {
  listSongs: [],
  listSongsCurrent: [],
  loadingListSongs: true,
  errorListSongs: null,
  searchSongs: [],

  current: {},
  mode: 'RANDOM',
  loading: false,
  error: null,

  loadingUpdateSong: false,
  loadingFavorite: false,

  loadingDeleteSong: false,
  errorDeleteSong: null,

  errorFavorite: null,

  refreshing: false
};

export default (state = INITIAL_STATE, {type, payload}: any) => {
  switch (type) {
    case musicTypes.updateListSongs:
      return {
        ...state,
        listSongs: payload,
        loadingListSongs: false,
        loadingUpdateSong: false,
        loadingDeleteSong: false,
        refreshing: false
      };
    case musicTypes.loadingListSongs:
      return {
        ...state,
        loadingListSongs: true,
      };
    case musicTypes.errorListSongs:
      return {
        ...state,
        loadingListSongs: false,
        errorListSongs: payload,
      };

    case musicTypes.loadingUpdateSong:
      return {
        ...state,
        loadingUpdateSong: true,
      };

    case musicTypes.loadingDeleteSong:
      return {
        ...state,
        loadingDeleteSong: true,
      };

    case musicTypes.errorDeleteSong:
      return {
        ...state,
        errorDeleteSong: payload,
        loadingDeleteSong: false,
      };

    case musicTypes.updateListSongsCurrent:
      return {
        ...state,
        listSongsCurrent: payload,
      };

    case musicTypes.updateCurrentMusic:
      return {
        ...state,
        current: payload,
        loading: false,
        loadingFavorite: false,
      };
    case musicTypes.loadingUpdateMusic:
      return {
        ...state,
        loading: true,
      };
    case musicTypes.errorUpdateMusic:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case musicTypes.updateMode:
      return {
        ...state,
        mode: payload,
      };

    case musicTypes.loadingFavorite:
      return {
        ...state,
        loadingFavorite: true,
      };
    case musicTypes.errorFavorite:
      return {
        ...state,
        errorFavorite: payload,
        loadingFavorite: false,
      };

    case musicTypes.getSearch:
      return {
        ...state,
        searchSongs: payload,
      };

    case musicTypes.clearSearch:
      return {
        ...state,
        searchSongs: [],
      };

    case musicTypes.loadingRefresh:
      return {
        ...state,
        refreshing: true
      }

    default:
      return state;
  }
};
