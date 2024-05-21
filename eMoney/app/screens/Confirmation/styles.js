// @flow
import {StyleSheet} from 'react-native';
import {fontStyles} from '../../components/UIKit/Typography/styles';
import {BOTTOM_SPACE, MIN_SCREEN_SIZE, NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT} from '../../constants';
import {elevationStyle} from '../../themes';

// noinspection JSUnusedLocalSymbols
export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: STATUS_BAR_HEIGHT,
        paddingBottom: BOTTOM_SPACE + 20,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    resultBlock: {
        padding: 20,
        marginTop: 38,
        minHeight: 44,
        borderRadius: 18,
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#fff',
        ...elevationStyle(12),
    },
    resultStatusContainer: {
        width: 76,
        height: 76,
        marginTop: -58,
        marginBottom: 8,
        borderRadius: 38,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    separator: {
        height: 1,
        borderRadius: 0.5,
        marginVertical: 8,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    resultStatus: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e9e9e9',
    },
    statusIcon: {
        width: '40%',
        height: '40%',
        tintColor: '#fff',
    },
    failStatusFill: {
        backgroundColor: '#e2432e',
    },
    successStatusFill: {
        backgroundColor: '#68d615',
    },
    form: {
        width: 240,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formBody: {
        width: 170,
    },
    title: {
        marginBottom: 8,
    },
    bottomBorder: {
        height: 2,
        borderRadius: 1,
        marginBottom: 2,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
    },
    timerText: {
        opacity: 0.6,
        marginTop: 12,
    },
    errorText: {
        marginTop: 12,
        marginBottom: 8,
    },
    inputBlock: {
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    input: {
        ...fontStyles.regular,
        fontSize: 18,
        color: '#fff',
        width: '100%',
        minHeight: 32,
        lineHeight: 24,
        textAlign: 'center',
    },
    indicator: {
        position: 'absolute',
        right: -26,
    },
    closeButtonWrapper: {
        position: 'absolute',
        left: 10,
        top: 1,
    },
    bottomCloseButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    closeButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    closeIcon: {
        width: 14,
        height: 14,
        tintColor: '#fff',
    },
    acceptedContainer: {
        marginTop: 12,
    },
});
