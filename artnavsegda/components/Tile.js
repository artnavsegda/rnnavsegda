import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import styled from "styled-components";

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

export default Tile