import React, {Component} from 'react';
import moment from 'moment';
import {getUvIndex, getUvIndexLevel, levels} from './services/weather';
import {getAddress} from './services/location';
import {StackNavigator} from 'react-navigation';
import {Constants} from 'expo';

import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {Text, Header} from 'react-native-elements';

class MainView extends Component {
  static navigationOptions = {
    title: 'Should i Dud?',
  };

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
        {this.state.loading
          ? <ActivityIndicator color="white" />
          : <View style={styles.container}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <ScrollView
                  style={{display: 'flex'}}
                  contentContainerStyle={{flexGrow: 1}}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.loading}
                      onRefresh={this._onRefresh.bind (this)}
                    />
                  }
                />
              </View>
              <Text style={{fontSize: 60, marginBottom: 10, color: 'white'}}>
                {this.state.level.label}
              </Text>
              <Text style={{fontSize: 25, marginBottom: 10, color: 'white'}}>
                {this.state.level.subtitle}
              </Text>
              <Text style={{fontSize: 15, marginBottom: 10, color: 'white'}}>
                {this.state.address}
              </Text>
            </View>}
      </View>
    );
  }
}

const MainScreenNavigator = StackNavigator ({
  Home: {screen: MainView},
});

export default class App extends Component {
  render () {
    return <MainScreenNavigator />;
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
