import {useForm} from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProfileForm, User } from '../types'
// import { use } from 'react'
import { updateProfile } from '../api/DevTreeApi'
import { toast } from 'sonner'

export default function ProfileView() {

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
            toast.success(data) // esto es un toast de sonner
            queryClient.invalidateQueries({queryKey: ['user']})
            console.log(data)
        }
    })

    const handleUserProfileForm = (formData: ProfileForm) => {
        updateProfileMutation.mutate(formData)
    }

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle', {required: 'El handle es obligatorio'})}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    id = "description"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description', {
                        required: 'La descripción es obligatoria',
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={ () => {} }
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}