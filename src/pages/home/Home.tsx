import { useProfile } from '@/hooks/useProfile'
import { ProfileInfo } from './ProfileInfo'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
	const navigate = useNavigate()
	const { user } = useProfile() 

	useEffect(() => {
		if (user?.roleid === 1) {
			navigate('/admin')
		} else if (user?.roleid === 2) {
			navigate('/sessions')
		}
	}, [user, navigate])

	return (
		<div>
			<h1 className="mt-4">Home Page</h1>
			<p>(only for loggedIn user)</p>
			<br />
			<p>Для проверки прав, есть страницы: /premium, /admin, /manager</p>

			<ProfileInfo />
		</div>
	)
}
