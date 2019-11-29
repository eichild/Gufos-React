//Define a constante usuarioAutenticado que verifica se há um token no localstorage
export const usuarioAutenticado =() => localStorage.getItem('usuario-gufos') !== null

//Define a constante parseJWT
//que define a variavel base46, que rcebe o payload do token
export const parseJwt = () =>{
    var base64 = localStorage.getItem('usuario-gufos').split('.')[1]

    //Converter o payload convertido de base64 para string e depois para JSON
    return JSON.parse(window.atob(base64));
}