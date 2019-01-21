import React, {Component} from 'react';
import {AsyncStorage, View} from 'react-native';
import {Button} from 'react-native-elements';
import styles from './styles'
export default class Logout extends Component {
  constructor(props) {
    super(props);
    this.logoutHandler = this.logoutHandler.bind(this);
  }


  renderButton(){
    if (this.props.needLogout) {
      return (<Button
        onPress={this.logoutHandler}
        title="Log Out"
        color="#841584"
        accessibilityLabel="Log out"
      />)
    }
  }
  logoutHandler() {
    if (this.props.needLogout) {
      AsyncStorage.removeItem('qrid', (err, res) => {
        if (!err) {
          console.log('no more id');
          this.props.navigation.navigate('Home')
        }
      })
    }
  }
  render() {
    return (
      <View style={styles.buttonContainer}>
        {this.renderButton()}
      </View>
    )

  }
}
