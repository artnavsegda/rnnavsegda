// noinspection JSUnusedLocalSymbols
import Color from 'color';
import {NAV_BAR_HEIGHT} from '../../constants';
import {splashBackgroundColor} from '../../themes';

const isDarkBackground = Color(splashBackgroundColor).isDark();

export default {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: splashBackgroundColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 1024,
        aspectRatio: 1,
    },
    backgroundColor: splashBackgroundColor,
    logoColor: isDarkBackground ? '#fff' : '#252525',
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
    },
    statusBarStyle: isDarkBackground ? 'light' : 'dark',
};
