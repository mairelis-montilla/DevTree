import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayot";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayout/>}>
                    //Definimos las rutas
                    <Route path='/auth/login' element={<LoginView/>}/>
                    <Route path='/auth/register' element={<RegisterView/>}/>
                </Route>

                <Route path='/admin' element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>}></Route>
                    <Route path='profile' element={<ProfileView/>}></Route>
                </Route>

            </Routes>
        </BrowserRouter>
    )
}