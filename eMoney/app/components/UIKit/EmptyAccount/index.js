import React from 'react';
import {View} from 'react-native';
import Button from '../Button';
import Typography from '../Typography';
import i18n from '../../../i18n';

import Styles from './styles';

const EmptyAccountScreen = ({...props}) => {
    const {onPressLogIn} = props;
    return (
        <View testID="cards-tab" style={Styles.container}>
            <View style={Styles.emptyInfoBlock}>
                <Typography variant="title" paragraph>
                    {i18n.t('cards.emptyTitle')}
                </Typography>
                <Typography variant="body1" paragraph={24}>
                    {i18n.t('cards.emptyText')}
                </Typography>
                <Button variant="contained" alignContent="center" onPress={onPressLogIn && onPressLogIn}>
                    {i18n.t('cards.logInButton')}
                </Button>
            </View>
        </View>
    );
};

export default EmptyAccountScreen;
