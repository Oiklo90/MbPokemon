import React, { Component } from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  VirtualizedList
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import PokeListItem from './PokeListItem'
import DefeatInfo from './DefeatInfo'


export default class FightClub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      challengers: null
    }

    this.HandleSelector = this.HandleSelector.bind(this)
    this._onPressItem = this._onPressItem.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.pokemonToDefeat !== this.props.pokemonToDefeat) {
      this.setState({challengers: null})
      let { allPoke, allMoves, pokemonToDefeat } = this.props
      this.GetChallengers(allPoke, allMoves, pokemonToDefeat)
    }
  }


  CalculSTAB (moveType, pokeTypes) {
    let STAB = 1
    pokeTypes.forEach(element => {
      if (element.type.name === moveType.name)
        STAB = 1.5
    })
    return STAB
  }

  CalculTypeDamage (moveType, pokeTypes) {
    let damage = 1
    pokeTypes.forEach(elem => {
      let info = elem.info
      for (let i = 0; i < info.double_damage_from.length; i++) {
        if (info.double_damage_from[i].name === moveType.name)
          damage *= 2
      }
      for (let i = 0; i < info.half_damage_from.length; i++) {
        if (info.half_damage_from[i].name === moveType.name)
          damage *= 0.5
      }
      for (let i = 0; i < info.no_damage_from.length; i++) {
        if (info.no_damage_from[i].name === moveType.name)
          damage *= 0
      }
    })
    return damage
  }

  async getTypeInfos (types) {
    return await new Promise(async (resolve, reject) => {
      let newType = []
      for (let i = 0; i < types.length; i++) {
        try {
          types[i].type.info = await fetch(types[i].type.url).then(resp => resp.json()).then(data => {
            return data.damage_relations
          })
          newType.push(types[i].type)
        } catch (e) {
          console.log('error getTypesInfos: ', e)
        }
      }
      resolve(newType)
    })
  }
  
  CalculDamage (power, attack, defense, move, poke, toDefeatTypes) {
    let STAB = this.CalculSTAB(move.type, poke.types)
    let typeDamage = this.CalculTypeDamage(move.type, toDefeatTypes)
    let level = 100
    return ((((((2 * level) / 5) + 2) * power * (attack / defense)) / 50) + 2) * STAB * typeDamage
  }

  async GetChallengers (allPoke, allMoves, pokemonToDefeat) {
    const toDefeat = allPoke[pokemonToDefeat - 1]
    const toDefeatTypes = await this.getTypeInfos(toDefeat.types)
    let challengers = await allPoke.filter(data => {
      if (data !== null) {
        data.moveTmp = data.moves.filter(move => {
          const thisMove = allMoves[move.move.url.split('/')[6] - 1]
          let att = thisMove.damage_class.name === 'physical' ? data.stats.att : data.stats.SPAtt
          let def = thisMove.damage_class.name === 'physical' ? toDefeat.stats.def : toDefeat.stats.SPDef
          const damage = this.CalculDamage(thisMove.power, att, def, thisMove, data, toDefeatTypes)
          move.damage = damage
          return damage >= toDefeat.stats.hp && data.stats.speed > toDefeat.stats.speed
        })
      }
      return data.moveTmp && data.moveTmp && data.moveTmp.length > 0
    })
    this.setState({challengers})
  }
  
  componentDidMount() {
    let { allPoke, allMoves, pokemonToDefeat } = this.props
    this.GetChallengers(allPoke, allMoves, pokemonToDefeat)
  }
  
  HandleSelector (val, id) {
    this.props.ChangeDefeat(id)
  }

  _onPressItem(id) {
    this.props.ChangeDefeat(id)
  }

  _renderList = ({item}) => (
    <PokeListItem data={item} onPressItem={this._onPressItem} />
  ) 

  render () {
    const { allPoke, pokemonToDefeat } = this.props
    const pokeNames = allPoke.map(val => {
      return {label: val.name, value: val.id, key: val.id}
    })
    const { challengers } = this.state
    return (
      <View style={{ flex: 1}}>
        <View style={{alignSelf: 'stretch'}}>
          <View style={{flexDirection: 'column', alignItems: 'stretch'}}>
            <Text style={{fontSize: 18, backgroundColor: 'white', marginLeft: 10}}>Defeat: </Text>
            <RNPickerSelect itemKey={pokemonToDefeat} value={allPoke[pokemonToDefeat - 1].name} onValueChange={this.HandleSelector} items={pokeNames} style={{ ...pickerSelectStyles }}/>
            <DefeatInfo data={allPoke[pokemonToDefeat - 1]} />
          </View>
        </View>
        {!!challengers ?
          <VirtualizedList keyExtractor={data => data.id.toString()} data={challengers} renderItem={this._renderList} getItem={(data, index) => data[index]} getItemCount={data => data.length}/>
          :
          <ActivityIndicator size="large" color="#0000ff" />
        }
      </View>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'white',
      color: 'black',
      // flex: 1
      // width: 'auto'
  },
  inputAndroid: {
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      backgroundColor: 'white',
      color: 'black',
      // flex: 1
      // width: 'auto'
  },
})
