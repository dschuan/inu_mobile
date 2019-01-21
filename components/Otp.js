import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';
import {Text, Button} from 'react-native-elements';
import totp from 'totp-generator';

import styles from './styles';

export default class Otp extends Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      name: '',
      token: '',
      secret:'',
      message:''
    }
  }
  ///auth_phone/username/otp
  componentDidMount() {
    AsyncStorage.multiGet(['user','qrid'], (err, res) => {
      if (err) {
        console.log('error'+ err)
      };
      if (res) {
        console.log(res)
        let user = res[0]
        user = user[1]
        user = JSON.parse(user)
        let qrid = res[1];
        qrid = qrid[1]

        console.log('User: ' + user.name + 'Qrid: ' + qrid)
        this.setState({secret: qrid})
        const token = totp(this.state.secret);
        this.setState({token})
        this.setState({name: user.name})
        const url = `https://finul-api.herokuapp.com/auth_phone/${this.state.name}/${this.state.token}`
        fetch(url).then(response => response.json())
        .then(res => {
          console.log(res);
          if (res.status) {
            this.setState({msg: 'Success!'})
            //this.props.navigation.navigate('Nfc')
          } else if (!res.status) {
            this.setState({msg: 'Try Again!'})
          }
        })
      }
    })

  }
  clickHandler() {
    const token = totp(this.state.secret);
    this.setState({token})
  }
  goBack() {
    this.props.navigation.navigate('Nfc')
  }
  render() {
    const {navigation} = this.props

    return (
      <View>
        <Text h4 style={styles.text}>Get Otp here:</Text>
        <Text h4 style={styles.text}> {this.state.token} </Text>
        <Text style={styles.text}> {this.state.msg} </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.clickHandler}
            title="Generate OTP again"
            buttonStyle={{
              backgroundColor: "#560d0d",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 2,
              margin: 20
            }}
            color="#fff"
            accessibilityLabel="Generate OTP"
          />

          <Button
            onPress={this.goBack}
            title="Make Another Transaction"
            buttonStyle={{
              backgroundColor: "#560d0d",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 2,
              margin: 10
            }}
            color="#fff"
            accessibilityLabel="do-over"
          />
        </View>
      </View>
    )
  }
}
