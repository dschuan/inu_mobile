import React, {Component} from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import {Header} from 'react-native-elements';
import Otp from '../components/Otp';
import Logout from '../components/Logout';
import styles from './styles';

export default class OtpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {hasId: false, id: ''}
  }
  componentDidMount() {
    console.log('loading otp')
    AsyncStorage.getItem('qrid', (err, res) => {
      if (err) {
        console.log('error'+ err)
      };
      console.log(res)
      if (res) {
        console.log(res)
        this.setState({hasId: true, id: res})
      }
    })
  }
  render() {
    const {navigation} = this.props
    return (
      <View>
        <Header containerStyle={styles.headerContainer} centerComponent={{ text: 'Verification', style: styles.header }} />
        <Otp navigation={navigation} />
        <Logout needLogout={this.state.hasId} navigation={navigation}/>
      </View>
    )
  }
}
