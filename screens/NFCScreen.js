import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';
import {Card, Button, Header, Icon, Text, ListItem} from 'react-native-elements';
import NFCHandler from '../components/NFCHandler';
import Logout from '../components/Logout';
import Modal from "react-native-modal";
import styles from './styles';

export default class NFCScreen extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.state = {hasId: false, id: '', user: '', transaction: '', modal: false}
  }
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
        if (qrid){
          this.setState({hasId: true, id: qrid})
        }
        if (user){
          this.setState({user: user.name})
        }
      }
    })
    this.timer = setInterval(()=> this.poll(), 2000);

  }

poll() {
  if (this.state.user.length > 0) {
    const url = 'https://finul-api.herokuapp.com/auth_poll/' + this.state.user;
    fetch(url)
    .then((response) => response.json())
    .then((res) => {

      if (res) {
        console.log(res.transaction)
        if (res.transaction !== null) {
          console.log('Result: ' + res.transaction)
          clearInterval(this.timer)
          this.setState({transaction: res.transaction})
          if (typeof this.state.transaction === 'object') {
            this.setState({modal: true})
          }
        }
      }
    }).catch(err => console.log(err))
  }

}
componentWillUnmount() {
  clearInterval(this.timer)
  this.timer = null; // here...
}

hideModal(){
  this.setState({modal: false})
  this.timer = setInterval(()=> this.poll(), 2000);
  const url = `https://finul-api.herokuapp.com/reject_transaction/${this.state.user}`
  fetch(url).then((response) => response.json())
  .then((res) => {
    console.log("Forget everything")
  })
}

  render() {
    const {navigation} = this.props
    console.log('trans at render' + this.state.transaction)
    const {amount, date, receiver_id, time, description} = this.state.transaction;
    const list = [
      {name: 'Amount', val:amount},
      {name: 'Received On', val:`${date}, on ${time}`},
      {name: 'Given To', val: receiver_id},
      {name: 'Notes', val: description}
    ]
    return (
      <View>
        <Header containerStyle={styles.headerContainer} centerComponent={{ text: 'Verification', style: styles.header }} />

        <NFCHandler navigation={navigation}/>
        <Modal isVisible={this.state.modal}>
          <View>
          <Card
            title='Incoming Transaction'
          >
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                subtitle={l.val}
                titleStyle={{ fontWeight: 'bold' }}

              />
            ))
          }
            <Text >You can tap your bank card on this phone to continue, or reject the transaction by pressing the button below</Text>
            <Button
              icon={<Icon name='code' color='#fff' />}
              backgroundColor='#5c1010'
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              onPress={this.hideModal}
              title='REJECT THE TRANSACTION' />
            </Card>

          </View>

        </Modal>
        <Logout needLogout={this.state.hasId} navigation={navigation}/>
      </View>
    )
  }
}
