import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';
import {Header, Text} from 'react-native-elements';
import Registration from '../components/Registration';
import styles from './styles';

export default class RegistrationScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasName: false, }
  }
  componentDidMount() {
    AsyncStorage.getItem('user', (err, res) => {
      if (err) {
        console.log('error'+ err)
      };
      console.log(res)
      if (res) {
        this.setState({hasId: true, id: res})
        //this.props.navigation.navigate('Home')
      }
    })
  }

  render() {
    const {navigation} = this.props
    return (
      <View >
        <Header containerStyle={styles.headerContainer} centerComponent={{ text: 'Register', style: styles.header }} />
        
          <Registration navigation={navigation}/>
      </View>
    );
  }
}
