import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { View, ScrollView, Text, StatusBar, ImageBackground, Dimensions, Button, Alert, TouchableOpacity, FlatList, Switch, Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import Slider from '@react-native-community/slider';
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

function old_Tile(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <TouchableOpacity onPress={toggleSwitch} style={{
        width:150, 
        height:150, 
        margin:10, 
        borderRadius: 10, 
        backgroundColor: `${ isEnabled ? 'rgba(200, 255, 200, 0.5)' : 'rgba(255, 255, 255, 0.5)' }`,
        shadowOffset: {
          width: 3,
          height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowColor: "black",
      }}>
      <FontAwesome5 style={{ padding: 5, position: "absolute", top: 25, left:25,
        textShadowColor: `${ isEnabled ? 'rgba(200, 255, 200, 0.5)' : 'rgba(255, 255, 255, 0.5)' }`,
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3
    }} name="lightbulb" size={40} color={isEnabled ? "orange" : "gray"} />
      <Text style={{ fontFamily: 'System', fontWeight: '500', fontSize: 15, position: "absolute", bottom: 20, left:25}}>{props.title}</Text>
      <Switch style={{ position: "absolute", top: 30, right:15, transform: [{ scaleX: .8 }, { scaleY: .8 }] }} onValueChange={toggleSwitch} value={isEnabled}/>
    </TouchableOpacity>
  )
}

class Tile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEnabled: false,
      modalVisible: false
    }
  }
  toggleSwitch = () => {
    this.setState({isEnabled: !this.state.isEnabled})
    if (this.state.isEnabled)
    {
      this.animation.reset()
      this.animation.play(60, 74)
    }
    else
    {
      this.animation.reset();
      this.animation.play(0, 40)
    }
  }
  showModal = (visible) => {
    //alert('You tapped the button!');
    this.setState({ modalVisible: visible });
  }
  render(){
    return (
      <TouchableOpacity onPress={this.toggleSwitch} onLongPress={() => {this.showModal(true)}} style={{
          width:150, 
          height:150, 
          margin:10, 
          borderRadius: 10, 
          backgroundColor: `${ this.state.isEnabled ? 'rgba(255, 255, 200, 0.5)' : 'rgba(255, 255, 255, 0.5)' }`,
          shadowOffset: {
            width: 3,
            height: 3
          },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          shadowColor: "black",
        }}>
        <LottieView ref={animation => { this.animation = animation}}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 90,
            height: 90,
            backgroundColor: 'transparent',
          }}
          loop={false}
          source={require('./assets/lamp.json')}
        />
        <Text style={{ color: `${ this.state.isEnabled ? 'black' : 'gray' }`,fontFamily: 'System', fontWeight: '500', fontSize: 15, position: "absolute", bottom: 20, left:25}}>{this.props.title}</Text>
        <Switch style={{ position: "absolute", top: 30, right:15, transform: [{ scaleX: .8 }, { scaleY: .8 }] }} onValueChange={this.toggleSwitch} value={this.state.isEnabled}/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 22 }}>
            <View style={{
                          margin: 20,
                          backgroundColor: "white",
                          borderRadius: 20,
                          padding: 35,
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5
                        }}>
              <Text style={{ marginBottom: 15, textAlign: "center" }}>Hello World!</Text>
              <Slider
                style={{width: 200, height: 40}}
                trackStyle={{height: 1, borderRadius:1}}
                thumbStyle={{width: 30, height: 30}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#00FF00"
              />
              <TouchableOpacity style={{
                  backgroundColor: "#F194FF",
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2,
                  backgroundColor: "#2196F3" }}
                onPress={() => { this.showModal(false) }}>
                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    )
  }
}

const Tab = createMaterialTopTabNavigator();

function Studio() {
  return(
    <Tab.Navigator tabBarOptions={{indicatorStyle: { backgroundColor: 'transparent' }, tabStyle: {width: 100}, style: { backgroundColor: 'transparent', position: "absolute", top: 70, width: viewportWidth }}}>
      <Tab.Screen name="Свет" component={StudioLights} />
      <Tab.Screen name="Шторы" component={StudioShades} />
    </Tab.Navigator>
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

        <View style={{width: 350, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center'}}>
          <Tile title="Потолок"/>
          <Tile title="Фитолампа"/>
          <Tile title="Споты"/>
        </View>
      </ImageBackground>
    </View>
  );
}

function StudioShades({ navigation }) {
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
        <Text>Hello, StudioShades</Text>
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
        <Stack.Screen name="Студия" component={Studio} options={{ headerTransparent: true, headerBackTitleVisible: false, headerTintColor: 'black' }}/>
        <Stack.Screen name="Переговорная" component={MeetingLights} options={{ headerTransparent: true }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;