/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import NFCScreen from './screens/NFCScreen';
import OtpScreen from './screens/OtpScreen';

type Props = {};
const AppNavigator = createSwitchNavigator({
    Registration: {screen: RegistrationScreen},
    Home: { screen: HomeScreen },
    Nfc: { screen: NFCScreen },
    Otp: { screen: OtpScreen }
});

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component<Props> {
  render() {
    return (
      <AppContainer style={styles.container}/>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
