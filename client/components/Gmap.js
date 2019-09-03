import React from 'react';
import PropTypes from 'prop-types';

class Gmap extends React.PureComponent {
  shouldComponentUpdate(nextProps) {
    this.addMarkersByAddress(nextProps.addresses || []);
    return false;
  }
  componentDidMount() {
    window.initMap = function initMap() {
      //   var geocoder;
      //   var address = 'new york city';
      //   var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 3,
      //     center: { lat: -34.397, lng: 150.644 },
      //   });
      //   this.map = map;
      //   geocoder = new google.maps.Geocoder();
      //   codeAddress(geocoder, map);
      //   function codeAddress(geocoder, map) {
      //     geocoder.geocode({ address: address }, function(results, status) {
      //       if (status === 'OK') {
      //         map.setCenter(results[0].geometry.location);
      //         var marker = new google.maps.Marker({
      //           map: map,
      //           position: results[0].geometry.location,
      //         });
      //       } else {
      //         alert('Geocode was not successful for the following reason: ' + status);
      //       }
      //     });
      //   }
    };
    const script = document.createElement('script');
    const googleMapApiKey = process.env.GOOGLE_MAP_API_KEY || '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&callback=initMap`;
    script.async = true;

    document.body.appendChild(script);
  }
  addMarkersByAddress(addresses = []) {
    const geocoder = new window.google.maps.Geocoder();
    addresses.map(address => {
      geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK') {
          //   this.map.setCenter(results[0].geometry.location);
          //   var marker =
          new window.google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location,
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  render() {
    return <div id="map" style={{ width: '500px', height: '500px' }}></div>;
  }
}

Gmap.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.string),
};
Gmap.defaultProps = {
  addresses: [],
};
export default Gmap;
