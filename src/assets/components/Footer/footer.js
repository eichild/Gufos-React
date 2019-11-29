import React, {Component} from 'react';
import '../../css/rodape.css'

class Footer extends Component {

  render(){
  return (
      <footer>Escola {this.props.escola} de Informática</footer>
  );
}
}
export default Footer;
