//@flow
import Color from 'color';

export type GradientType = 'radial' | 'linear';

export type Gradient = {
    background: string,
    type: GradientType,
    colors: string[],
    locations?: number[],
    end?: {x: number | string, y: number | string},
    start?: {x: number | string, y: number | string},
    center?: {x: number | string, y: number | string},
    focal?: {x: number | string, y: number | string, r?: number | string},
    radius?: {x: number | string, y: number | string} | number | string,
};

export type ThemeData = {
    keyboardAppearance: 'default' | 'light' | 'dark', // For iOS keyboard
    type: 'light' | 'dark',
    colors: {
        errorText: string,
        primaryText: string,
        warningText: string,
        successText: string,
        secondaryText: string,
        secondaryButton: string,
        navigationBorder: string,
        primaryBackground: string,
        secondaryBackground: string,
        buttonText: string,
        button: string,
        link: string,
        bonusesInHistory: string,
        translations: string,
        notifications: string,
        payments: string,
        bonuses: string,
        history: string,
        primaryIcons: {
            fill: string,
            init: string,
            spoon: string,
        },
        secondaryIcons: {
            fill: string,
            init: string,
            spoon: string,
        },
    },
    opacity: {
        normal: number,
        spoon: number,
        extra: number,
    },
    gradients: {
        mainCard: Gradient,
        bonusCard: Gradient,
    },
};

export type ThemesData = {
    light: ThemeData,
    dark: ThemeData,
};

const data: ThemesData = {
    light: {
        keyboardAppearance: 'light',
        type: 'light',
        colors: {
            primaryText: '#252525',
            secondaryText: Color('#252525').alpha(0.5).toString(),
            primaryBackground: '#EDEEF2',
            navigationBorder: '#252525',
            secondaryBackground: '#FFF',
            secondaryButton: '#393AAA',
            warningText: '#ff8010',
            successText: '#04b55b',
            errorText: '#ca1e16',
            buttonText: '#FFF',
            button: '#004A99',
            link: '#0060C7',
            bonusesInHistory: '#7CCC69',
            translations: '#2DC376',
            notifications: '#FA675F',
            payments: '#393AAA',
            bonuses: '#FF983D',
            history: '#6EA5BA',
            primaryIcons: {
                fill: '#8C8DFF',
                init: '#8C8DFF',
                spoon: Color('#4A4CDE').alpha(0.3).toString(),
            },
            secondaryIcons: {
                fill: '#2DC376',
                init: '#2DC376',
                spoon: Color('#2DC376').alpha(0.2).toString(),
            },
        },
        opacity: {
            normal: 1.0,
            spoon: 0.2,
            extra: 0.5,
        },
        gradients: {
            mainCard: {
                type: 'radial',
                locations: [0, 0.96],
                radius: {x: '117%', y: '78%'},
                colors: ['#393AAA', ' #0D356C'],
                background: 'rgba(57,58,170,0.40)',
            },
            bonusCard: {
                type: 'radial',
                locations: [0, 1],
                radius: {x: '23%', y: '45%'},
                colors: ['#F7B04D', ' #9E6B05'],
                background: 'rgba(255,152,61,0.40)',
            },
        },
    },
    dark: {
        keyboardAppearance: 'dark',
        type: 'dark',
        colors: {
            primaryText: Color('#FFF').alpha(0.86).toString(),
            secondaryText: Color('#FFF').alpha(0.5).toString(),
            secondaryBackground: '#252525',
            primaryBackground: '#1B1C1C',
            secondaryButton: '#393AAA',
            navigationBorder: '#000',
            warningText: '#ff8010',
            successText: '#04b55b',
            errorText: '#ca1e16',
            buttonText: '#FFF',
            button: '#0060C7',
            link: '#3094FF',
            bonusesInHistory: '#2DC376',
            translations: '#26A664',
            notifications: '#DE4B43',
            payments: '#393AAA',
            bonuses: '#DE8435',
            history: '#578394',
            primaryIcons: {
                fill: '#4646BB',
                init: '#5959ED',
                spoon: Color('#4A4CDE').alpha(0.3).toString(),
            },
            secondaryIcons: {
                fill: '#088645',
                init: Color('#2DC376').alpha(0.8).toString(),
                spoon: Color('#2DC376').alpha(0.2).toString(),
            },
        },
        opacity: {
            normal: 1.0,
            spoon: 0.2,
            extra: 0.5,
        },
        gradients: {
            mainCard: {
                type: 'radial',
                locations: [0, 0.96],
                radius: {x: '117%', y: '78%'},
                colors: ['#393AAA', ' #2E399A'],
                background: 'rgba(57,58,170,0.40)',
            },
            bonusCard: {
                type: 'radial',
                locations: [0, 1],
                radius: {x: '23%', y: '45%'},
                colors: ['#F7B04D', ' #9E6B05'],
                background: 'rgba(222,157,64,0.40)',
            },
        },
    },
};

export default data;
