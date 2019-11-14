import React, { Component } from 'react';
import Footer from '../../components/Footer/footer'
//Ciclo de vida, importar ciclo de vida
import {Link} from "react-router-dom";

class Categorias extends Component {

  constructor(){
    super();
    this.state = {
      lista: [],
        nome: ""
      
    }
    //Incorporar no metodo construtor para fazer amarração com o bind
    this.cadastrarCategoria = this.cadastrarCategoria.bind(this);
  }
  
  UNSAFE_componentWillMount(){
    document.title = this.props.titulo_pagina;
    console.log("Carregando");
  }
  componentDidMount(){
    console.log("Carregado :)");
    console.log(this.state.lista);
    this.listaAtualizada();

  }
  componentDidUpdate(){
    console.log("Atualizando :D");
  }
  componentWillUnmount(){
    console.log("Saindo :C");
  }
  //FETCH É A COMUNICAÇÃO COM O BANCO
  //THEN ele é uma promise onde não precisa passar nada de async
  listaAtualizada = () =>{
    fetch("http://localhost:5000/api/categoria").then(response => response.json())
    .then(listaConvertida => this.setState({lista : listaConvertida}))
  }

  cadastrarCategoria(event) {
    event.preventDefault();
    console.log("Cadastrando");
    console.log(this.state.nome);

    //fetch d post
    fetch("http://localhost:5000/api/categoria",{
      method: "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      //botando o nome em string como no postman
      body : JSON.stringify({titulo : this.state.nome})
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      this.listaAtualizada();
      this.setState(() => ({lista : this.state.lista}))
    })
    .catch(error => console.log(error))
  }

  atualizaNome(input){
    this.setState({nome : input.target.value});
  }
  render() {
    const instituicao = "Fatec";
    return (
      <div className="Categoria">
        <main className="conteudoPrincipal">

          <Link to="/">Voltar</Link>

          <section className="conteudoPrincipal-cadastro">
            <h1 className="conteudoPrincipal-cadastro-titulo">Categorias</h1>
            <div className="container" id="conteudoPrincipal-lista">
              <table id="tabela-lista">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                  </tr>
                </thead>

                <tbody id="tabela-lista-corpo">
                  {
                    this.state.lista.map(function(categoria){
                      return(
                        <tr key={categoria.categoriaId}>
                          <td>{categoria.categoriaId}</td>
                          <td>{categoria.titulo}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
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
                  >
                    Cadastrar
                </button>
                </div>
              </form>
            </div>
          </section>
        </main>
        <Footer escola= {instituicao}/>
      </div>
    );
  }
}

export default Categorias;