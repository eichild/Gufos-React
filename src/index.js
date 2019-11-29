import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './assets/pages/Home/App';
//Import de Categorias
import Categorias from './assets/pages/Categorias/categorias';
import Eventos from './assets/pages/Eventos/eventos';
import Login from './assets/pages/Login/login';
import NotFound from './assets/pages/NotFound/notFound'

import * as serviceWorker from './serviceWorker';
//Import da rota no browser
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './assets/css/flexbox.css';
import './assets/css/reset.css';
import './assets/css/style.css';
// import './assets/img';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { usuarioAutenticado, parseJwt } from './services/auth';

const PermissaoAdmin=({component : Component}) =>(
    <Route
        render={props =>
        usuarioAutenticado() && parseJwt().Role === "ADMINISTRADOR" ? (
            <Component {...props}/>
        ):(
            <Redirect to ={{pathname: "/login"}}/>
        )
    }
    />
)

const PermissaoAluno=({component : Component}) =>(
    <Route
        render={props =>
        usuarioAutenticado() && parseJwt().Role === "ALUNO" ? (
            <Component {...props}/>
        ):(
            <Redirect to ={{pathname: "/login"}}/>
        )
    }
    />
)

//Variavel para criação das rotas
const routes = (
    //Router renderiza
    <Router>
        <div>
            {/* //Separação de rotas, colocando cada um em uma janela */}
            <Switch>
                <Route exact path="/" component={App} />
                <PermissaoAdmin path="/categoria" component={Categorias} />
                <PermissaoAluno path= "/eventos" component={Eventos }/>
                <Route path= "/login" component= {Login}/>
                <Route component={NotFound} />
            </Switch>
        </div>
    </Router>
);
//Renderizar todas as rotas
ReactDOM.render(routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
