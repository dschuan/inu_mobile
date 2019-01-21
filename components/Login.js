import React, {Component} from 'react';
import {AsyncStorage, View, Button, StyleSheet} from 'react-native';
import {QRscanner} from 'react-native-qr-scanner';
import {Text} from 'react-native-elements';
import styles from './styles';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { zoom: 0.2, msg: '', error: false, run: false};
    this.loginHandler = this.loginHandler.bind(this);
    this.onRead = this.onRead.bind(this);
  }
  componentDidMount() {
    this.setState({run: true})
  }
  onRead(res) {
      AsyncStorage.setItem('qrid', res.data);
      this.setState({run: false})
      this.props.navigation.navigate('Nfc');

  }
  loginHandler() {
    console.log("Navigating")
    this.props.navigation.navigate('Nfc')
  }

  render() {
    console.log('rendering')
    return (
      <View>
        <Text style={styles.text}>Scan QR Code to proceed</Text>
        <QRscanner onRead={this.onRead}
        flashMode={false}
        finderY={70}/>
      </View>
    );
  }
}
