import Cookies from 'js-cookie'

import { EnumTokens } from './auth.service'

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	console.log('Retrieved access token:', accessToken);
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	const domain = import.meta.env.VITE_NODE_ENV === "production"
		? '176.124.218.145'
		: 'localhost';

	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: domain,
		sameSite: 'strict',
		secure: import.meta.env.VITE_NODE_ENV === "production",
		expires: 1,
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
