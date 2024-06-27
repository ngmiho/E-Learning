const CustomizeInputField = (props) => {
  return (
    <div className="mb-3">
      <label className="form-label">{props.label}</label>
      <input
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        className="form-control"
        disabled={props.disabled || null}
      />
    </div>
  );
};

export default CustomizeInputField;