import {useForm} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '../components/ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProfileForm, User } from '../types'
// import { use } from 'react'
import { updateProfile, uploadImage } from '../api/DevTreeApi'
import { toast } from 'sonner'
import type React from 'react'

export default function ProfileView() {
    const { t } = useTranslation()

    // const {data, isLoading, isError} = useQuery({
    //     //vamos a pasar algunas configuraciones
    //     queryFn: getUser, //qué funcion va a hacer la consulta hacia nuestra api
    //     queryKey: ['user'], //reactquery identifica el query del getuser y debe ser único para cada consulta
    //     retry: 1, //cuantas veces queremos que react intente la conexión
    //     refetchOnWindowFocus: false //no queremos que se hagan más consultas si cambiamos de pestaña
    // })
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!
    console.log(data)

    const {register, handleSubmit, formState: {errors}} = useForm<ProfileForm>({defaultValues: 
        {
            handle: data.handle,
            description: data.description,
        }})

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError:(error) => {
            console.log(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
            console.log(data)
        }
    })
    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError:(error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            //console.log(data);
            //Optimisctic Updates
            queryClient.setQueryData(['user'],(prevData:User)=>{
                return{
                    ...prevData,
                    image: data
                }
            })
            //permite modificar los objetos cacheados, no espera a que se invalide los queries,
            //si no que se escribe el objeto que esta en memoria, dandole un comportamiento mas rapido
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){//puede ser que el usuario haga el cambio pero no suba el archivo
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
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">{t('profile.title')}</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >{t('profile.handle')}:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder={t('profile.handle')}
                    {...register('handle', {required: t('profile.errors.handleRequired')})}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >{t('profile.description')}:</label>
                <textarea
                    id = "description"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder={t('profile.description')}
                    {...register('description', {
                        required: t('profile.errors.descriptionRequired'),
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >{t('profile.image')}:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value={t('common.save')}
            />
        </form>
    )
}