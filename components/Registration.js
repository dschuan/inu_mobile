import React, {Component} from 'react';
import {View, AsyncStorage, Image} from 'react-native';
import {Text, Card, Input, Button} from 'react-native-elements';
import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this)
    this.renderConfirmation = this.renderConfirmation.bind(this)
    this.fillUsername = this.fillUsername.bind(this)
    this.state = {
      fillName: true,
      scannedID: '',
      name: ''
    }
  }
  clickHandler() {
    this.setState({fillName: false})
  }
  componentDidMount(){
    NfcManager.isSupported()
    .then(supported => {
      console.log('test' + supported)
      if (supported) {
        NfcManager.start()
        .then(result => {
          console.log('start OK', result);
        })
        .catch(error => {
          console.warn('device does not support nfc!');
        })
      }
    });
    NfcManager.registerTagEvent(tag => {
      console.log('Tag Discovered');
      //console.log(tag.id)
      if (tag.id) {
        this.setState({scannedID: tag.id})
        let user = { name: this.state.name, nfcid: this.state.scannedID}
        user = JSON.stringify(user)
        AsyncStorage.setItem('user', user, (err, res) => {
          if (err) {
            console.log(err)
          } else {
            console.log(user)
            AsyncStorage.removeItem('qrid', (err, res) => {
              if (err) {
                console.log(err)
              } else {
                setTimeout(() => this.props.navigation.navigate('Home'), 1000)
              }
            })
          }
        })
      } else {
        this.setState({scannedID: 'No ID Detected'})
      }
    });
  }

  componentWillUnmount() {
    NfcManager.unregisterTagEvent();
    NfcManager.stop();
  }
  renderConfirmation() {

    if (this.state.scannedID.length > 0) {
      return (
        <Card
          title='Successfully Registered Card'
          image={{uri: 'https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif'}}
          imageProps={{resizeMode: 'contain'}}>

        </Card>
      )
    } else {
      return <View />
    }
  }

  fillUsername() {
    if (this.state.fillName) {
      return (
        <View style={styles.container}>
        <Input
        placeholder='Username'
        leftIcon={{ type: 'font-awesome', name: 'user-circle' }}
        style={styles.input}
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
        />
        <Button
          color="#ff300"
          accessibilityLabel="Submit"
          icon={
            <Icon
              name='arrow-right'
              size={15}
              color='white'
            />
          }
          title='Submit'
          onPress={this.clickHandler}
          buttonStyle = {styles.button}
          containerStyle = {styles.buttonContainer}
        />

        </View>
      )
    } else {
      return (
        <View>
          <Card>
          <Text h4 style={styles.text}>Place your bank card on your phone</Text>
          {this.renderConfirmation()}
          </Card>
        </View>
      )
    }
  }
  render(){
    return (
      <View>
        {this.fillUsername()}
      </View>
    )
  }
}
