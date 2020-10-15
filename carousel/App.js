import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, ImageBackground, Dimensions, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import styles, { colors } from './styles/index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const SLIDER_1_FIRST_ITEM = 1;

const ENTRIES1 = [
    {
        title: 'Студия',
        subtitle: 'Включен свет, шторы опущены',
        illustration: require('./assets/store.jpg'),
        navigate: 'Студия'
    },
    {
        title: 'Переговорная',
        subtitle: 'Выключен свет, жалюзи открыты',
        illustration: require('./assets/meeting.jpg'),
        navigate: 'Переговорная'
    }
];

class HomeScreen extends Component {

    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
              navigation={this.props.navigation}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} />;
    }

    mainExample (number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>AV Install</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax.bind(this)}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={false}
                  loopClonesPerSide={2}
                  autoplay={false}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    render () {
        const example1 = this.mainExample(1, 'Офис');

        return (
            // <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0.3)'}
                    barStyle={'light-content'}
                    />
                    <LinearGradient
                      // Background Linear Gradient
                      colors={['rgba(0,0,0,0.8)', 'transparent']}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 300,
                      }}
                    />
                    <ScrollView
                    style={styles.scrollview}
                    scrollEventThrottle={200}
                    directionalLockEnabled={true}
                    >
                        { example1 }
                    </ScrollView>
                </View>
            // </SafeAreaView>
        );
    }
}

function StudioLights({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require('./assets/store.jpg')} blurRadius={20} style={{ 
            flex: 1,
            resizeMode: "cover",
            alignItems: 'center',
            justifyContent: "center",
            width: viewportWidth,
            height: viewportHeight
          }}>
          <Text>StudioLights</Text>
          <Button
            title="Press me"
            onPress={() => {
              //Alert.alert('Simple Button pressed')
              navigation.goBack();
            }}
          />
        </ImageBackground>
      </View>
    );
}

function MeetingLights() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>MeetingLights</Text>
      </View>
    );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Офис">
        <Stack.Screen name="Офис" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Студия" component={StudioLights} options={{ headerShown: false }}/>
        <Stack.Screen name="Переговорная" component={MeetingLights} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;