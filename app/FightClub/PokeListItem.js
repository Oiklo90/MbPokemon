import React, { PureComponent } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native'

export default class PokeListItem extends PureComponent {
  constructor(props) {
    super(props)
    this.HandlePress = this.HandlePress.bind(this)
  }

  HandlePress() {
    this.props.onPressItem(this.props.data.id)
  }

  render () {
    const { data } = this.props
    return (
      <TouchableOpacity style={styles.Container} onPress={this.HandlePress}>
        <View style={styles.leftInfo}>
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
                <View style={{width: 50}} key={ind}>
                  <Text style={styles.statText}>{val}</Text>
                  <Text style={styles.statText}>{data.stats[val]}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{marginRight: 50,}}>
            <View style={{flexDirection: 'column', flex: 1,}}>
              <Text>Moves :</Text>
              <View style={styles.statsInfo2}>
                {data.moveTmp.map((val, ind) => (
                  <View key={ind}>
                    <Text style={styles.moveText}>{val.move.name}</Text>
                    {/* <Text style={styles.statText}>{data.stats[val]}</Text> */}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    backgroundColor: 'rgb(250,250,250)',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    justifyContent: 'space-between'
  },
  infos: {
    flex: 1,
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
    width: 100,
    // justifyContent: 'space-between',
  },
  moveText: {
    marginLeft: 10
  },
  statsInfo2: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  }
})
