import {ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {DynamicViewStyle, DynamicTextStyle} from 'react-native-dark-mode';

export interface StylesFooter {
  container: ViewStyle | DynamicViewStyle;
  image: ImageStyle;
  info: ViewStyle;
  music: ViewStyle;
  title: TextStyle | DynamicTextStyle;
  group: TextStyle | DynamicTextStyle;
  options: ViewStyle;
  icon: TextStyle | DynamicTextStyle;
  scroll: ViewStyle;
}
