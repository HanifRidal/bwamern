import React, { useState } from "react";
import propTypes from "prop-types";
import "./index.scss";

export default function InputSelect(props) {
  const {
    value,
    onChange,
    placeholder,
    prepend,
    append,
    options = [],
    outerClassName,
    inputClassName,
    ...rest
  } = props;

  const [HasError] = useState(null);

  return (
    <div className={["input-select mb-3", outerClassName].join(" ")}>
      <div className="input-group">
        {prepend && (
          <div className="input-group-prepend bg-gray-900">
            <span className="input-group-text">{prepend}</span>
          </div>
        )}
        <select value={value} onChange={onChange} {...rest}>
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {append && (
          <div className="input-group-append bg-gray-900">
            <span className="input-group-text">{append}</span>
          </div>
        )}
      </div>
      {HasError && <span className="error-helper">{HasError}</span>}
    </div>
  );
}

InputSelect.propTypes = {
  value: propTypes.string,
  onChange: propTypes.func,
  placeholder: propTypes.string,
  prepend: propTypes.oneOfType([propTypes.number, propTypes.string]),
  append: propTypes.oneOfType([propTypes.number, propTypes.string]),
  options: propTypes.arrayOf(propTypes.string),
  outerClassName: propTypes.string,
  inputClassName: propTypes.string,
};
