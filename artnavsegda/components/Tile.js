import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import styled from "styled-components";
import { toggleTodo } from '../actions'

const Tile = ({ onClick, lightOn, caption }) => (
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

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Tile)