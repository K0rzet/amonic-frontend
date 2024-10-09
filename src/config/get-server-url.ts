export const getServerUrl = (path?: string) => {
	return process.env.NODE_ENV === 'production'
		? process.env.API_URL
		: `http://localhost:4200${path}`
}
