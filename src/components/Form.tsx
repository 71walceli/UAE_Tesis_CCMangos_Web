import React, { ReactNode, forwardRef } from "react";
import { Form, FormControl } from "react-bootstrap";
import { DateRangePicker, Message } from "rsuite";

import { Input, UploaderInput } from "./InputCustom";
import { SelectSearch } from "./SelectSearch";
import { RequiredMark } from "./RequiredMark";


export interface FormFieldProps {
  name: string;
  disabled: boolean,
  readonly: boolean,
  label?: string;
  inputType?: "text" | "select" | "checkbox"| "password"|"file"; // Agregar más tipos si es necesario
  bclass?: string;
  placeholder?: string;
  value: T;
  onChange: (value: T) => void;
  options?: { value: T; label: string }[];
  tips: string | ReactNode | ReactNode[]; 
  multiple: boolean; 
  error: string | ReactNode; 
  accept: string; 
}
// Help me wrap this component in ForwardRef
export const FormField = forwardRef(({
  name,
  disabled,
  readonly,
  label,
  inputType,
  type,
  bclass,
  placeholder,
  value,
  onChange,
  options,
  tips,
  multiple,
  error,
  accept,
  ...props
}: FormFieldProps, ref) => {
  inputType = type || inputType;

  const commonProps = {
    disabled: disabled,
    label: label,
    value: value,
    onChange: onChange,
    ref: ref, // Add ref to commonProps so it can be spread into all components
  };

  return (
    <div className="form-group" style={{ minHeight: 100, ...props.style }}>
      {tips 
        ? <Message>{tips}</Message>
        : null
      }
      {
        ["text", "password", "number", "email", "textarea"].includes(inputType) || !inputType ? (
          <Input
            {...props}
            {...commonProps}
            placeholder={placeholder}
            type={inputType}
          />
        ) : inputType === "select" ? (
          <SelectSearch
            {...props}
            {...commonProps}
            options={options}
            multiOptions={multiple}
          />
        ) : inputType === 'checkbox' ? (
          <Form.Check
            {...props}
            {...commonProps}
            label={<>{label} {props.required && <RequiredMark />}</>}
            checked={Boolean(value)}
            onChange={() => onChange(!value)} 
          />
        ) : inputType === 'file' ? (
          <UploaderInput
            {...props}
            {...commonProps}
            accept={accept}
            type={inputType}
          />
        ) : inputType === 'date' ? (
          <Form.Group>
            <Form.Label>{label} {props.required && <RequiredMark />}</Form.Label>
            <Form.Control 
              type="date"
              {...props}
              {...commonProps}
              onChange={(event) => commonProps.onChange(event.target.value)}
              bclass={bclass}
            />
          </Form.Group>
        ) : inputType === 'dateRange' ? (
          <Form.Group>
            <Form.Label>{label} {props.required && <RequiredMark />}</Form.Label>
            <DateRangePicker {...props} {...commonProps} label="" cleanable={false} 
              style={{ width: "100%" }}
            />
          </Form.Group>
        ) : (
          <div>Entrada de tipo desconocido</div>
        )
      }
      {error
        ? <div className="form-error invalid-feedback d-block px-2">{error}</div>
        : null
      }
    </div>
  );
})

interface GenericFormProps {
  fields: FormFieldProps[];
  fields2: ReactNode<FormField>;
  showSubmit?: boolean;
  onSubmit: () => void;
  accept?: string;
  manager?: any;
}
export const GenericForm = ({ 
  fields, onSubmit, showSubmit=true, accept='*', manager
}: GenericFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 d-flex flex-column" style={{ gap: 13 }}>
        {fields.map((field) => <FormField {...field} />)}
      </div>
      <div className="row">
        {showSubmit && (
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-rocket-takeoff" /> Contuniar
          </button>
        )}
      </div>
    </form>
  );
};
export const GenericFormReact = ({ 
  onSubmit, children, manager, disabled, accept='*',
}: GenericFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  children = children?.length > 1 ? children : [children];

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3 d-flex flex-column" style={{ gap: 13 }}>
        {children.filter(field => field).map?.((field, i) => { 
          const Field = field.type
          console.log({ source: "Form", Field, props: field.props })

          return <Field {...field.props} key={field.props.name || i}
            disabled={disabled || field.props.disabled}
            value={field.props.value || manager.data[field.props.name]} 
            error={manager?.errors?.[field.props.name]}
            required={field.props.required || manager.validator[field.props.name]}
            onChange={(value) => manager.set(previous => ({
              ...previous,
              [field.props.name]: value,
            }))}
          />
        })}
      </div>
    </form>
  );
};
