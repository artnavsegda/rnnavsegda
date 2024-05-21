// @flow
import _ from 'lodash';
import {connect} from 'react-redux';
import {Animated} from 'react-native';
import type {ReduxState} from '../reducers';
import data, {type ThemeData} from './data';
import React, {memo, useEffect, useRef, useState} from 'react';

// noinspection JSUnusedGlobalSymbols
export const splashBackgroundColor = '#004A99';

export type Theme = ThemeData & {
    [key: string]: any,
};

export type ThemeProviderProps = {
    withOutAnimation?: boolean,
    children: any,
    theme: Theme,
};

export const ThemeContext: React$Context<Theme> = React.createContext(data.light);
export const ThemeConsumer = ThemeContext.Consumer;

export function themeByName(name: string): Theme {
    return name in data ? data[name] : data.light;
}

export function themedRender(Component: any, props: any, getStyles?: (theme: Theme, props: any) => any) {
    if (props.theme) {
        return <Component {...(props || {})} styles={getStyles ? getStyles(props.theme, props) : undefined} />;
    }
    return (
        <ThemeConsumer>
            {(theme) => (
                <Component {...(props || {})} styles={getStyles ? getStyles(theme, props) : undefined} theme={theme} />
            )}
        </ThemeConsumer>
    );
}

export function withTheme(Component: any, getStyles?: (theme: Theme) => any): any {
    return memo((props: any) => themedRender(Component, props, getStyles));
}

// noinspection JSUnusedGlobalSymbols
export function validThemeName(name: string, def: any = null): any {
    if (name && data && name in data) {
        return name;
    }
    return def;
}

// Only for screens
export const ThemeProvider = connect((state: ReduxState, ownerProps: any) => ({
    theme: (ownerProps.theme ? ownerProps.theme : themeByName(state.theme.name)) || data.light,
}))(({theme: inputTheme, withOutAnimation, ...props}: any & ThemeProviderProps) => {
    const opacityRef = useRef(new Animated.Value(1.0)),
        [theme, setTheme] = useState(inputTheme);

    useEffect(() => {
        if (theme === inputTheme) {
            return;
        }
        if (withOutAnimation) {
            return setTheme(inputTheme);
        }
        Animated.timing(opacityRef.current, {
            toValue: 0,
            duration: 134,
            useNativeDriver: true,
        }).start(() => {
            setTheme(inputTheme);
            Animated.timing(opacityRef.current, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputTheme]);

    return (
        <ThemeContext.Provider value={theme}>
            <Animated.View style={{flex: 1, opacity: opacityRef.current}}>{props.children}</Animated.View>
        </ThemeContext.Provider>
    );
});

export function statusBarStyleGetter(theme: Theme, inverted: boolean = false) {
    return inverted ? theme.type : theme.type === 'dark' ? 'light' : 'dark';
}

export function elevationStyle(value?: any, color?: string): any {
    if (_.isUndefined(value) || (value || 0) === 0 || color === 'transparent') {
        return {};
    }
    if (_.isNumber(value)) {
        const elevation: number = Math.abs(value || 0);
        return {
            shadowOpacity: 0.0015 * elevation + 0.18,
            shadowRadius: 0.54 * elevation,
            shadowColor: color || '#000',
            shadowOffset: {
                width: 0,
                height: 0.6 * (value || 0),
            },
            elevation,
        };
    }
    if (value instanceof Animated.Value) {
        return {
            shadowOpacity: Animated.add(Animated.multiply(value, 0.0015), 0.18),
            shadowRadius: Animated.multiply(value, 0.54),
            shadowColor: color || '#000',
            shadowOffset: {
                width: 0,
                height: Animated.multiply(value, 0.6),
            },
            elevation: value,
        };
    }
    return {};
}
