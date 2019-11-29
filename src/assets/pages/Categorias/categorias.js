import React, { Component } from 'react';
import Footer from '../../components/Footer/footer';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import Header from '../../components/Header/Header';


class Categorias extends Component {

  constructor() {
    //Usado para poder manipular os States, que são herdados de Component
    super();
    this.state = {
      lista: [],
      nome: "",
      modal: false,
      //Usamos para armazenar os dados a serem alterados
      editarModal: {
        categoriaId: "",
        titulo: ""
      },

      //Criando um estado para verificar carregamento
      loading: false,
      erroMsg: ""

    }

    //Incorporar no metodo construtor para fazer amarração com o bind
    this.cadastrarCategoria = this.cadastrarCategoria.bind(this);
  }

  //Se for true ele muda estado para false
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
    console.log("Carregado :)");
    console.log(this.state.lista);
    this.listaAtualizada();

  }
  componentDidUpdate() {
    console.log("Atualizando :D");
  }
  componentWillUnmount() {
    console.log("Saindo :C");
  }
  //FETCH É A COMUNICAÇÃO COM O BANCO
  //THEN ele é uma promise onde não precisa passar nada de async

  //GET PARA BUSCAR OS DADOS
  listaAtualizada = () => {

    //Habilita o ícone de carregando
    this.setState({ loading: true });

    fetch("http://localhost:5000/api/categoria").then(response => response.json())
      .then(listaConvertida => this.setState({ lista: listaConvertida }))
  
    //Desabilita o ícone de carregando após 2 segundos
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }

  //POST 
  cadastrarCategoria(event) {
    //Evita que a pagina seja recarregada
    event.preventDefault();

    console.log("Cadastrando");
    console.log(this.state.nome);

    fetch("http://localhost:5000/api/categoria", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      //botando o nome em string como no postman
      body: JSON.stringify({ titulo: this.state.nome })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.listaAtualizada();
        this.setState(() => ({ lista: this.state.lista }))
      })
      .catch(error => console.log(error))
  }

  //DELETE
  deletarCategoria = (id) => {
    console.log("Excluindo");

    this.setState({ erroMsg: "" })

    fetch("http://localhost:5000/api/categoria/" + id, {
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
        this.setState({ erroMsg: "Não é possivel excluir esta categoria, verifique se não há eventos que a utilizem" })
      })
  }

  //PUT
  //Acionado quando clicamos no botão editar para capturar e salvar e mudar os state atual dos dados
  alterarCategoria = (categoria) => {
    console.log(categoria);

    //Precisa passar o objeto inteiro para alterar o state, assim como o postman
    this.setState({
      editarModal: {
        categoriaId: categoria.categoriaId,
        titulo: categoria.titulo
      }
    });

    //Abrir Modal
    this.toggle();

  }

  //PUT
  salvarAlteracoes = (event) => {
    event.preventDefault();

    fetch("http://localhost:5000/api/categoria/" + this.state.editarModal.categoriaId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.editarModal)

    })
      .then(response => response.json())
      .catch(error => console.log(error))

    // Atraso na quisição, pois as requests possuem intervalos muito proximos
    setTimeout(() => {
      this.listaAtualizada();
    }, 500)

    //fechar modal
    this.toggle();
  }

  //Usado para alterar o estado do input para conseguir colocar valor nele, porque ele vai ficar estatico
  atualizaNome(input) {
    this.setState({ nome: input.target.value });
  }

  //Utilizamos para atualizar os states dos inputs dentro do modal(Evento onchange)
  atualizaEditarModalTitulo(input) {
    this.setState({
      editarModal: {
        //Setar os atributos
        categoriaId: this.state.editarModal.categoriaId,
        titulo: input.target.value

      }
    })
  }
  render() {
    const instituicao = "Fatec";
    return (
     
      <div className="Categoria">
        <Header/>
        <main className="conteudoPrincipal">
          <section className="conteudoPrincipal-cadastro">
            <h1 className="conteudoPrincipal-cadastro-titulo">Categorias</h1>
            <div className="container" id="conteudoPrincipal-lista">
              <table id="tabela-lista">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody id="tabela-lista-corpo">
                  {
                    this.state.lista.map(function (categoria) {
                      return (
                        <tr key={categoria.categoriaId}>
                          <td>{categoria.categoriaId}</td>
                          <td>{categoria.titulo}</td>
                          <td>
                            <button className="botao-alterar" onClick={e => this.alterarCategoria(categoria)}> Alterar</button>
                            <button className="botao-excluir" onClick={e => this.deletarCategoria(categoria.categoriaId)}> Excluir</button>
                          </td>
                        </tr>
                      )
                    }.bind(this))
                  }
                </tbody>
              </table>
              {/* verifica e caso haja uma mensagem de erro ele mostra abaixo da tabela */}
              {this.state.erroMsg && <div className="text-danger">{this.state.erroMsg}</div>}

              {/* Loading */}
              {this.state.loading && <i class="fas fa-spinner fa-spin fa-10x near-moon-gradient color-block-5 mb-3 mx-auto rounded-circle z-depth-1-half"></i>}
            </div>

            <div className="container" id="conteudoPrincipal-cadastro">
              <h2 className="conteudoPrincipal-cadastro-titulo">
                Cadastrar Tipo de Evento
            </h2>
              <form onSubmit={this.cadastrarCategoria}>
                <div className="container">
                  <input
                    type="text"
                    id="nome-tipo-evento"
                    placeholder="tipo do evento"
                    value={this.state.nome}
                    onChange={this.atualizaNome.bind(this)}
                  />
                  <button
                    className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                    type = "submit"
                  >
                    Cadastrar
                </button>
                </div>
              </form>

              {/* Utilizamos o modal da biblioteca para fazer o UPDATE */}
              <MDBContainer>
                {/* Abraçamos os inputs do container com um form */}
                <form onSubmit={this.salvarAlteracoes}>
                  <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Editar - {this.state.editarModal.titulo}</MDBModalHeader>
                    <MDBModalBody>

                      <MDBInput label="Categoria"
                        value={this.state.editarModal.titulo}
                        onChange={this.atualizaEditarModalTitulo.bind(this)} />

                    </MDBModalBody>
                    <MDBModalFooter>
                      {/* Incluimos o tip submit no botao para enviar formulario */}
                      <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                      <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                    </MDBModalFooter>
                  </MDBModal>
                </form>
              </MDBContainer>

            </div>
          </section>
        </main>
        <Footer escola={instituicao} />
      </div>
    );
  }
}

export default Categorias;