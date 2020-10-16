import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, ImageBackground, Dimensions, Button, Alert, TouchableOpacity, FlatList} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
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

    get gradient () {
      return (
          <LinearGradient
            colors={[colors.background1, colors.background2]}
            startPoint={{ x: 1, y: 0 }}
            endPoint={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
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
                    { this.gradient }
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

function Tile() {
  return (
    <TouchableOpacity style={{
        width:150, 
        height:150, 
        margin:10, 
        borderRadius: 10, 
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: "black"
      }}>
      <FontAwesome5 style={{ position: "absolute", top: 25, left:25}} name="lightbulb" size={40} color={"gray"} />
      <Text style={{ position: "absolute", bottom: 25, left:25}}>Hello</Text>
    </TouchableOpacity>
  )
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
        <View style={{position: 'absolute', top: 0, left: 0}}>
          <TouchableOpacity onPress={() => {
              //Alert.alert('Something pressed')
              navigation.goBack();
            }}>
            <Ionicons style={{padding: 50}} name="ios-arrow-back" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{width: 350, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center'}}>
          <Tile />
          <Tile />
          <Tile />
        </View>
      </ImageBackground>
    </View>
  );
}

function MeetingLights({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground source={require('./assets/meeting.jpg')} blurRadius={20} style={{ 
            flex: 1,
            resizeMode: "cover",
            alignItems: 'center',
            justifyContent: "center",
            width: viewportWidth,
            height: viewportHeight
          }}>
          <View style={{position: 'absolute', top: 0, left: 0}}>
            <TouchableOpacity onPress={() => {
                //Alert.alert('Something pressed')
                navigation.goBack();
              }}>
              <Ionicons style={{padding: 50}} name="ios-arrow-back" size={32} color="white" />
            </TouchableOpacity>
          </View>
          <Text>Hello, MeetingLights</Text>
        </ImageBackground>
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