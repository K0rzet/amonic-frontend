export const getServerUrl = (path?: string) => {
	return process.env.NODE_ENV === 'production'
		? `https://api.example.com${path}`
		: `http://176.124.218.145:2224${path}`
}
