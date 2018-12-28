import React, { Component } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import LoadingInfo from './LoadingInfo'

export default class LoadingData extends Component {
  constructor(props) {
    super(props)
  }
  
  render () {
    const { moves, poke } = this.props
    return (
      <View>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading datas, please wait !</Text>
        </View>
        <LoadingInfo name='Moves' percent={moves} />
        <LoadingInfo name='Pokemons' percent={poke} />
        {/* <Text>{`Moves datas: ${moves}%`}</Text>
        <Text>{`Pokemons datas: ${poke}%`}</Text> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%'
  }
})
