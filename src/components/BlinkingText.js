import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
export default class BlinkingText extends Component {
  constructor(props) {
    super(props);
    this.state = {showText: true};

    // Change the state every second
    setInterval(
      () => {
        this.setState(previousState => {
          return {showText: !previousState.showText};
        });
      },
      // Define any blinking time.
      500,
    );
  }

  render() {
    let display = this.state.showText ? this.props.text : ' ';
    return <Text style={{color: 'white', fontWeight: 'bold'}}>{display}</Text>;
  }
}
