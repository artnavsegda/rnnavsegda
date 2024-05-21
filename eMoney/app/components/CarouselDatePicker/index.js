// @flow
import React from 'react';
import Moment from 'moment';
import Carousel from '../Carousel';
import type {Theme} from '../../themes';
import {themedRender} from '../../themes';
import {Button, Typography} from '../UIKit';
import * as Animatable from 'react-native-animatable';
import {Animated, View, Platform} from 'react-native';

import i18n from '../../i18n';

import getStyles from './styles';

// Для пустого года нужно использовать только високосный год!!!
const EMPTY_YEAR = 1904;
const DELAY_ANIMATION = Platform.select({ios: 334, android: 400});

export type DateObject = {
    day: number,
    month: number,
    year: ?number,
};

export type Props = {
    style?: any,
    width: number,
    date?: DateObject | any,
    showAnimation?: string,
    onChangeDate?: (date: DateObject | any) => any,
};

type InternalProps = Props & {
    theme: Theme,
    styles: any,
};

function buildYears(): number[] {
    const minYear: number = Math.max(EMPTY_YEAR, new Date().getFullYear() - 100);
    const maxYear: number = new Date().getFullYear();
    return [
        ...Array.from(Array(maxYear - minYear).keys()).map((index: number) => (minYear || 0) + index + 1),
        EMPTY_YEAR,
    ];
}

function buildMonths(): number[] {
    return Array.from(Array(12).keys()).map((index: number) => index + 1);
}

function buildDays(): number[] {
    return Array.from(Array(31).keys()).map((index: number) => index + 1);
}

function validateDateObject(date: DateObject): boolean {
    return Moment([date.year || EMPTY_YEAR, date.month - 1, date.day])
        .utc(true)
        .isValid();
}

function rebuildDateObject(date: DateObject, callback: ?(date: DateObject) => void): boolean {
    const isValid = validateDateObject(date);
    const nextDate: DateObject = isValid
        ? date
        : {
              ...date,
              day: Moment([date.year || EMPTY_YEAR, date.month - 1])
                  .utc(true)
                  .daysInMonth(),
          };
    if (callback) {
        isValid ? callback(nextDate) : setTimeout(() => callback(nextDate), DELAY_ANIMATION);
    }
    return isValid;
}

function dateObjectToNumber(date: ?DateObject): number {
    if (!date) {
        return 0;
    }
    return Moment([date.year || EMPTY_YEAR, date.month - 1, date.day])
        .utc(true)
        .valueOf();
}

function dateObjectFromNumber(value: number): ?DateObject {
    if (!value) {
        return null;
    }
    const date = Moment(value);
    return {
        day: date.date(),
        month: date.month() + 1,
        year: date.year() <= EMPTY_YEAR ? null : date.year(),
    };
}

class CarouselDatePickerComponent extends React.PureComponent<InternalProps> {
    monthsAnimated = new Animated.Value(0);
    yearsAnimated = new Animated.Value(0);
    daysAnimated = new Animated.Value(0);
    months = [];
    years = [];
    days = [];

    constructor(...props) {
        super(...props);
        this.days = buildDays();
        this.years = buildYears();
        this.months = buildMonths();
    }

    onSnapToYearItem = (index: number) => {
        rebuildDateObject(
            {
                day: (this.props.date || {}).day || Moment().date(),
                month: (this.props.date || {}).month || Moment().month() + 1,
                year: this.years[index] === EMPTY_YEAR ? null : this.years[index],
            },
            this.props.onChangeDate,
        );
    };

    onSnapToMonthItem = (index: number) => {
        rebuildDateObject(
            {
                month: this.months[index],
                year: (this.props.date || {}).year || null,
                day: (this.props.date || {}).day || Moment().date(),
            },
            this.props.onChangeDate,
        );
    };

    onSnapToDayItem = (index: number) => {
        rebuildDateObject(
            {
                day: this.days[index],
                year: (this.props.date || {}).year || null,
                month: (this.props.date || {}).month || Moment().month() + 1,
            },
            this.props.onChangeDate,
        );
    };

    renderYearItem = (data: any, index: number, pos: number) => (
        <Button
            variant="text"
            alignContent="center"
            style={{paddingHorizontal: 0, alignItems: 'center'}}
            onPress={() => this.onSnapToYearItem(index)}>
            <Typography
                align="center"
                fontSize={16}
                numberOfLines={1}
                variant="subheading"
                color={this.yearsAnimated.interpolate({
                    inputRange: [pos - 1, pos, pos + 1],
                    outputRange: [
                        this.props.theme.colors.primaryText,
                        this.props.theme.colors.buttonText,
                        this.props.theme.colors.primaryText,
                    ],
                })}
                as={Animated.Text}>
                {data === EMPTY_YEAR ? '----' : `${data}`}
            </Typography>
        </Button>
    );

