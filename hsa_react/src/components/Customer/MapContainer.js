// React Components
import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker,InfoWindow } from "google-maps-react";

class MapContainer extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.cnt);
    this.state = {
      initial: { lat: "47.444", lng: "-122.176" },
      currentCount: this.props.cnt,
      changes: "",
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}, 
      stores: [
        { latitude: 18.579467, longitude: 73.743762 },
        { latitude: 18.582730, longitude: 73.743147 },
        { latitude: 18.588789, longitude: 73.741673 },
        { latitude: 18.591082, longitude: 73.740480 },
        { latitude: 18.591123, longitude: 73.740962 },
        { latitude: 18.591042, longitude: 73.741563 },
        { latitude: 18.591103, longitude: 73.742282 },
        { latitude: 18.591184, longitude: 73.743033 },
        { latitude: 18.591235, longitude: 73.743398 },
        { latitude: 18.591164, longitude: 73.744460 },
        { latitude: 18.591042, longitude: 73.745683 },
        { latitude: 18.590940, longitude: 73.747013 },
        { latitude: 18.590960, longitude: 73.749417 },
        { latitude: 18.590859, longitude: 73.750865 },
        { latitude: 18.590991, longitude: 73.752110 },
        { latitude: 18.591448, longitude: 73.753118 },
        { latitude: 18.591774, longitude: 73.754009 },
        { latitude: 18.592018, longitude: 73.755339 },
        { latitude: 18.592079, longitude: 73.757603 },
        { latitude: 18.592262, longitude: 73.758869 }
      ]
    };
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  displayMarkers = () => {
    return (
      <Marker
        key={this.state.currentCount}
        id={this.state.currentCount}
        position={{
          lat: this.state.stores[this.state.currentCount].latitude,
          lng: this.state.stores[this.state.currentCount].longitude
        }}
        onClick={this.onMarkerClick} name={'current location'}
      />
    );
  };

  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
    if (this.state.currentCount < 1) {
      clearInterval(this.intervalId);
    }
  }
  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 300);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate() {
    // console.log("Updated " + this.props.cnt);
    if (this.state.currentCount == 0) {
      this.setState({
        currentCount: 19
      });
    }
  }

  render() {
    const mapStyles = {
      width: "90%",
      height: "20%"
    };
    var cnt = 1;
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={mapStyles}
        initialCenter={{
          lat: this.state.initial.lat,
          lng: this.state.initial.lng
        }}
      >
        {this.displayMarkers()}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD8nNA8oClra35kgn3VAi1Eo5jdZnNgd24"
})(MapContainer);
