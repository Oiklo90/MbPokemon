import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native'
import LoadingData from './LoadingPage/LoadingData'
import FightClub from './FightClub/FightClub'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPoke: null,
      allMoves: null,
      pokemonToDefeat: 25,
      movesAv: 0,
      pokeAv: 0
    }
  }

  GetAllMoves = async () => {
    return await new Promise((resolve, reject) => {
      try {
        fetch('https://pokeapi.co/api/v2/move').then(resp => resp.json()).then(data => {
          let all = data.results.length
          let i = 1
          resolve(
            Promise.all(data.results.map(async (value) => {
              try {
                return await fetch(value.url).then(resp => resp.json()).then(move => {
                  let percent = parseInt((i * 100) / all, 10)
                  this.setState({movesAv: percent})
                  i++
                  if (move.power !== null) return move
                  else return null
                })
              } catch (e) {
                console.log('error 2 GetAllMoves: ', e);
              }
            }))
          )
        })
      } catch (e) {
        console.log('error GetAllMoves:', e);
      }
    })
  }

  GetAllPoke = async (allMoves) => {
    return await new Promise((resolve, reject) => {
      try {
        fetch('https://pokeapi.co/api/v2/pokemon').then(resp => resp.json()).then(async data => {
          let i = 1
          let newRes = data.results.filter((val) => {
            return val.url.split('/')[6] < 10000
          })
          let all = newRes.length
          if (Platform.OS === 'ios') {
            let allPoke = []
            for (let j = 0; j < newRes.length; j++) {
              let element = await fetch(newRes[j].url).then(resp => resp.json()).then(pokeData => {
                pokeData.stats = this.getLvlmaxStat(pokeData.stats)
                pokeData.moves = pokeData.moves.filter(move => {
                  const idmove = move.move.url.split('/')[6]
                  return allMoves[idmove - 1] !== null
                })
                let percent = parseInt((i * 100) / all, 10)
                this.setState({pokeAv: percent})
                i++
                return pokeData
              })
              allPoke.push(element)
            }
            resolve(allPoke)
          } else {
            resolve(
              Promise.all(newRes.map(async (value) => {
                try {
                  return await fetch(value.url).then(resp => resp.json()).then(pokeData => {
                    pokeData.stats = this.getLvlmaxStat(pokeData.stats)
                    pokeData.moves = pokeData.moves.filter(move => {
                      const idmove = move.move.url.split('/')[6]
                      return allMoves[idmove - 1] !== null
                    })
                    let percent = parseInt((i * 100) / all, 10)
                    this.setState({pokeAv: percent})
                    i++
                    return pokeData
                  }).catch(e => {console.log('error fetch: ', value.url)})
                } catch (e) {
                  console.log('error 2 GetAllPoke: ', value.url);
                }
              }))
            )
          }
        })
      } catch (e) {
        console.log('error GetAllPoke: ', e);
      }
    })
  }

  getLvlmaxStat = (stats) => {
    let newStat = {}
    newStat.speed = stats[0].base_stat * 2 + 5
    newStat.SPDef = stats[1].base_stat * 2 + 5
    newStat.SPAtt = stats[2].base_stat * 2 + 5
    newStat.def = stats[3].base_stat * 2 + 5
    newStat.att = stats[4].base_stat * 2 + 5
    newStat.hp = stats[5].base_stat * 2 + 110
    return newStat
  }

  componentDidMount = async () => {
    let allMoves = await this.GetAllMoves()
    let allPoke = await this.GetAllPoke(allMoves)
    allPoke = allPoke.filter(val => {
      return val !== null && !!val
    })
    this.setState({allPoke, allMoves})
  }
  
  ChangeDefeat = (id) => {
    if (id !== this.state.pokemonToDefeat) this.setState({pokemonToDefeat: id})
  }

  render() {
    const { allPoke, allMoves, movesAv, pokeAv, pokemonToDefeat } = this.state
    return (
      <View style={styles.container}>
        {!!allPoke && !!allMoves ? 
          <FightClub ChangeDefeat={this.ChangeDefeat} allPoke={allPoke} allMoves={allMoves} pokemonToDefeat={pokemonToDefeat} />
          : 
          <LoadingData moves={movesAv} poke={pokeAv} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: {
        paddingTop: 40,
      }
    })
  }
})

export default App
