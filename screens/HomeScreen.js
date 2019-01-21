import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

import {Header} from 'react-native-elements';
import Login from '../components/Login';
import Logout from '../components/Logout';
import styles from './styles';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasId: false, id: ''}
  }

  componentDidMount() {
    AsyncStorage.getItem('qrid', (err, res) => {
      if (err) {
        console.log('error'+ err)
      };
      if (res) {
        this.setState({hasId: true, id: res})
        this.props.navigation.navigate('Nfc')
      }
    })
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Header containerStyle={styles.headerContainer} centerComponent={{ text: 'Home' ,style: styles.header }} />

        <Login  navigation={navigation}/>
        <Logout needLogout={this.state.hasId} navigation={navigation} />
      </View>
    );
  }
}
