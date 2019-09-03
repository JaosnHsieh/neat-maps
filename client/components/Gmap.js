import React from 'react';
import PropTypes from 'prop-types';

const wait = (milliseconds = 500) =>
  new window.Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
class Gmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitMap: false,
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.state.isInitMap) {
      this.addMarkersByAddress(nextProps.addresses);
    }
    return false;
  }
  componentDidMount() {
    const script = document.createElement('script');
    const googleMapApiKey = process.env.GOOGLE_MAP_API_KEY || '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&callback=initMap`;
    script.async = false;

    document.body.appendChild(script);

    window.initMap = () => {
      var map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: { lat: -34.397, lng: 150.644 },
      });
      this.setState({ isInitMap: true });
      this.map = map;
    };
  }
  async addMarkersByAddress(addresses = []) {
    const geocoder = new window.google.maps.Geocoder();
    // wait coz google map default geocoder api quota per second
    for (let address of addresses) {
      await wait();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          //   this.map.setCenter(results[0].geometry.location);
          //   var marker =
          new window.google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location,
          });
          this.map && this.map.setCenter(results[0].geometry.location);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }

  render() {
    return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
  }
}

Gmap.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.string),
};
Gmap.defaultProps = {
  addresses: [],
};
export default Gmap;
