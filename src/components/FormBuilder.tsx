import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FieldConfig, FormBuilderProps } from "../types";
import { SelectField } from "..";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const FormBuilder = <T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  validationSchema,
  onFileUpload,
  styles = {},
  enableDarkMode = true,
}: FormBuilderProps<T> & { enableDarkMode?: boolean }) => {
  const [loadingFields, setLoadingFields] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (enableDarkMode) {
      const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(matchMedia.matches);
      const handleChange = () => setIsDarkMode(matchMedia.matches);
      matchMedia.addEventListener("change", handleChange);
      return () => {
        matchMedia.removeEventListener("change", handleChange);
      };
    }
  }, [enableDarkMode]);

  // Generate validation schema if not provided
  const generatedValidationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      schema[field.name] =
        field.validation || Yup.string().required(`${field.label} is required`);
      return schema;
    }, {} as Record<string, Yup.AnySchema>)
  );

  const handleFileChange = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean
      ) => void,
      fieldName: string
    ) => {
      const file = event.currentTarget.files?.[0];
      if (file) {
        setLoadingFields((prev) => [...prev, fieldName]);
        try {
          if (onFileUpload) {
            const fileUrl = await onFileUpload(file);
            setFieldValue(fieldName, fileUrl);
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              setFieldValue(fieldName, reader.result);
            };
            reader.readAsDataURL(file);
          }
        } catch (error) {
          console.error("File upload error:", error);
        } finally {
          setLoadingFields((prev) => prev.filter((name) => name !== fieldName));
        }
      }
    },
    [onFileUpload]
  );

  // Base styles for light and dark modes
  const baseFieldStyles = `
    block w-full text-sm rounded-lg shadow-sm
    ${
      enableDarkMode && isDarkMode
        ? "bg-gray-800 border-gray-600 text-gray-200"
        : "bg-gray-50 border-gray-300 text-gray-900"
    }
    focus:ring-blue-500 focus:border-blue-500
    transition duration-150 ease-in-out py-2 px-3 leading-6
  `;

  const quillStyles = `
    ${baseFieldStyles}
    .ql-container {
      height: 200px; /* Adjust the height as needed */
      background-color: inherit;
      color: inherit;
      border: inherit;
      border-radius: inherit;
    }
    .ql-toolbar {
      background-color: inherit;
      color: inherit;
      border: inherit;
      border-radius: inherit;
    }
    .ql-editor {
      background-color: inherit;
      color: inherit;
      border: inherit;
      min-height: 15vh;
    }
  `;

  const renderField = (
    field: FieldConfig,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => void,
    values: Record<string, any>
  ) => {
    switch (field.componentType) {
      case "input":
        if (field.type === "file") {
          return (
            <div>
              <input
                type="file"
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ""}
                onChange={(event) =>
                  handleFileChange(event, setFieldValue, field.name)
                }
                className={styles.input || baseFieldStyles}
              />
              {loadingFields.includes(field.name) && <p>Uploading...</p>}
            </div>
          );
        }
        return (
          <Field
            type={field.type || "text"}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder || ""}
            className={styles.input || baseFieldStyles}
          />
        );
      case "textarea":
        if (field.richText) {
          return (
            <>
              <style>{quillStyles}</style>
              <ReactQuill
                theme="snow"
                value={values[field.name] || ""}
                onChange={(value) => setFieldValue(field.name, value)}
                className={styles.richText || "ql-container"}
              />
            </>
          );
        }
        return (
          <Field
            as="textarea"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder || ""}
            rows={field.rows || 4}
            className={styles.textarea || baseFieldStyles}
          />
        );
      case "select":
        return (
          <FieldArray
            name={field.name}
            render={({ form }) => (
              <SelectField
                field={field}
                setFieldValue={form.setFieldValue}
                value={form.values[field.name] || (field.isMulti ? [] : "")}
                styles={styles}
              />
            )}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <Field
              type="checkbox"
              id={field.name}
              name={field.name}
              className={
                styles.checkbox ||
                `focus:ring-blue-500 h-4 w-4 ${
                  enableDarkMode && isDarkMode
                    ? "text-gray-600 border-gray-300"
                    : "text-blue-600 border-gray-300"
                }`
              }
            />
            <label
              htmlFor={field.name}
              className={
                styles.label ||
                `ml-2 block text-sm ${
                  enableDarkMode && isDarkMode
                    ? "text-gray-200"
                    : "text-gray-900"
                }`
              }
            >
              {field.label}
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema || generatedValidationSchema}
      onSubmit={async (values, actions) => {
        try {
          await onSubmit(values, actions);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className={styles.form || "space-y-6"}>
          {fields.map((field, index) => (
            <div key={index} className={styles.fieldWrapper || "mb-4"}>
              {field.componentType !== "checkbox" && (
                <label
                  htmlFor={field.name}
                  className={
                    styles.label ||
                    `block text-sm font-medium ${
                      enableDarkMode && isDarkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`
                  }
                >
                  {field.label}
                </label>
              )}
              <div className="mt-1">
                {renderField(field, setFieldValue, values)}
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className={styles.errorMessage || "text-red-600 text-sm mt-1"}
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className={
              styles.submitButton ||
              `mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                isSubmitting ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
              } focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:text-sm focus:ring-blue-500`
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormBuilder;
