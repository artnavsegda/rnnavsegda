// @flow
import Color from 'color';
import React from 'react';
import {View} from 'react-native';
import {Defs, G, LinearGradient, RadialGradient, Rect, Stop, Svg, Use} from 'react-native-svg';

const DefaultOverlay = ({style, color}: any) => (
    <View style={[style, {overflow: 'hidden'}]} shouldRasterizeIOS renderToHardwareTextureAndroid>
        <Svg width="100%" height="100%">
            <Defs>
                <RadialGradient
                    id="a"
                    cx="117.0757%"
                    cy="-10.851815%"
                    gradientTransform="matrix(-.56543776 .48473502 -.31336422 -.87466106 1.798742 -.770941)"
                    r="183.843584%">
                    <Stop
                        offset="0"
                        stopColor={Color(color)
                            .darken(0.4)
                            .toString()}
                    />
                    <Stop
                        offset="1"
                        stopColor={Color(color)
                            .lighten(0.2)
                            .toString()}
                    />
                </RadialGradient>
                <LinearGradient id="b" x1="50%" x2="55.885824%" y1="50%" y2="52.594864%">
                    <Stop
                        offset="0"
                        stopColor={Color(color)
                            .darken(0.4)
                            .toString()}
                    />
                    <Stop
                        offset="1"
                        stopColor={Color(color)
                            .lighten(0.2)
                            .toString()}
                    />
                </LinearGradient>
                <LinearGradient id="c" x1="52.409871%" x2="54.869588%" y1="46.720545%" y2="49.015242%">
                    <Stop offset="0" stopColor={color} />
                    <Stop
                        offset="1"
                        stopColor={Color(color)
                            .darken(0.2)
                            .toString()}
                        stopCpacity={0.5}
                    />
                </LinearGradient>
                <Rect id="d" width="100%" height="100%" />
            </Defs>
            <G fill="none" fillRule="evenodd">
                <Use fill="url(#a)" xlinkHref="#d" />
                <G fillOpacity={0.4}>
                    <Use fill="url(#b)" xlinkHref="#d" />
                    <Use fill="url(#c)" xlinkHref="#d" />
                </G>
            </G>
        </Svg>
    </View>
);

export default DefaultOverlay;
