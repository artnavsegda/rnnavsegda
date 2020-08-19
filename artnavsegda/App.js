import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import { StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import styled from "styled-components";

function mapStateToProps(state) {
  return { action: state.action }
}

const initialState = {

};

const reducer = (state = initialState, action) => {
  return state;
}

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightOn: true
    };
  }
  changeColor = () => {
    this.setState({lightOn: !this.state.lightOn});
  }
  render() {
    return(
      <Container onPress={this.changeColor} style={ { backgroundColor: `${ this.state.lightOn ? "#f99" : "#9f9" }` } } >
        <Text>{this.props.caption}</Text>
        <Switch value={this.state.lightOn} onValueChange={this.changeColor} />
      </Container>
    )
  }
}

const Container = styled.TouchableOpacity`
  background: gray;
  width: 100px;
  height: 100px;
  border-radius: 14px;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lightOn: true
    };
  }
  changeColor = () => {
    this.setState({lightOn: !this.state.lightOn});
  }
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Tile caption="Потолок"/>
          <Tile caption="Лампа"/>
          <StatusBar style="auto" />
        </View>
      </Provider>
    );
  }
}

export default App;

const store = createStore(reducer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
