import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import {MSong} from '../../../models/song.model';
import { WithTranslation } from 'react-i18next';

export interface IProps extends WithTranslation {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  /**
   * @description Obtiene las canciones favoritas
   * @return void
   */
  getFavoriteSongs(): void;
  fileReducer: {
    data: {
      favorites: MSong[];
    };
    loadings: {
      loadingGetReproductions: boolean;
    };
    error: {
      errorGetReproductions: any;
    };
  };
}
