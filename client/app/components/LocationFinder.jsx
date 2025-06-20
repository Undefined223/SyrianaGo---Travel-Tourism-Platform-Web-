import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
// Using fetch instead of axios

// Custom hook for popover functionality
function useDisclosure() {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false)
    };
}

function LocationMarker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [address, setAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const map = useMap();
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);
            setLongitude(lng);
            setLatitude(lat);
            getAddress(lat, lng);
        },
    });

    const getAddress = (lat, lng) => {
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=9a9d20df050d4352b4eb066d5d061f49`)
            .then(response => response.json())
            .then(data => {
                const props = data.features[0].properties;
                setAddress(props.formatted);
                // Pass city, lat, lng
                onLocationSelect({
                    city: props.city || props.county || props.state || props.country || props.formatted,
                    lat,
                    lng
                });
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
    };

    const handleSearchInputChange = (e) => {
        const { value } = e.target;
        setSearchQuery(value);
        if (value.trim() !== "") {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const fetchSuggestions = (query) => {
        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=9a9d20df050d4352b4eb066d5d061f49`)
            .then(response => response.json())
            .then(data => {
                setSuggestions(data.features.map(feature => feature.properties.formatted));
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
            });
    };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${searchQuery}&apiKey=9a9d20df050d4352b4eb066d5d061f49`)
            .then(response => response.json())
            .then(data => {
                const props = data.features[0].properties;
                const { lat, lon } = props;
                setPosition([lat, lon]);
                setLatitude(lat);
                setLongitude(lon);
                setAddress(props.formatted);
                map.flyTo([lat, lon], 17);
                // Pass city, lat, lng
                onLocationSelect({
                    city: props.city || props.county || props.state || props.country || props.formatted,
                    lat,
                    lng: lon
                });
            })
            .catch(error => {
                console.error('Error searching:', error);
            });
    }
};

    return (
        <div className='absolute top-4 left-4 z-[1000] flex gap-2'>
            <div className="relative">
                <input
                    type="text"
                    className="h-8 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black placeholder-gray-500"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    list="suggestions-list"
                />
                <datalist id="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <option key={index} value={suggestion} />
                    ))}
                </datalist>
            </div>
            <button
                className="h-8 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleSearch}
            >
                Search
            </button>
            {position && (
                <Marker position={position}>
                    <Popup>
                        <div className="text-sm">
                            <strong>Latitude:</strong> {latitude}<br />
                            <strong>Longitude:</strong> {longitude}<br />
                            <strong>Address:</strong> {address}
                        </div>
                    </Popup>
                </Marker>
            )}
        </div>
    );
}

function Location({ onLocationSelect }) {
    const { onOpen, onClose, isOpen } = useDisclosure();

    // Define the onLocationSelect function
    const handleLocationSelect = (address) => {
        console.log("Selected location:", address);
        onLocationSelect(address);
        // You can perform any actions with the selected address here
    };

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={[34, 9]}
                zoom={6}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Pass the onLocationSelect function to LocationMarker */}
                <LocationMarker onLocationSelect={handleLocationSelect} />
            </MapContainer>
        </div>
    );
}

export default Location;