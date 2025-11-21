type ErrorMessageProps = {
    children: React.ReactNode
}

export default function ErrorMessage({children}: ErrorMessageProps){
    return(
        <p className="bg-red-50 text-red-600 p-3 uppercase text-sm font-bold text-center">{children}</p>
    )
}

/*
    <ErrorMessage>El correo es obligatorio</ErrorMessage>

    function ErrorMessage({children}){
        return(
            <div style={{color: 'red', fontSize: {children}}}
        )
    }
    export default ErrorMessage;

    <div style="color: red; fontSize: 14px;">
        Este campo es obligatorio
    </div>

*/