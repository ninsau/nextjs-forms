import { FormikHelpers } from "formik";
import { AnySchema } from "yup";
import * as Yup from "yup";

export type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "richtext";

export interface FieldConfig {
  name: string;
  label: string;
  componentType: FieldType;
  placeholder?: string;
  type?: string;
  options?: Array<string | { label: string; value: string }>;
  isMulti?: boolean;
  validation?: AnySchema;
  rows?: number;
  richText?: boolean;
}

export interface CustomStyles {
  [key: string]: string;
}

export interface FormBuilderProps<T> {
  fields: FieldConfig[];
  initialValues: T;
  onSubmit: (values: T, actions: FormikHelpers<T>) => void;
  validationSchema?: Yup.ObjectSchema<any>;
  onFileUpload?: (file: File) => Promise<string>;
  styles?: CustomStyles;
}

export interface SelectFieldProps {
  field: FieldConfig;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  value: any;
  styles?: CustomStyles;
}
