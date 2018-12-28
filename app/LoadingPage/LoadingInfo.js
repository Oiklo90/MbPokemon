import React, { Component } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import PercentageCircle from 'react-native-percentage-circle'

export default class LoadingInfo extends Component {
  constructor(props) {
    super(props)
  }
  
  render () {
    const { name, percent } = this.props
    return (
      <View style={styles.container}>
        <Text>{`${name} datas: `}</Text>
        <PercentageCircle radius={20} percent={percent} color={percent === 100 ? 'green' : "#3498db"}></PercentageCircle> 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '5%'
  }
})
