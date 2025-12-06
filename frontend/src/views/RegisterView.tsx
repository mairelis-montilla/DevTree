import { Link } from "react-router-dom";
import {useForm} from 'react-hook-form';
import {isAxiosError} from 'axios'
import {toast} from 'sonner'
import { useTranslation } from 'react-i18next'
import type {RegisterForm} from '../types';
import ErrorMessage from '../components/ErrorMessage';
import api from '../config/axios'

export default function RegisterView(){
    const { t } = useTranslation()

    const initialValues: RegisterForm = {
        name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: '',
    }

    //Reglas de validación y mostrar errores:
    const {register, watch, reset, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})

    //console.log(errors)

    const password = watch('password')

    const handleRegister = async (formData: RegisterForm) => {
              
        try{
            const {data} = await api.post(`/auth/register`, formData)
            //console.log(data)
            toast.success(data)
            reset()
        }catch(error){
            if(isAxiosError(error) && error.response){
                toast.error(error.response?.data.error)
            }
        }
    }

    return(
        <>
            <h1 className="text-center text-4xl text-white font-bold">{t('auth.register.title')}</h1>

            <form 
                onSubmit={handleSubmit(handleRegister)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10 max-w-md mx-auto"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">{t('auth.register.name')}</label>
                    <input
                        id="name"
                        type="text"
                        placeholder={t('auth.register.name')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                        {...register('name', {
                            required: t('auth.register.errors.nameRequired')
                        })}
                    />
                    {errors.name && (
                        <ErrorMessage>
                            {errors.name.message}
                        </ErrorMessage>
                    )}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">{t('auth.register.email')}</label>
                    <input
                        id="email"
                        type="email"
                        placeholder={t('auth.register.email')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                        {...register('email', {
                            required: t('auth.register.errors.emailRequired'),
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: t('auth.register.errors.emailInvalid')
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>
                            {errors.email.message}
                        </ErrorMessage>
                    )}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">{t('auth.register.handle')}</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder={t('auth.register.handle')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                        {...register('handle', {
                            required: t('auth.register.errors.handleRequired')
                        })}
                    />
                    {errors.handle && (
                        <ErrorMessage>
                            {errors.handle.message}
                        </ErrorMessage>
                    )}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">{t('auth.register.password')}</label>
                    <input
                        id="password"
                        type="password"
                        placeholder={t('auth.register.password')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                        {...register('password', {
                            required: t('auth.register.errors.passwordRequired'),
                            minLength: {
                                value: 8,
                                message: t('auth.register.errors.passwordShort')
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>
                            {errors.password.message}
                        </ErrorMessage>
                    )}
                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">{t('auth.register.passwordConfirm')}</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder={t('auth.register.passwordConfirm')}
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"

                        {...register('password_confirmation', {
                            required: t('auth.register.errors.passwordConfirmRequired'),
                            validate: (value) => value == password || t('auth.register.errors.passwordMismatch')
                        })}
                    />
                    {errors.password_confirmation && (
                        <ErrorMessage>
                            {errors.password_confirmation.message}
                        </ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value={t('auth.register.submit')}
                />
            </form>

            <nav className="mt-10">
                <Link className="text-center text-white text-lg block" to="/auth/login">
                    {t('auth.register.hasAccount')} {t('auth.register.loginHere')}
                </Link>
            </nav>
        </>
    )
}