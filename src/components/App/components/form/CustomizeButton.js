import { Component } from "react"

class CustomizeButton extends Component {
  //agrs: type, className, onClick(), text
    render() {
        return(
            <button
              type={this.props.type}
              className={this.props.className}
              onClick={() => this.props.onClick()}
              style={{ width: 140 }}
            >
              {this.props.text}
            </button>
        );
    }
}

export default CustomizeButton;