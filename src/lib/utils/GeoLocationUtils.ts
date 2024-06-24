import type { GeoLocationCoords } from '$lib/types/GeoLocation';
import { get } from 'svelte/store';
import { locale } from '../../i18n';

export async function getLocation() {
	const dataLocation: GeoLocationCoords = {
		latitude: 0,
		longitude: 0,
		accuracy: 0
	};
	const position: GeolocationPosition = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	dataLocation.longitude = position.coords.longitude;
	dataLocation.latitude = position.coords.latitude;
	dataLocation.accuracy = position.coords.accuracy;
	return dataLocation;
}

export async function getLocationCity(coordsLocation: GeoLocationCoords) {
	validateCoords(coordsLocation);
	const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
	let locationString;
	const params = new URLSearchParams({
		latitude: coordsLocation.latitude.toString(),
		longitude: coordsLocation.longitude.toString(),
		localityLanguage: get(locale)
	});
	const response = await fetch(`${url}?${params}`);
	if (response.status === 200) {
		const body = await response.json();
		if (body.city && body.countryCode) {
			locationString = body.city + ', ' + body.countryCode;
		} else {
			locationString = '';
		}

		return locationString;
	} else {
		return '';
	}
}

export function validateCoords(geoLocation: GeoLocationCoords) {
	if (geoLocation.latitude > 90 || geoLocation.latitude < -90) {
		throw new Error('Invalid latitude');
	}
	if (geoLocation.longitude > 180 || geoLocation.longitude < -180) {
		throw new Error('Invalid longitude');
	}
	geoLocation.accuracy = Math.round(geoLocation.accuracy);
}
