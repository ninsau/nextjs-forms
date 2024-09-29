# nextjs-forms

A flexible and customizable form builder for Next.js and React, featuring Formik and Yup validation. This package allows developers to easily build forms with dynamic field configurations and validation schemas, supporting file uploads, select fields, and rich text editors.

## See the [Examples](https://nextjs-reusables.vercel.app/forms)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Example](#basic-example)
  - [Props](#props)
  - [Custom Styling](#custom-styling)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)
- [Code of Conduct](#code-of-conduct)
- [Acknowledgments](#acknowledgments)

## Features

- **Dynamic Form Fields**: Build forms dynamically using a JSON-like configuration for different field types.
- **Validation**: Integrates Formik and Yup to provide robust validation out of the box.
- **Rich Text Editor**: Supports rich text editing with `react-quill`.
- **Select Fields**: Includes multi-select and creatable select fields with `react-select`.
- **File Uploads**: Supports file upload fields with optional custom upload handling.
- **Dark Mode Support**: Tailored for dark mode and light mode with smooth transitions.
- **Customizable Styles**: Easily override the default styles using the `styles` prop.

## Prerequisites

Make sure you have a working Next.js or React environment. This package assumes you are using:

- **Next.js 11 or later**
- **React 16.8.0 or later**

## Installation

Install the package via npm:

```bash
npm install nextjs-forms
```

Or via yarn:

```bash
yarn add nextjs-forms
```

## Usage

Import the `FormBuilder` component into your Next.js or React component:

```jsx
"use client";

import React from "react";
import * as Yup from "yup";
import { FormBuilder, FieldConfig } from "nextjs-forms"; // Importing from the package
import "nextjs-forms/dist/index.css"; // Import default styles
```

Pass the required props to the `FormBuilder` component, such as fields, initial values, and validation schema:

```jsx
<FormBuilder
  fields={CONTACT_FORM_FIELDS}
  initialValues={initialValues}
  onSubmit={handleOnSubmit}
/>
```

### Basic Example

Here's a simple example of a form with an input, textarea, and select field:

```jsx
"use client";

import React from "react";
import * as Yup from "yup";
import { FormBuilder, FieldConfig } from "nextjs-forms"; // Importing from your package

// Field configurations
const CONTACT_FORM_FIELDS: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    validation: Yup.string().required("Full Name is required"),
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    validation: Yup.string().email().required("Email is required"),
    componentType: "input",
    type: "email",
  },
  {
    name: "inquiryType",
    label: "Inquiry Type",
    placeholder: "Select inquiry type",
    validation: Yup.string().required("Please select an inquiry type"),
    componentType: "select",
    options: ["General Inquiry", "Support", "Feedback"],
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Enter your message",
    validation: Yup.string().required("Message is required"),
    componentType: "textarea",
    rows: 4,
  },
];

// Initial form values
const initialValues = {
  fullName: "",
  email: "",
  inquiryType: "",
  message: "",
};

// Handle form submission
const handleOnSubmit = (values: any) => {
  console.log("Form submitted with values:", values);
};

const ContactFormExample = () => {
  return (
    <div>
      <h2>Contact Us</h2>
      <FormBuilder
        fields={CONTACT_FORM_FIELDS}
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
};

export default ContactFormExample;
```

### Props

The `FormBuilder` component accepts the following props:

| Prop             | Type                            | Required | Description                                                          |
| ---------------- | ------------------------------- | -------- | -------------------------------------------------------------------- |
| fields           | FieldConfig[]                   | Yes      | An array of field configurations, describing the fields in the form. |
| initialValues    | Record<string, any>             | Yes      | An object containing the initial values of the form.                 |
| onSubmit         | (values, actions) => void       | Yes      | A function to handle form submission.                                |
| validationSchema | Yup.ObjectSchema<any>           | No       | Optional Yup validation schema for form validation.                  |
| onFileUpload     | (file: File) => Promise<string> | No       | Optional function to handle file uploads, returning a file URL.      |
| styles           | CustomStyles                    | No       | Custom styles for overriding default form styles.                    |
| enableDarkMode   | boolean                         | No       | Enable dark mode for the form.                                       |

### Custom Styling

The `FormBuilder` allows for custom styles via the `styles` prop. You can override the default `Tailwind CSS-based` styles for individual form components:

```jsx
<FormBuilder
  fields={fields}
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={(values) => console.log(values)}
  styles={{
    input: "custom-input-class", // Customize input field styles
    textarea: "custom-textarea-class", // Customize textarea field styles
    richText: "custom-richtext-class", // Customize rich text editor styles
    select: "custom-select-class", // Customize select field styles
    checkbox: "custom-checkbox-class", // Customize checkbox field styles
    label: "custom-label-class", // Customize label styles
    submitButton: "custom-submit-button-class", // Customize submit button styles
    form: "custom-form-class", // Customize form container styles
    fieldWrapper: "custom-field-wrapper-class", // Customize field wrapper styles
    errorMessage: "custom-error-message-class", // Customize error message styles
  }}
/>
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m "Add your message"`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a pull request detailing your changes.

Please ensure your code adheres to the project's coding standards and includes relevant tests if necessary.

## Versioning

We use [Semantic Versioning](https://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ninsau/nextjs-forms/tags).

To bump the version, update the `version` field in `package.json` and follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to [INSERT EMAIL HERE].

## Acknowledgments

- Inspired by common form-building and validation patterns in React and Next.js.
- Thanks to all contributors and users for their support.
- A special shout-out to the open-source community for providing tools and inspiration for this project.
