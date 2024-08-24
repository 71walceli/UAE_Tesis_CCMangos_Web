import React, { ChangeEvent, ReactNode, useState, forwardRef } from "react";
import { Uploader, UploaderProps } from "rsuite";

import { RequiredMark } from "./RequiredMark";

interface InputProps<T extends string | number> {
  type?: string;
  bclass?: string;
  placeholder?: string;
  label?: ReactNode;
  value?: string | number;
  onChange?: (value: T) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  accept?: string; // Nueva propiedad para especificar tipos de archivo aceptados
  disabled: boolean,
  readonly: boolean,
  maxlength: number,
}

export function Input<T>({
  type = "text",
  placeholder,
  bclass,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  accept, // Añade accept a las props
  disabled,
  readonly,
  maxlength,
  required = false,
  lines = 3,
  ...props
}: InputProps<string | number>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    if (onChange) {
      const typedValue = event.target.value as unknown as T;
      if (typeof typedValue === "string" || typeof typedValue === "number") {
        onChange(typedValue);
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const stringProps = {
    maxlength,
    placeholder,
  }
  const commonProps = {
    className: bclass || "form-control",
    readonly: readonly,
    disabled,
    type,
    value: value === undefined ? "" : value,
    onChange: handleChange,
    onBlur: onBlur,
    onFocus: onFocus,
  }

  return (
    <div style={{ ...props.style }}>
      {type === "checkbox" 
        ?(
          <div style={{ display: "flex", alignItems: "center" }}>
            <input {...stringProps} {...commonProps} />
            {label && <label style={{ marginLeft: "5px" }} htmlFor="checkbox">
              {label} {required && <RequiredMark />}
            </label>}
          </div>
        ):(
          <>
            {label && <label className="form-label">
              {label} {required && <RequiredMark />}
            </label>}
            {type === "password"
              ?(<div style={{ display: "flex", ...props.style }}>
                <input
                  {...stringProps}
                  {...commonProps}
                  type={showPassword ? "text" : "password"}
                />
                <div className="password-toggle" onClick={handleTogglePassword}>
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye-fill"></i>
                  )}
                </div>
              </div>
              ):(
                type === "textarea" ? (
                  // Utiliza la propiedad 'accept' para especificar los tipos de archivo aceptados
                  <textarea style={{...props.style}} cols={lines}
                    {...stringProps}
                    {...commonProps}
                  />
                ) : (
                  <input style={{...props.style}}
                    {...stringProps}
                    {...commonProps}
                  />
                )
              )}
          </>
        )
      }
    </div>
  );
}

export const UploaderInput = forwardRef(({
  accept, required = false, autoUpload = false, name, value, onChange, label, ...props
}: UploaderProps, ref) => {
  value = value || [];

  return <div>
    <div style={{ display: "flex", alignItems: "stretch", flexDirection: "column", gap: 20 }}>
      {label && <label style={{ marginLeft: "5px" }} htmlFor="checkbox">
        {label} {required && <RequiredMark />}
      </label>}
      <Uploader {...props} 
        ref={ref} // Pass ref here
        style={{ width: "100%" }}
        name={name}
        accept={accept} autoUpload={autoUpload} fileList={value} onChange={onChange} 
        onUpload={() => {}}
      >
        <div style={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px dashed #e5e5ea',
          backgroundColor: '#80808080',
          cursor: 'pointer',
        }}>
          <span>Click or Drag files to this area to upload</span>
        </div>
      </Uploader>
    </div>
  </div>
}
);
