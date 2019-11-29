import React, { Component } from 'react';
import Footer from '../../components/Footer/footer';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import Header from '../../components/Header/Header';
import api from '../../../services/api';


class Eventos extends Component {

    //Usado para criar nossas states
    constructor() {
        //Usado para poder manipular os States, que são herdados de Component
        super();
        this.state = {
            // Definimos uma lista inicial vazia
            listaEventos: [],
            listaCategorias: [],
            listaLocalizacao: [],
            // Pegar input do form de Cadastro
            // nome: "",
            // dataEvento: "",
            // acessoLivre: "",
            // nomeCategoria: "",
            // localizacao: "",
            // MDB
            modal: false,
            // Usamos para armazenar os dados a serem alterados
            editarModal: {
                eventoId: "",
                titulo: "",
                dataEvento: "",
                acessoLivre: "",
                categoriaId: "",
                idLocal: ""

            },

            // Criando um estado para verificar carregamento
            loading: false,

            erroMsg: ""

        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    UNSAFE_componentWillMount() {
        document.title = this.props.titulo_pagina;
        console.log("Carregando");
    }

    componentDidMount() {
        console.log("Carregado");
        console.log(this.state.lista);
        this.getEventos();
        this.getCategorias();
        this.getLocalizacao();

    }

    componentDidUpdate() {
        console.log("Atualizando");
    }

    componentWillUnmount() {
        console.log("Saindo");
    }
  

    // GET - Listar
    getEventos = () => {
        //Habilita o icone de carregando - Spinner
        this.setState({ loading: true });

        api.get("/evento")
        .then(response =>{
            if (response.status === 200) {
                this.setState({listaEventos : response.data})
            }
        })
    }

    getCategorias = () =>{

    }

    getLocalizacao = () =>{

    }

    // POST - Cadastrar
    cadastrarEvento(event) {
        // Impede que a página seja recarregada
        event.preventDefault();
        console.log("Cadastrando");
        console.log(this.state.nome);

        fetch("http://localhost:5000/api/evento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: this.state.nome,
                dataEvento: this.state.dataEvento,
                acessoLivre: this.state.acesso,
                categoriaId: this.state.nomecategoria
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.listaAtualizada();
                // this.setState(() => ({ lista: this.state.lista }))
            })
            .catch(error => console.log(error)
            )
    }

    // DELETE - Deletar categoria
    deletarEvento = (id) => {
        console.log(id);

        this.setState({ erroMsg: "" })

        fetch("http://localhost:5000/api/evento/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.listaAtualizada();
            })
            .catch(error => {
                console.log(error);
                this.setState({ erroMsg: "Não é possível excluir esta evento." })
            })
    }

    // Acionado quando clicamos no botão editar para capturar e salvar no state os dados atuais
    alterarEvento = (evento) => {
        console.log(evento);

        this.setState({
            editarModal: {
                eventoId: evento.eventoId,
                titulo: evento.titulo,
                dataEvento: evento.dataEvento,
                acessoLivre: evento.acessoLivre,
                categoriaId: evento.categoriaId

            }
        })
        //Abrir modal
        this.toggle();
    }

