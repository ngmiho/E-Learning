import { Component } from "react";

class CustomizeCheckbox extends Component {
  //agrs: label, type, variable, onChange()
  render() {
    return (
      <div className="form-check mb-3">
        <label className="form-label">{this.props.label}</label>
        <input
          type="checkbox"
          onChange={() => this.props.onChange()}
          checked={this.props.value}
          className="form-check-input"
        />
      </div>
    );
  }
}

export default CustomizeCheckbox;