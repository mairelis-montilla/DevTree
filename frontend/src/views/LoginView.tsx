import {Link,useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import type { LoginForm } from '../types'
import api from '../config/axios'
import {toast} from 'sonner'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

export default function LoginView(){
    const { t } = useTranslation()
    const navigate = useNavigate()
    
    const initialValues : LoginForm = {
        email: '',
        password: '',
    }

    //Reglas de validación y mostrar errores:
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})

    const handleLogin = async (formData: LoginForm) => {
        try{
            const {data} = await api.post(`/auth/login`, formData)
            localStorage.setItem('AUTH_TOKEN', data.token)
            toast.success(data.message || 'Login exitoso')
            navigate('/admin')
        }catch(error){
            if(isAxiosError(error) && error.response){
                toast.error(error.response?.data.error)
            }
        }
    }

    return(
        <>
            <h1 className="text-center text-4xl text-white font-bold">{t('auth.login.title')}</h1>

            <form
                onSubmit={handleSubmit(handleLogin)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10 max-w-md mx-auto"
                noValidate
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">{t('auth.login.email')}</label>
                    <input
                        id="email"
                        type="email"
                        placeholder={t('auth.login.email')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register("email", {
                            required: t('auth.login.errors.emailRequired'),
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: t('auth.login.errors.emailInvalid'),
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">{t('auth.login.password')}</label>
                    <input
                        id="password"
                        type="password"
                        placeholder={t('auth.login.password')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register("password", {
                            required: t('auth.login.errors.passwordRequired'),
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value={t('auth.login.submit')}
                />
            </form>

            <nav className="mt-10">
                <Link className="text-center text-white text-lg block" to="/auth/register">
                    {t('auth.login.noAccount')} {t('auth.login.createAccount')}
                </Link>
            </nav>
        </>
    )
}