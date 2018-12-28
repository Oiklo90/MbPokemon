import React, { Component } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Platform
} from 'react-native'

export default class FightClub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      challengers: null
    }
  }

  render () {
    const { data } = this.props
    return (
      <View style={styles.Container}>
        <View style={{width: 80}}>
          <Image source={{uri: data.sprites.front_default}} style={{width: 60, height: 60}} />
          <View style={styles.infos}>
            <Text>{data.name}</Text>
          </View>
        </View>
        <View style={styles.rightInfo}>
          <View style={{flexDirection: 'column'}}>
            <Text>Stats :</Text>
            <View style={styles.statsInfo}>
              {Object.keys(data.stats).map((val, ind) => (
                <View style={{width: 45}} key={ind}>
                  <Text style={styles.statText}>{val}</Text>
                  <Text style={styles.statText}>{data.stats[val]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    backgroundColor: 'rgb(250,250,250)',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    alignItems: 'stretch',
    // justifyContent: 'space-between'
  },
  infos: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginLeft: 50
      }
    })
  },
  rightInfo: {
    marginLeft: 5,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statsInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-between',
  },
  moveText: {
    marginLeft: 10
  },
  statsInfo2: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  }
})
