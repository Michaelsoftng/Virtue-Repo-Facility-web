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

    const handleAdditionalChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setBuilding(event.target.value)
    }
    
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFullAddress(event.target.value);
       
    };

    const handlePlaceSelect = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.address_components) {
                
                let cityDetails = "";
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

                    if (types.includes('postal_code')) {
                        postalCode = component.long_name;  // Postal code
                    }

                    if (types.includes('administrative_area_level_1')) {
                        state = component.long_name;  // State or province
                    }

                    if (types.includes('country')) {
                        country = component.long_name;  // Country
                    }

                    if (types.includes("administrative_area_level_3")) {
                        cityDetails = component.long_name;  // City or locality
                    }

                    if (types.includes('locality')) {
                        region = component.long_name;  // City or locality
                    }

                  

                });

                // Construct the full street address at the end
                street = place.formatted_address as string;

                if (region && street.includes(region)) {
                    // Find where the text equal to `region` starts in `street`
                    const regionStartIndex = street.indexOf(region);

                    // Remove everything from `region` to the end of `street`
                    street = street.slice(0, regionStartIndex).trim();
                }
                
                region = (cityDetails ? `${cityDetails}, ` : '') + region;
                  
                    

                // Get latitude and longitude from geometry.location
                if (place.geometry && place.geometry.location) {
                    lat = place.geometry.location.lat();
                    lng = place.geometry.location.lng();
                }

                const name = place.name || '';
                const customAddress = place.formatted_address as string;

                // Update the state with extracted components
                setAddress(street);
                setPostalCode(postalCode);
                setState(state);
                setCountry(country);
                setCity(region);
                setLatitude(lat as number);
                setLongitude(lat as number);
                setFullAddress(customAddress);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} libraries={['places']}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            
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

                <div>
                    <label className="text-sm font-medium text-gray-600">Enter apartment</label>
                    
                    <input
                        type="text"
                        placeholder='apartment, building ....'
                        onChange={handleAdditionalChange}
                        
                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    
                </div>
            </div>
        </LoadScript>
    );
};

export default AddressSearch;
