import React, { Component } from 'react';
import Logo from '../../img/icon-login.png';
import '../../css/cabecalho.css';
// Para utilizar o Link é necessário importa-lo
import { Link , withRouter} from 'react-router-dom';
import { usuarioAutenticado, parseJwt } from '../../../services/auth';

class Header extends Component {
    logout = () => {
        // Remove o token do localStorage
        localStorage.removeItem("usuario-gufos");

        // Redireciona para o endereço '/'
        this.props.history.push("/");
    }

    render() {
        return (
            <header className="cabecalhoPrincipal">
                <div className="container">
                    <img src={Logo} alt="Logo do site." />

                    <nav className="cabecalhoPrincipal-nav">
                        <Link to="/">Home</Link>

                        {usuarioAutenticado() && parseJwt().Role === "ADMINISTRADOR" ? (
                            // Se o usuário for admnistrador
                            <>
                                <Link to="/categoria">Categorias</Link>
                                <a onClick={this.logout}>Sair</a>
                            </>
                        ) : (
                                usuarioAutenticado() && parseJwt().Role === "ALUNO" ? (
                                    // Se o usuário for Aluno
                                    <React.Fragment>
                                        <Link to="/eventos">Eventos</Link>
                                        <a onClick={this.logout}>Sair</a>
                                    </React.Fragment>
                                ) : (
                                        // Se o usuário não estiver logado
                                        <React.Fragment>
                                            <Link className="cabecalhoPrincipal-nav-login" to="/login">Login</Link>
                                        </React.Fragment>
                                    )
                            )}
                        {/* ? == if */}
                        {/* : == else */}


                        {/* Referenciando os links, aqueles que foram definidos no index.js */}
                    </nav>
                </div>
            </header>
        );
    }
}

export default withRouter(Header); // Conserta erros de rediriecionamento entre componentes.