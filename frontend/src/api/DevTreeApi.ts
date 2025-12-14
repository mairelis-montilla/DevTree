import { isAxiosError } from "axios";
import api from '../config/axios' 
import type { ProfileForm, User } from "../types";

export async function getUser(){
    try{
        const {data} = await api<User>('/user')
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateProfile(formData: ProfileForm) {
    try{
        const {data} = await api.patch<string>('/user', formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function uploadImage(file: File) {
    let formData = new FormData()
    formData.append('file', file)
    try{
        const {data:{image}} : {data:{image:string}} = await api.post('/user/image', formData)
        return image
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}


export async function registerEvent(payload: { type: 'visit' | 'click', handle: string, link?: string }) {
    try {
        // CORRECCIÓN: Usamos 'api' en vez de 'axios' para que use la baseURL del backend
        const url = '/analytics'; 
        await api.post(url, payload);
    } catch (error) {
        // Error silencioso correcto para analíticas
        console.error('Error tracking event:', error);
    }
}

export async function getUserByHandle(handle: string) {
    try {
        // Al usar 'api', esto se convierte en: http://localhost:4000/api/
        const url = `/${handle}` 
        const { data } = await api.get(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function searchProfiles() {
    try {
        const url = '/search'
        const { data } = await api.get(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProfileStats() {
    try {
        const url = '/analytics/dashboard'
        const { data } = await api.get(url)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}