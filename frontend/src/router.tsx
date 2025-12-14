import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayot";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
import HandleView from "./views/HandleView"; 
import HomeView from "./views/HomeView";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomeView />} />
                {/* Rutas de Autenticación y Registro */}
                <Route element={<AuthLayout/>}>
                    <Route path='/auth/login' element={<LoginView/>}/>
                    <Route path='/auth/register' element={<RegisterView/>}/>
                </Route>

                {/* Rutas de Administración (Panel Privado) */}
                <Route path='/admin' element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>}/>
                    <Route path='profile' element={<ProfileView/>}/>
                </Route>

                {/* RUTA PÚBLICA */}
                
                <Route path='/:handle' element={<HandleView />} />

            </Routes>
        </BrowserRouter>
    )
}