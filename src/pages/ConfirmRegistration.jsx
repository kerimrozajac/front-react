import React from "react";
import ConfirmRegistrationForm from "../components/authentication/ConfirmRegistrationForm";

function ConfirmRegistration() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-6">
          <ConfirmRegistrationForm />
        </div>
      </div>
    </div>
  );
}

export default ConfirmRegistration;
