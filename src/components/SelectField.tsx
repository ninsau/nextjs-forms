import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { MultiValue, SingleValue } from "react-select";
import { SelectFieldProps } from "../types";

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  setFieldValue,
  value,
  styles = {},
}) => {
  const isMultiSelect = field.isMulti || false;

  const [options, setOptions] = useState(
    (field.options || []).map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    )
  );

  const handleChange = (
    newValue:
      | MultiValue<{ label: string; value: string }>
      | SingleValue<{ label: string; value: string }>
  ) => {
    if (isMultiSelect && Array.isArray(newValue)) {
      setFieldValue(
        field.name,
        newValue.map((item) => item.value)
      );
    } else if (!isMultiSelect && newValue) {
      setFieldValue(field.name, (newValue as { value: string }).value);
    } else {
      setFieldValue(field.name, isMultiSelect ? [] : "");
    }
  };

  const handleCreate = (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    if (isMultiSelect) {
      setFieldValue(field.name, [...(value || []), inputValue]);
    } else {
      setFieldValue(field.name, inputValue);
    }
  };

  const selectedValue = isMultiSelect
    ? (value || []).map((val: string) =>
        options.find((option) => option.value === val)
      )
    : options.find((option) => option.value === value);

  return (
    <CreatableSelect
      isMulti={isMultiSelect}
      id={field.name}
      name={field.name}
      options={options}
      value={selectedValue}
      onChange={handleChange}
      onCreateOption={handleCreate}
      classNamePrefix="react-select"
      className={styles.select || "react-select-container"}
    />
  );
};

export default SelectField;
