import { Dimensions, Platform } from 'react-native';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const widthHeightSum = screenHeight + screenWidth;

const fh = Math.round(screenHeight * 0.0584);

export const fieldHeight = fh > 45 ? fh : 45;

export const headerHeight = fieldHeight * 1.4;


//------------------------------------------------
// get app bar height
//------------------------------------------------
const getAppBarHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    // @ts-ignore
    if (isLandscape && !Platform.isPad) {
      return 32;
    }
    return 44;
  } if (Platform.OS === 'android') {
    return 56;
  }
  return 64;
};

//------------------------------------------------
// get status bar height
//------------------------------------------------
const getStatusBarHeight = () => {
  const d = Dimensions.get('window');
  const { height, width } = d;

  // this is iPhoneXS Max format
  if (Platform.OS === 'ios' && (height === 896 || width === 896)) {
    return 44;
  }
  // this is iPhoneX format
  if (Platform.OS === 'ios' && (height === 812 || width === 812)) {
    return 44;
  }
  if (Platform.OS === 'ios') {
    return 20;
  }
  return 0;
};

//------------------------------------------------
// get navigation bar height
//------------------------------------------------
const getNavigationBarHeight = () => {
  const d = Dimensions.get('window');
  const { height, width } = d;

  // this is iPhoneXS Max format
  if (Platform.OS === 'ios' && (height === 896 || width === 896)) {
    return 44;
  }
  // this is iPhoneX format
  if (Platform.OS === 'ios' && (height === 812 || width === 812)) {
    return 44;
  }
  if (Platform.OS === 'ios') {
    return 64;
  }
  return 54;
};

const backUnit = widthHeightSum * 0.004;

export const backspaces = {
  unit: backUnit,
  extraSmall: backUnit, // 5
  small: backUnit * 2, // 10
  middle: backUnit * 3, // 15
  large: backUnit * 4, // 20
  extraLarge: backUnit * 5, // 25
};
const fontUnit = widthHeightSum * 0.0015;

export const fontSize = {
  unit: fontUnit, // 2
  extraSmall: fontUnit * 8, // 12
  small: fontUnit * 9, // 14
  middle: fontUnit * 10, // 16
  large: fontUnit * 11, // 18
  extraLarge: fontUnit * 12, // 20,
  title: fontUnit * 15,
  total: fontUnit * 22,
};

function isIPhoneXSize(dim: any) {
  return dim.height === 812 || dim.width === 812;
}

function isIPhoneXrSize(dim: any) {
  return dim.height === 896 || dim.width === 896;
}

export const isIphoneX = () => {
  const dim = Dimensions.get('window');

  return (
    // This has to be iOS
    Platform.OS === 'ios'
    // Check either, iPhone X or XR
    && (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
};

// metrics styles
export const metrics = {
  searchBarHeight: 30,
  screenWidth: screenWidth < screenHeight ? screenWidth : screenHeight,
  screenHeight: screenWidth < screenHeight ? screenHeight : screenWidth,
  appBarHeight: getAppBarHeight(false),
  statusBarHeight: getStatusBarHeight(),
  borderRadius: 4,
};
