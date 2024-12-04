import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const GoogleMapComponent = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [showInfo, setShowInfo] = useState(false);

    // Function to handle map click and perform reverse geocoding
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        const clickedLocation = event.latLng;
        setLocation({
            lat: clickedLocation?.lat() as number,
            lng: clickedLocation?.lng() as number,
        });

        // Call reverse geocoding API
        reverseGeocode(clickedLocation as google.maps.LatLng);
        setShowInfo(true);
    };

    // Reverse Geocoding to fetch the address and other details
    const reverseGeocode = (latLng: google.maps.LatLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
                const addressComponents = results[0].address_components;

                let street = '';
                let city = '';
                let state = '';
                let country = '';
                let postalCode = '';

                addressComponents.forEach((component) => {
                    if (component.types.includes('street_address')) {
                        street = component.long_name;
                    }
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    }
                    if (component.types.includes('country')) {
                        country = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                        postalCode = component.long_name;
                    }
                });

                setAddress(`Street: ${street}, City: ${city}, State: ${state}, Postal Code: ${postalCode}, Country: ${country}`);
            } else {
                setAddress('Unable to retrieve address');
            }
        });
    };


    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: 51.505, lng: -0.09 }}
                zoom={13}
                onClick={handleMapClick}
            >
                {location && <Marker position={{ lat: location.lat, lng: location.lng }} />}
                {showInfo && location && (
                    <InfoWindow
                        position={{ lat: location.lat, lng: location.lng }}
                        onCloseClick={() => setShowInfo(false)}
                    >
                        <div>
                            <h3>Selected Location</h3>
                            <p>Latitude: {location.lat}</p>
                            <p>Longitude: {location.lng}</p>
                            <p>Address: {address}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
