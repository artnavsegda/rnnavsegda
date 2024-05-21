// @flow
import React from 'react';
import {emptyObject} from '../../../constants/defaults';
import {View, Animated, Platform, Keyboard} from 'react-native';

export type Props = {
    [key: string]: any,
    keyboardVerticalOffset?: ?number,
    style?: ?any,
};

export default class KeyboardAvoidingContainer extends React.PureComponent<Props> {
    _height: Animated.Value = new Animated.Value(0);
    _keyboardVisible: boolean = false;
    _heightAnimation: any = null;
    _subscriptions: any[] = [];

    componentDidMount(): void {
        if (Platform.OS === 'android') {
            return;
        }
        // noinspection JSUnresolvedFunction
        this._subscriptions = [
            Keyboard.addListener('keyboardDidShow', this.keyboardDidShow),
            Keyboard.addListener('keyboardWillHide', this.keyboardWillHide),
            Keyboard.addListener('keyboardWillShow', this.keyboardWillShow),
        ];
    }

    componentWillUnmount(): void {
        this._subscriptions.forEach(s => s.remove());
    }

    keyboardDidShow = (event: any) => {
        if (this._heightAnimation !== null) {
            this._heightAnimation.stop();
        }
        this._heightAnimation = null;
        // noinspection JSUnresolvedFunction
        this._height.setValue(event.endCoordinates.height);
    };

    keyboardWillShow = (event: any) => {
        if (this._heightAnimation !== null) {
            this._heightAnimation.stop();
        }
        this._keyboardVisible = true;
        this._heightAnimation = Animated.timing(this._height, {
            toValue: event.endCoordinates.height,
            duration: event.duration || 10,
            useNativeDriver: false,
        });
        this._heightAnimation.start();
    };

    keyboardWillHide = (event: any) => {
        if (this._heightAnimation !== null) {
            this._heightAnimation.stop();
        }
        this._keyboardVisible = false;
        this._heightAnimation = Animated.timing(this._height, {
            duration: event.duration || 10,
            useNativeDriver: false,
            toValue: 0,
        });
        this._heightAnimation.start();
    };

    render(): any {
        const {style, keyboardVerticalOffset, ...rest} = this.props;
        if (Platform === 'android') {
            return <View {...rest || emptyObject} style={style} />;
        }
        return (
            <Animated.View
                {...rest || emptyObject}
                style={[
                    style,
                    {
                        paddingBottom: Animated.subtract(this._height, keyboardVerticalOffset || 0),
                    },
                ]}
            />
        );
    }
}
