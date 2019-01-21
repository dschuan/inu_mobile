import React, {Component} from 'react';
import {View, AsyncStorage, Button} from 'react-native';
import { Text, Card } from 'react-native-elements';
import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager';

import styles from './styles';
export default class NFCHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NFCSupported: false,
      scannedNFC: false,
      scannedID: '',
      name: '',
      nfcid: '',
      msg: ''
    }
  }

  renderConfirmation() {
    if (this.state.scannedNFC) {
      if (this.state.msg === 'NFC Detected, redirecting...') {
        return (
          <View>
          <Card
            title='Scan Successful!'
            image={{uri: 'https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif'}}
            imageProps={{resizeMode: 'contain'}}>

          </Card>
          </View>
        )
      } else {
        return (
          <View>
          <Card
            title='Try Again!'
            image={{uri: 'https://i.4pcdn.org/pol/1495138675713.gif'}}
            imageProps={{resizeMode: 'contain'}}>

          </Card>
          </View>
        )

      }


    }

    if (this.state.NFCSupported) {
      return (
        <Text style={styles.text}> NFC is supported </Text>
      )
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('user', (err, res) => {
      if (err) {
        console.log(err)
      }
      if (res) {
        let info = JSON.parse(res);
        this.setState({name: info.name, nfcid: info.nfcid})
        console.log(this.state.nfcid)
      }
    })

    NfcManager.isSupported()
    .then(supported => {
      console.log('test' + supported)
      if (supported) {
        this.setState({NFCSupported: true});
        NfcManager.start()
        .then(result => {
          console.log('start OK', result);
        })
        .catch(error => {
          console.warn('device does not support nfc!');
          this.setState({supported: false});
        })
      }
    });
    console.log('testing tag')
    NfcManager.registerTagEvent(tag => {
      console.log('Tag Discovered');
      this.setState({scannedNFC: true})
      //console.log(tag.id)
      if (tag.id) {
        console.log(tag.id)
        if (this.state.nfcid !== tag.id) {
          this.setState({msg: 'Your card did not match our records, refreshing...'});
          setTimeout(() => {
            this.props.navigation.navigate('Home')
          }, 3000)
        } else {
          this.setState({scannedID: tag.id, msg: 'NFC Detected, redirecting...'})

          setTimeout(() => {
            this.props.navigation.navigate('Otp')
          }, 2000)
        }

      } else {
        this.setState({scannedID: 'No ID Detected'})
      }
    });

  }

  componentWillUnmount() {
    NfcManager.unregisterTagEvent();
    NfcManager.stop();
    this.setState({scannedNFC: false})


  }

  render(){
    return (
      <View style={styles.container}>
        <Card>
        <Text h2 style={styles.text}>Place your bank card on your phone</Text>
        {this.renderConfirmation()}
        </Card>

      </View>
    )
  }
}
