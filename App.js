import React, {Component} from 'react';
import moment from 'moment';
import {getUvIndex, getUvIndexLevel, levels} from './services/weather';
import {getAddress} from './services/location';
import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Text, Header} from 'react-native-elements';

export default class App extends Component {
  state = {
    uvIndex: 0,
    loading: true,
    address: '',
    level: levels.default,
  };

  componentWillMount () {
    this.getUvIndex ();
  }

  _onRefresh () {
    this.getUvIndex ();
  }

  getUvIndex = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition (position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        Promise.all ([
          getAddress (lat, lon),
          getUvIndex (lat, lon, moment ().unix (), moment ().hours ()),
        ]).then (res => {
          this.setState ({
            uvIndex: res[1],
            loading: false,
            address: res[0],
            level: getUvIndexLevel (res[1]),
          });
        });
      });
    }
  };

  render () {
    return (
      <View
        style={{...styles.container, backgroundColor: this.state.level.color}}
      >
        <Header
          statusBarProps={{barStyle: 'light-content'}}
          centerComponent={{
            text: 'Should i Dud?',
            style: {color: 'white', fontSize: 20},
          }}
          backgroundColor={'black'}
        />
        {this.state.loading
          ? <ActivityIndicator color="white" />
          : <View style={styles.container}>
              <Text style={{fontSize: 60, marginBottom: 10}}>
                {this.state.level.label}
              </Text>
              <Text style={{fontSize: 25, marginBottom: 10}}>
                {this.state.level.subtitle}
              </Text>
              <Text style={{fontSize: 15, marginBottom: 10}}>
                {this.state.address}
              </Text>
            </View>}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
