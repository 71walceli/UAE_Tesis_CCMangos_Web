import React from "react";
import { Form, FormControl } from "react-bootstrap";

import { Input } from "./InputCustom";
import { SelectSearch } from "./SelectSearch";
import { Message } from "rsuite";


interface FormField<T> {
  name: string;
  disabled: boolean,
  readonly: boolean,
  label?: string;
  inputType?: "text" | "select" | "checkbox"| "password"|"file"; // Agregar más tipos si es necesario
  bclass?: string;
  placeholder?: string;
  value: T;
  onChange: (value: T) => void;
  options?: { value: T; label: string }[]; // Opciones para selects
}

interface GenericFormProps {
  fields: FormField<any>[];
  showSubmit?: boolean;
  onSubmit: () => void;
  accept?: string;
  manager?: any;
}

export const GenericForm = ({ fields, onSubmit, showSubmit=true, accept='*', manager}: GenericFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        {fields.map((field) => {
          const commonProps = {
            disabled: field.disabled,
            label: field.label,
            value: field.value,
            onChange: field.onChange,
          }

          return (
            <div key={field.name} className="form-group">
              {field.tips 
                ?<Message>{field.tips}</Message>
                :null
              }
              {["text", "password", "number", "email"].includes(field.inputType) || !field.inputType ? ( // Usar "text" por defecto
                <Input
                  {...field}
                  {...commonProps}
                  type={field.inputType}
                  bclass={field.bclass}
                />
              ) : field.inputType === "select" && field.options ? (
                <SelectSearch
                  {...commonProps}
                  bclass={field.bclass}
                  options={field.options}
                />
              ) : field.inputType === 'checkbox' ? (
                <Form.Check
                  {...field}
                  {...commonProps}
                  bclass={field.bclass}
                  checked={Boolean(field.value)}
                  onChange={() => field.onChange(!field.value)} 
                />
              ) : field.inputType === 'file' ? (
                <Input
                  {...field}
                  {...commonProps}
                  accept={accept}
                  type={field.inputType}
                  bclass={field.bclass}
                />
              ) : field.inputType === 'date' ? (
                <Form.Group>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control 
                  type="date"
                  {...field}
                  {...commonProps}
                  onChange={(event) => commonProps.onChange(event.target.value)}
                  bclass={field.bclass}
                />
                </Form.Group>
              ) : (
                // Renderizar otros tipos de entradas aquí
                <div>Entrada de tipo desconocido</div>
              )}
              {manager?.errors?.[field.name]
                ?<div className="form-error invalid-feedback d-block px-2">{manager.errors[field.name]}</div>
                :null
              }
            </div>
          );
        })}
      </div>
      <div className="row">
        {showSubmit && (
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-rocket-takeoff"></i> Enviar
          </button>
        )}
      </div>
    </form>
  );
};
