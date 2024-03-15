import React, { ChangeEvent, ReactNode, useState } from "react";

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

  const commonProps = {
    className: bclass || "",
    readonly: readonly,
    disabled,
    type,
    placeholder,
    value: value === undefined ? "" : value,
    onChange: handleChange,
    onBlur: onBlur,
    onFocus: onFocus,
  }

  return (
    <div>
      {type === "checkbox" ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input {...commonProps} />
          {label && <label style={{ marginLeft: "5px" }} htmlFor="checkbox">{label}</label>}
        </div>
      ) : (
        <>
          {label && <label className="form-label">{label}</label>}
          {type === "password" ? (
            <div style={{ display: "flex" }}>
              <input
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
          ) : (
            type === "file" ? (
              // Utiliza la propiedad 'accept' para especificar los tipos de archivo aceptados
              <input
                {...commonProps}
                accept={accept} // Usa la propiedad 'accept' aquí
                onChange={(event) => {
                  if (onChange) {
                    const typedValue = event.target.files;
                    onChange(typedValue as unknown as T);
                  }
                }}
              />
            ) : (
              <input
                {...commonProps}
              />
            )
          )}
        </>
      )}
    </div>
  );
}
