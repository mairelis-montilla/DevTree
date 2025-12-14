import { Navigate } from 'react-router-dom'
import NotFoundView from './NotFoundView'

export default function NotFoundHandler() {
    const token = localStorage.getItem('AUTH_TOKEN')

    if (!token) {
        return <Navigate to="/auth/login" replace />
    }

    return <NotFoundView />
}
