import {connect} from 'react-redux';
import {themedRender} from '../../themes';
import {Button, Typography} from '../UIKit';
import type {ReduxState} from '../../reducers';
import React, {useState, useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {ScrollView, TouchableWithoutFeedback, Animated, View} from 'react-native';
import {MIN_SCREEN_SIZE, BOTTOM_SPACE, STATUS_BAR_HEIGHT, emptyArray, type Account} from '../../constants';

import currency from '../../currency';

import getStyles, {ACCOUNT_BUTTON_HEIGHT} from './styles';

export type Props = {
    onChooseAccount?: (account: Account) => any,
    onPressClose?: () => any,
    account?: Account,
    formStyle?: any,
    visible: boolean,
};

type InnerProps = Props & {
    accounts: Account[],
    styles: any,
};

const ChooseAccountPopupLayer = ({styles, visible, accounts, formStyle, onPressClose, onChooseAccount}: InnerProps) => {
    const [hidden, setHidden] = useState(!visible);
    useEffect(() => {
        if (hidden && visible) {
            setHidden(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    if (!visible && hidden) {
        return null;
    }
    return (
        <TouchableWithoutFeedback disable={!visible} onPress={onPressClose}>
            <Animatable.View
                duration={334}
                useNativeDriver
                style={styles.layout}
                animation={visible ? 'fadeIn' : 'fadeOut'}
                onAnimationEnd={() => !visible && !hidden && setHidden(true)}>
                <TouchableWithoutFeedback>
                    <Animated.View style={[styles.form, formStyle]}>
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            style={{
                                borderRadius: 16,
                                overflow: 'hidden',
                                height: accounts.length * ACCOUNT_BUTTON_HEIGHT + 2,
                                maxHeight: MIN_SCREEN_SIZE - BOTTOM_SPACE - STATUS_BAR_HEIGHT - ACCOUNT_BUTTON_HEIGHT,
                            }}>
                            {accounts.map((account: Account, index: number, array: any[]) => (
                                <Button
                                    variant="action"
                                    key={account.number}
                                    style={styles.button}
                                    onPress={() => onChooseAccount(account)}>
                                    <View style={{flex: 1}}>
                                        <Typography variant="display1" fontSize={28}>
                                            {currency(account.balance, account.currency).format(true)}
                                        </Typography>
                                        <Typography variant="body1" fontSize={10}>
                                            {account.number}
                                        </Typography>
                                    </View>
                                    {index < array.length - 1 ? <View style={styles.separtor} /> : null}
                                </Button>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Animatable.View>
        </TouchableWithoutFeedback>
    );
};

// noinspection JSUnusedLocalSymbols
const RTHChooseAccountPopupLayer = connect((state: ReduxState, props: Props) => {
    const accounts = (state.client.info || {}).accounts || emptyArray;
    const sortNumber = (props.account || {}).number;
    return {
        accounts:
            accounts.length > 1 && sortNumber
                ? accounts.sort((a: Account, b: Account) => {
                      if (a.number === sortNumber) {
                          return b.number === sortNumber ? 0 : -1;
                      }
                      return b.number === sortNumber ? 1 : 0;
                  })
                : accounts,
    };
})((props: Props) => themedRender(ChooseAccountPopupLayer, props, getStyles));

RTHChooseAccountPopupLayer.accountButtonHeight = ACCOUNT_BUTTON_HEIGHT;

export default RTHChooseAccountPopupLayer;
