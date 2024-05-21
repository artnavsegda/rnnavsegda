//@flow
import React from 'react';
import {View, StyleSheet} from 'react-native';

import {Typography, Button} from '../index';

type Props = {
    title: string,
    style?: ?any,
    action?: string,
    children?: ?any,
    onPressAction?: () => any,
};

const Section = ({title, style, action, children, onPressAction}: Props) => (
    <View style={[styles.container, style]}>
        <View style={styles.header}>
            <Typography style={{width: '100%', marginBottom: 8}} variant="title" color="primary">
                {title}
            </Typography>
            {action ? (
                <Button variant="text" onPress={onPressAction}>
                    {action}
                </Button>
            ) : null}
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    header: {
        minHeight: 40,
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
});

export default Section;
