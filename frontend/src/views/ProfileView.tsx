import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '../components/ErrorMessage'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query' // <--- Agregamos useQuery
import type { ProfileForm, User } from '../types'
import { updateProfile, uploadImage, getProfileStats } from '../api/DevTreeApi' // <--- Importamos getProfileStats
import { toast } from 'sonner'
import type React from 'react'

export default function ProfileView() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!

    // --- 1. NUEVA QUERY: TRAER ESTADÍSTICAS ---
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: getProfileStats,
        refetchOnWindowFocus: false 
    })

    // Calcular totales simples
    const totalVisits = stats?.reduce((acc: number, day: any) => acc + day.visits, 0) || 0
    const totalClicks = stats?.reduce((acc: number, day: any) => acc + day.clicks, 0) || 0
    // ------------------------------------------

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        defaultValues: {
            handle: data.handle,
            description: data.description,
        }
    })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            console.log(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], (prevData: User) => {
                return {
                    ...prevData,
                    image: data
                }
            })
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            uploadImageMutation.mutate(e.target.files[0])
        }
    }

    const handleUserProfileForm = (formData: ProfileForm) => {
        const user: User = queryClient.getQueryData(['user'])!
        user.description = formData.description
        user.handle = formData.handle
        updateProfileMutation.mutate(user)
    }

    return (
        <div className="space-y-10"> {/* Envolvemos todo en un div para separar formulario de estadísticas */}
            
            <form
                className="bg-white p-10 rounded-lg space-y-5 dark:bg-slate-800 shadow-lg"
                onSubmit={handleSubmit(handleUserProfileForm)}
            >
                <legend className="text-2xl text-slate-800 text-center dark:text-white font-bold">
                    {t('profile.title')}
                </legend>

                {/* --- SECCIÓN EXTRA: ENLACE AL PERFIL PÚBLICO --- */}
                <div className="flex justify-center mb-5">
                    <a 
                        href={`/${data.handle}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyan-500 hover:text-cyan-400 font-bold underline"
                    >
                        Ver mi perfil público (Ir a /{data.handle})
                    </a>
                </div>
                {/* ----------------------------------------------- */}

                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="handle" className="dark:text-slate-300 font-bold">{t('profile.handle')}:</label>
                    <input
                        type="text"
                        className="border-none bg-slate-100 rounded-lg p-2 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                        placeholder={t('profile.handle')}
                        {...register('handle', { required: t('profile.errors.handleRequired') })}
                    />
                    {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="description" className="dark:text-slate-300 font-bold">{t('profile.description')}:</label>
                    <textarea
                        id="description"
                        className="border-none bg-slate-100 rounded-lg p-2 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                        placeholder={t('profile.description')}
                        {...register('description', { required: t('profile.errors.descriptionRequired') })}
                    />
                    {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="image" className="dark:text-slate-300 font-bold">{t('profile.image')}:</label>
                    <input
                        id="image"
                        type="file"
                        className="border-none bg-slate-100 rounded-lg p-2 dark:bg-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-500 transition-colors dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-600"
                    value={t('common.save')}
                />
            </form>

            {/* --- SECCIÓN NUEVA: ESTADÍSTICAS --- */}
            <div className="bg-white p-10 rounded-lg dark:bg-slate-800 shadow-lg border-t-4 border-cyan-500">
                <h3 className="text-2xl text-slate-800 text-center dark:text-white font-bold mb-5">
                    Estadísticas de tu Perfil
                </h3>

                {statsLoading ? (
                    <p className="text-center dark:text-slate-300">Cargando datos...</p>
                ) : (
                    <div className="space-y-5">
                        {/* Tarjetas de Resumen */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg text-center">
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">Visitas Totales</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-white">{totalVisits}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg text-center">
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">Clicks en Enlaces</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-white">{totalClicks}</p>
                            </div>
                        </div>

                        {/* Tabla simple (solo si hay datos) */}
                        {stats && stats.length > 0 && (
                             <div className="overflow-x-auto mt-5">
                                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3">Fecha</th>
                                            <th className="px-6 py-3">Visitas</th>
                                            <th className="px-6 py-3">Clicks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.map((day: any) => (
                                            <tr key={day._id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                                                <td className="px-6 py-4">{day._id}</td>
                                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{day.visits}</td>
                                                <td className="px-6 py-4">{day.clicks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        )}
                        
                        {(!stats || stats.length === 0) && (
                             <p className="text-center text-slate-400 text-sm">Aún no tienes visitas. ¡Comparte tu enlace!</p>
                        )}
                    </div>
                )}
            </div>
            {/* ----------------------------------- */}

        </div>
    )
}