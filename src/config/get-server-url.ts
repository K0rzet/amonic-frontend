export const getServerUrl = (path?: string) => {
	return import.meta.env.VITE_NODE_ENV === 'production'
		? import.meta.env.VITE_API_URL
		: `http://localhost:4200${path}`
}
