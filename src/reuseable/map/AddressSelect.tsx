/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

export interface AddressProps {
    setAddress: (address: string) => void;
    setBuilding: (building: string) => void;
    setPostalCode: (postalCode: string) => void;
    setState: (state: string) => void;
    setCountry: (country: string) => void;
    setCity: (city: string) => void;
    setLongitude: (lon: number) => void;
    setLatitude: (lat: number) => void;
}

const AddressSearch: React.FC<AddressProps> = ({
    setAddress,
    setBuilding,
    setPostalCode,
    setState,
    setCountry,
    setCity,
    setLongitude,
    setLatitude
}) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [fulladdress, setFullAddress] = useState<string>('');

    // Handle address change

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFullAddress(event.target.value);
       
    };

    // Handle place selection from autocomplete
    // const handlePlaceSelect = () => {
    //     if (autocomplete) {
    //         const place = autocomplete.getPlace();
    //         if (place.formatted_address) {
    //             setFullAddress(place.formatted_address);  // Show the selected address
    //         }
    //     }
    // };

    const handlePlaceSelect = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.address_components) {
                let street = '';
                let postalCode = '';
                let state = '';
                let country = '';
                let region = '';
                let lat = null;
                let lng = null;
                // Loop through address components and assign values to state variables
                place.address_components.forEach((component) => {
                    const types = component.types;

                    // Extract the street name (route)
                    if (types.includes('route')) {
                        street = component.long_name;  // Street name (not full address)
                    }

                    // Extract postal code
                    if (types.includes('postal_code')) {
                        postalCode = component.long_name;  // Postal code
                    }

                    // Extract state (administrative_area_level_1)
                    if (types.includes('administrative_area_level_1')) {
                        state = component.long_name;  // State/Province
                    }

                    // Extract country
                    if (types.includes('country')) {
                        country = component.long_name;  // Country
                    }

                    // Extract locality (region)
                    if (types.includes('locality')) {
                        region = component.long_name;  // Region (city or locality)
                    }
                });

                // Get latitude and longitude from geometry.location
                if (place.geometry && place.geometry.location) {
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();
                }

                const name = place.name || '';
                const customAddress = `${name}, ${street}, ${region} ${country}`;
                // Update the state with extracted components
                setAddress(street);
                setPostalCode(postalCode);
                setState(state);
                setCountry(country);
                setCity(region);
                setLatitude(lat as number);
                setLongitude(lat as number);
                // Set full address
                setFullAddress(customAddress);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} libraries={['places']}>
            <div>
                <label className="text-sm font-medium text-gray-600">Enter your address</label>
                <Autocomplete
                    onLoad={(loadedAutocomplete) => setAutocomplete(loadedAutocomplete)} // Store the Autocomplete instance
                    onPlaceChanged={handlePlaceSelect}  // Handle when a place is selected
                >
                    <input
                        type="text"
                        value={fulladdress}
                        onChange={handleAddressChange}
                        placeholder="Enter address"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </Autocomplete>
            </div>
        </LoadScript>
    );
};

export default AddressSearch;
