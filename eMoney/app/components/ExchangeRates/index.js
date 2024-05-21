//@flow
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as R from 'ramda';
import type {ExchangeRateResult} from '../../constants';
import Button from '../UIKit/Button';

import {Typography} from '../UIKit';

import currency from '../../currency';
import doing from '../../doing';
import i18n from '../../i18n';

export type Props = {
    visibleExtra?: boolean,
    separatorStyle?: any,
    children?: any,
    title?: any,
    style?: any,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'stretch',
        marginBottom: 18,
    },
    item: {
        flexDirection: 'column',
        alignSelf: 'stretch',
    },
    separator: {
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'stretch',
        borderRadius: 0.5,
        height: 0.75,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    title: {
        flex: 5,
    },
    value: {
        flex: 3,
    },
});

class ExchangeRates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialStateLoading: true,
            rates: [],
            visibleExtraRates: false,
        };
    }

    componentDidMount() {
        doing.api.exchangerates
            .getRequest()
            .success((array: ExchangeRateResult[]) => this.setState({rates: array, initialStateLoading: false}))
            .start();
    }

    onPressMoreExtraRates = () => {
        this.setState((prevState) => ({visibleExtraRates: !prevState.visibleExtraRates}));
    };

    renderRateRow = (rateData) => {
        return (
            <View key={`${rateData.currencyFrom}:${rateData.currencyTo}`}>
                <View style={styles.row}>
                    <Typography style={styles.title} variant="body1" fontWeight="500">
                        {i18n.t(`currencies.${rateData.currencyTo.toUpperCase()}`)}
                    </Typography>
                    <Typography style={styles.value} align="right" variant="body1">
                        {rateData.pay} {currency.symbol(rateData.currencyFrom)}
                    </Typography>
                    <Typography style={styles.value} align="right" variant="body1">
                        {rateData.sale} {currency.symbol(rateData.currencyFrom)}
                    </Typography>
                </View>
            </View>
        );
    };

    render() {
        const {rates, visibleExtraRates, initialStateLoading} = this.state;
        const {style, title, separatorStyle} = this.props;

        const basisRates = R.filter((rate) => R.propEq('basis', true, rate), rates);
        const extraRates = R.filter((rate) => R.propEq('basis', false, rate), rates);

        // loading state
        if (initialStateLoading) {
            return (
                <View style={[styles.container, style]}>
                    <View style={styles.title}>{title}</View>
                    <Typography
                        style={[styles.value, {marginTop: 12}]}
                        align="center"
                        color="secondary"
                        variant="body1">
                        {i18n.t('welcome.exchangeRatesLoading')}
                    </Typography>
                </View>
            );
        }

        // normal state
        return (
            <Animatable.View style={[styles.container, style]} duration={334} useNativeDriver animation="fadeIn">
                <View style={styles.row}>
                    <View style={styles.title}>{title}</View>
                    <Typography style={styles.value} align="right" color="secondary" variant="body1">
                        {i18n.t('exchangeRates.pay')}
                    </Typography>
                    <Typography style={styles.value} align="right" color="secondary" variant="body1">
                        {i18n.t('exchangeRates.sale')}
                    </Typography>
                </View>
                {basisRates.map((rate: ExchangeRateResult, index: number) => {
                    return rate.basis && this.renderRateRow(rate);
                })}
                {visibleExtraRates && extraRates.length > 0 && <View style={[styles.separator, separatorStyle]} />}
                {visibleExtraRates &&
                    extraRates.map((rate: ExchangeRateResult, index: number) => {
                        return !rate.basis && this.renderRateRow(rate);
                    })}
                {extraRates.length > 0 && (
                    <View style={{marginTop: 12}}>
                        <Button variant="link" onPress={() => this.onPressMoreExtraRates()}>
                            {visibleExtraRates
                                ? i18n.t('welcome.invisibleExtraRate')
                                : i18n.t('welcome.visibleExtraRate')}
                        </Button>
                    </View>
                )}
            </Animatable.View>
        );
    }
}

export default ExchangeRates;
