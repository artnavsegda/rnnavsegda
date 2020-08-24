import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import styled from "styled-components";
import { toggleTodo } from '../actions'

const Tile = ({ id, onClick, lightOn, caption }) => (
  <Container onPress={onClick} style={ { backgroundColor: `${ lightOn ? "#f99" : "#9f9" }` } } >
    <Text>{caption}</Text>
    <Switch value={lightOn} onValueChange={onClick} />
  </Container>
)

const Container = styled.TouchableOpacity`
  background: gray;
  width: 100px;
  height: 100px;
  border-radius: 14px;
`;

const mapStateToProps = (state, ownProps) => {
  console.log("state recieved " + JSON.stringify(state) + " for props " + JSON.stringify(ownProps) + " is " + state[ownProps.id]);
  return {
    lightOn: state[ownProps.id].myLight
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch({ type: 'TOGGLE', id: ownProps.id })
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tile)
