export const getServerUrl = (path?: string) => {
	return process.env.NODE_ENV === 'production'
		? `https://api.example.com${path}`
		: `https://api.amonic.ilyacode.ru${path}`
}
