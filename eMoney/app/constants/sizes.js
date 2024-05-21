import _ from 'lodash';
import {Dimensions, Platform} from 'react-native';
import {getBottomSpace, getStatusBarHeight} from 'react-native-iphone-x-helper';

export const NAV_BAR_HEIGHT = 72;
export const BOTTOM_SPACE = getBottomSpace();
export const TAB_BAR_HEIGHT = Platform.select({ios: 48, android: 56, default: 56});
export const STATUS_BAR_HEIGHT = Math.max(24, getStatusBarHeight(true) || 24);
export const MODAL_NAV_BAR_TOP_PADDING = Platform.select({
    ios: parseInt(Platform.Version, 10) < 13,
    android: true,
})
    ? STATUS_BAR_HEIGHT
    : 0;

export const MIN_SCREEN_SIZE = Math.min(..._.values(_.pick(Dimensions.get('screen'), ['width', 'height'])));
export const MAX_MESSAGE_TEXT_WIDTH = (MIN_SCREEN_SIZE - 40) / 2 - 32;

export const getContainerTopPadding = (isModal: boolean) => (isModal ? MODAL_NAV_BAR_TOP_PADDING : STATUS_BAR_HEIGHT);