    renderMonthItem = (data: any, index: number, pos: number) => (
        <Button
            variant="text"
            alignContent="center"
            style={{paddingHorizontal: 0, alignItems: 'center'}}
            onPress={() => this.onSnapToMonthItem(index)}>
            <Typography
                align="center"
                fontSize={16}
                numberOfLines={1}
                variant="subheading"
                color={this.monthsAnimated.interpolate({
                    inputRange: [pos - 1, pos, pos + 1],
                    outputRange: [
                        this.props.theme.colors.primaryText,
                        this.props.theme.colors.buttonText,
                        this.props.theme.colors.primaryText,
                    ],
                })}
                as={Animated.Text}>
                {i18n.t(`calendar.month${data}`)}
            </Typography>
        </Button>
    );

    renderDayItem = (data: any, index: number, pos: number) => (
        <Button
            variant="text"
            alignContent="center"
            style={{paddingHorizontal: 0, alignItems: 'center'}}
            onPress={() => this.onSnapToDayItem(index)}>
            <Typography
                align="center"
                fontSize={16}
                numberOfLines={1}
                variant="subheading"
                color={this.daysAnimated.interpolate({
                    inputRange: [pos - 1, pos, pos + 1],
                    outputRange: [
                        this.props.theme.colors.primaryText,
                        this.props.theme.colors.buttonText,
                        this.props.theme.colors.primaryText,
                    ],
                })}
                as={Animated.Text}>
                {`${data}`}
            </Typography>
        </Button>
    );

    render() {
        const {style, width, date, styles, showAnimation} = this.props;
        return (
            <Animatable.View
                duration={334}
                useNativeDriver
                delay={DELAY_ANIMATION}
                animation={showAnimation}
                style={[style, {flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width}]}>
                <View style={[styles.selectBlock, {width: 90}]} />
                <Carousel
                    space={4}
                    width={width}
                    itemWidth={72}
                    itemHeight={32}
                    data={this.years}
                    inactiveScale={0.96}
                    velocityScale={0.334}
                    activeItemWidth={90}
                    inactiveOpacity={0.7}
                    renderItem={this.renderYearItem}
                    onChangeIndex={this.onSnapToYearItem}
                    outAnimatedSelectionIndex={this.yearsAnimated}
                    index={this.years.indexOf((date || {}).year || EMPTY_YEAR)}
                />
                <View style={[styles.separatorBlock, {width: width - 32}]}>
                    <View style={styles.separator} />
                    <View style={styles.centerSeparator} />
                    <View style={styles.separator} />
                </View>
                <Carousel
                    loop
                    space={4}
                    width={width}
                    itemWidth={84}
                    itemHeight={32}
                    data={this.months}
                    activeItemWidth={90}
                    inactiveScale={0.96}
                    velocityScale={0.334}
                    inactiveOpacity={0.7}
                    style={{paddingVertical: 3}}
                    renderItem={this.renderMonthItem}
                    index={((date || {}).month || 1) - 1}
                    onChangeIndex={this.onSnapToMonthItem}
                    outAnimatedSelectionIndex={this.monthsAnimated}
                />
                <View style={[styles.separatorBlock, {width: width - 32}]}>
                    <View style={styles.separator} />
                    <View style={styles.centerSeparator} />
                    <View style={styles.separator} />
                </View>
                <Carousel
                    loop
                    space={4}
                    width={width}
                    itemWidth={48}
                    itemHeight={32}
                    data={this.days}
                    inactiveScale={0.96}
                    velocityScale={0.334}
                    activeItemWidth={90}
                    inactiveOpacity={0.8}
                    renderItem={this.renderDayItem}
                    index={((date || {}).day || 1) - 1}
                    onChangeIndex={this.onSnapToDayItem}
                    outAnimatedSelectionIndex={this.daysAnimated}
                />
            </Animatable.View>
        );
    }
}

// Wrapped themed component
const CarouselDatePicker = (props: Props) => themedRender(CarouselDatePickerComponent, props, getStyles);

CarouselDatePicker.emptyYear = EMPTY_YEAR;
CarouselDatePicker.dateObjectToNumber = dateObjectToNumber;
CarouselDatePicker.dateObjectFromNumber = dateObjectFromNumber;

export default CarouselDatePicker;
