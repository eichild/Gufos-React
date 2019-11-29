import React, { Component } from 'react';
import Footer from '../../components/Footer/footer';
import '../../css/login.css';
import Header from '../../components/Header/Header';
// import Axios from 'axios';
import { parseJwt } from '../../../services/auth';
import api from '../../../services/api';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            senha: "",

            erroMensagem: "",
            isLoading: false
        }
    }

    //Atribui para  todos os inputs para que se atualize o estado
    //Atualzia estado genérico, para que seja feito uma só vez
    atualizaEstado = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    realizarLogin = (event) => {
        event.preventDefault();

        //Toda vez que eu clicar no botão a mensagem fica vazio
        this.setState({ erroMensagem: "" });

        //Define que uma requisição está em andamento
        this.setState({ isLoading: true });

        //Decalarando objeto objeto para axios
        // let config = {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Acess-Control-Allow-Origin": "*" //Cors
        //     }
        // }
        // Axios.post("http://localhost:5000/api/login", {
        //     email: this.state.email,
        //     senha: this.state.senha
        // }, config)

        api.post("/login",{
            email: this.state.email,
            senha: this.state.senha
        })
            .then(response => {
                //Caso a requisição o status  retorne 200, salva o token no localstorage
                if (response.status === 200) {

                    //Exibe no console somente o token
                    console.log("Meu tokem é: " + response.data.token);

                    //Definimos que a requisição terminou, quando o usuario se logou
                    this.setState({ isLoading: false });
                    localStorage.setItem('usuario-gufos', response.data.token);

                    //Define base64 recebendo o payload do token
                    var base64 = localStorage.getItem('usuario-gufos').split('.')[1]

                    // exibe no console o valor de base64
                    console.log(base64)

                    //Exibe no console o valor do payload convertido para string
                    console.log(window.atob(base64))

                    //Exibe no console o valor do payload convertido para json
                    console.log(JSON.parse(window.atob(base64)))

                    //Exibe no console o tipo de usuário logado
                    console.log(parseJwt().Role)

                    if (parseJwt().Role === 'ADMINISTRADOR') {
                        this.props.history.push('/categoria')
                        // console.log("LOGADO PAPAI")
                    }else{
                        this.props.history.push('/eventos')
                    }   
                }
            })

            //Caso ocorra algum erro, define o state erroMensagem como 'E-mail ou senha inválidos'
            .catch(erro => {
                console.log("Erro: ", erro);
                this.setState({ erroMensagem: "Email ou senha inválidos!" });
                this.setState({ isLoading: false });
            })
    }

    render() {
        return (
            <div className="Login">
                <Header />
                <main>
                    <section className="container flex">
                        <div className="img__login"><div className="img__overlay"></div></div>

                        <div className="item__login">
                            <div className="row">
                                <div className="item" id="item__title">
                                    <p className="text__login" id="item__description">
                                        Bem-vindo! Faça login para acessar sua conta.
                                 </p>
                                </div>
                                <form onSubmit={this.realizarLogin}>
                                    <div className="item">
                                        <input
                                            className="input__login"
                                            placeholder="username"
                                            type="text"
                                            name="email"
                                            //Deve ser igual ao nome da variável no state para que o atualizaestado faça o trabalho
                                            value={this.state.email}
                                            onChange={this.atualizaEstado}
                                            id="login__email"
                                        />
                                    </div>
                                    <div className="item">
                                        <input
                                            className="input__login"
                                            placeholder="password"
                                            type="password"
                                            //Tem que estar com o mesmo nome de state lá em cima    
                                            name="senha"
                                            value={this.state.senha}
                                            onChange={this.atualizaEstado}
                                            id="login__password"
                                        />
                                    </div>
                                    {/* Chamando o erro aqui */}
                                    <p style={{ color: 'red' }}>{this.state.erroMensagem}</p>

                                    {
                                        this.state.isLoading === true &&
                                        <div className="item">
                                            <button type="submit" className="btn btn__login" id="btn__login" disabled>Loading</button>
                                        </div>
                                    }
                                    {
                                        this.state.isLoading === false &&
                                        <div className="item">
                                            <button type="submit" className="btn btn__login" id="btn__login">Login</button>
                                        </div>
                                    }

                                </form>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        );
    }
}

export default Login