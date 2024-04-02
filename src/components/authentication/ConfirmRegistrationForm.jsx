import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";

import { useUserActions } from "../../hooks/user.actions";

function ConfirmRegistrationForm() {
  const [validated, setValidated] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState(["", "", "", "", "", ""]);
  
  /*
  const [form, setForm] = useState({
    confirmation_code: "",
  });
  */

  const [error, setError] = useState(null);
  const userActions = useUserActions();
  const codeInputs = useRef([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmRegistrationForm = event.currentTarget;

    if (confirmRegistrationForm.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const data = {
      confirmation_code: confirmationCode.join(""),
    };

    userActions.sendConfirmationCode(data).catch((err) => {
      if (err.message) {
        setError(err.request.response);
      }
    });
  };

  const handleChange = (index, value) => {
    const newConfirmationCode = [...confirmationCode];
    newConfirmationCode[index] = value;
    setConfirmationCode(newConfirmationCode);
    if (value !== "" && codeInputs.current[index + 1]) {
      codeInputs.current[index + 1].focus(); // Move focus to the next input
    }
  };

  return (
    <Form
      id="confirm-registration-form"
      className="border p-4 rounded"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      data-testid="confirm-register-form"
      style={{ maxWidth: "400px" }} // Adjusting the container width
    >
      
      <Form.Group className="mb-3">
        <Form.Label>Confirmation code</Form.Label>
        
       

          <div className="d-flex" style={{ width: "100%", justifyContent: "space-between"}}>
            {confirmationCode.map((code, index) => (
              <Form.Control
                key={index}
                ref={(input) => (codeInputs.current[index] = input)}
                value={code}
                onChange={(e) => handleChange(index, e.target.value)}
                required
                type="text"
                maxLength={1}
                placeholder="-"
                style={{ width: "45px", marginRight: "5px", textAlign: "center" }}
              />
            ))}
          </div>

        <Form.Control.Feedback type="invalid">
          This field is required.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="text-content text-danger">{error && <p>{error}</p>}</div>

      <Button data-testid="submit-button" variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default ConfirmRegistrationForm;
