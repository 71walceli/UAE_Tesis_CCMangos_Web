import React, { useState, useEffect } from "react";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();
interface Option {
    value: string;
    label: string;
    
}

interface SelectSearchProps<T> {
    value: string | number;
    onChange: (value: string | number) => void;
    label? : string;
    placeholder?: string;
    bclass?: string;
    options: { value: T; label: string }[];
    multiOptions?: boolean;
}

export const SelectSearch = ({
    options,
    value,
    onChange,
    label,
    placeholder,
    bclass,
    multiOptions=false,
}: SelectSearchProps<any>) => {
    

    return (
        <>
        {label && <label className="form-label">{label}</label>}
        <Select
          closeMenuOnSelect={!multiOptions}
          components={animatedComponents}
          isMulti={multiOptions}
          options={options}
          value={value}
          onChange={onChange}
        />
        </>

    );
};