    // UPDATE - Atualiza a categoria - Alterar
    salvarAlteracoes = (event) => {
        // Previne que a página seja recarregada
        event.preventDefault();
        fetch("http://localhost:5000/api/evento/" + this.state.editarModal.eventoId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.editarModal)
        })
            .then(response => response.json())
            .catch(error => console.log(error))

        // Atraso na requisição, pois as requests possuem intervalos muito próximos
        setTimeout(() => {
            this.listaAtualizada();
        }, 1000);

        //Fechar modal
        this.toggle();
    }

    // Utilizamos para poder alterar o input de Cadastro
    atualizaNome(input) {
        this.setState({ nome: input.target.value })
    }

    atualizaEstado = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Utilizamos para atualizar os states dos inputs dentro do Modal
    atualizaEditarModal(input) {
        this.setState({
            editarModal: {
                eventoId: this.state.editarModal.categoriaId,
                titulo: input.target.value,
                dataEvento: input.target.value,
                acessoLivre: input.target.value,
                categoriaId: input.target.value
            }
        })
    }

    render() {
        return (
            <div>
            <Header/>
                <main className="conteudoPrincipal">
                    <section className="conteudoPrincipal-cadastro">
                        <h1 className="conteudoPrincipal-cadastro-titulo">Eventos</h1>
                        <div className="container" id="conteudoPrincipal-lista">
                            <table id="tabela-lista">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Evento</th>
                                        <th>Data</th>
                                        <th>Acesso Livre</th>
                                        <th>Tipo do Evento</th>
                                        <th>Localização</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody id="tabela-lista-corpo">
                                    {
                                        this.state.listaEventos.map(function (evento) {
                                            return (
                                                <tr key={evento.eventoId}>
                                                    <td>{evento.eventoId}</td>
                                                    <td>{evento.titulo}</td>
                                                    <td>{evento.dataEvento}</td>
                                                    <td>
                                                        {evento.acessoLivre && "Livre"}
                                                        {!evento.acessoLivre && "Restrito"}
                                                    </td>
                                                    <td>{evento.categoria.titulo}</td>
                                                    <td>{evento.localizacao.endereco}</td>
                                                    <td>Localização</td>
                                                    <td>
                                                        <button onClick={e => this.alterarEvento(evento)}>Alterar</button>
                                                        <button onClick={e => this.deletarEvento(evento.eventoId)}>Excluir</button>
                                                    </td>
                                                </tr>
                                            )
                                        }.bind(this))
                                    }
                                </tbody>

                            </table>
                        </div>

                        <form onSubmit={this.cadastrarEvento}>
                            <div className="container" id="conteudoPrincipal-cadastro">
                                <h2 className="conteudoPrincipal-cadastro-titulo">Cadastrar Evento</h2>
                                <div className="container">
                                    <input type="text" id="evento__titulo" placeholder="título do evento" name="name" onChange={this.atualizaEstado} />
                                    <input type="date" id="evento__data" placeholder="dd/MM/yyyy" name="dataEvento" onChange={this.atualizaEstado} />
                                    <select id="option__acessolivre" name="acessoLivre" onChange={this.atualizaEstado}>
                                        <option value="1">Livre</option>
                                        <option value="0">Restrito</option>
                                    </select>
                                    <select id="option__tipoevento">
                                        {
                                            this.state.lista.map(function(evento) {
                                                return (
                                                    <option value="0" key={evento.categoriaId}>{evento.listaAtualizadaCategoria}</option>
                                                )
                                            })
                                        }
                                    </select>

                                    <select id="option__endereco">

                                    </select>
                                </div>
                                <button className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro" type="submit"> Cadastrar</button>
                            </div>
                        </form>

                        {/* Utilizamos o Modal da biblioteca para fazer o UPDATE */}
                        <MDBContainer>
                            {/* Abraçamos os inputs do container com um form, para conseguirmos usar/capturar o evento onSubmit */}
                            <form onSubmit={this.salvarAlteracoes}>
                                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                    <MDBModalHeader toggle={this.toggle}>Editar - {this.state.editarModal.titulo}</MDBModalHeader>
                                    <MDBModalBody>
                                        <MDBInput label="Titulo" value={this.state.editarModal.titulo} onChange={this.atualizaEditarModal.bind(this)} />
                                        <MDBInput type="date" label="Data" value={this.state.editarModal.dataEvento} onChange={this.atualizaEditarModal.bind(this)} />
                                        <select className="browser-default custom-select" value={this.state.editarModal.acessoLivre} onChange={this.atualizaEditarModal.bind(this)}>
                                            <option value="0">Sim</option>
                                            <option value="1">Não</option>
                                        </select><br></br>
                                        <select className="browser-default custom-select" value={this.state.editarModal.categoriaIdNavigation}>
                                            {
                                                this.state.lista.map(function (evento) {
                                                    return (
                                                        <option key={evento.categoriaId} disabled>{evento.categoria.titulo}</option>
                                                    )
                                                })
                                            }
                                        </select><br></br>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                                        {/* Incluimos o tipo submit no botão para enviar o formulário */}
                                        <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                            </form>
                        </MDBContainer>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Eventos;