import React from "react";
import { Input } from "./InputCustom";
import { SelectSearch } from "./SelectSearch";
import Select from 'react-select'
import { Form } from "react-bootstrap";


interface FormField<T> {
  name: string;
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
}

export const GenericForm = ({ fields, onSubmit, showSubmit = true, accept='*' }: GenericFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        {fields.map((field) => (
          <div key={field.name}>
            {["text", "password", "number", "email"].includes(field.inputType) || !field.inputType ? ( // Usar "text" por defecto
              <Input
                {...field}
                label={field.label}
                type={field.inputType}
                bclass={field.bclass}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            ) : field.inputType === "select" && field.options ? (
              <SelectSearch
                label={field.label}
                bclass={field.bclass}
                options={field.options}
                value={field.value}
                onChange={field.onChange}
            />
            ) : field.inputType==='checkbox'?(
              <Form.Check
                {...field}
                label={field.label}
                bclass={field.bclass}
                placeholder={field.placeholder}
                checked={Boolean(field.value)}
                onChange={() => field.onChange(!field.value)}
            />
            ): field.inputType==='file'?(
              <Input
                {...field}
                label={field.label}
                accept={accept}
                type={field.inputType}
                bclass={field.bclass}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
            />
            ): (
              // Renderizar otros tipos de entradas aquí
              <div>Entrada de tipo desconocido</div>
            )}
          </div>
        ))}
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
