
import * as yup from 'yup';
export const LoginSchema = yup?.object().shape({
  email: yup.string().required("Username or Email is required."),
  password: yup.string().required("Password is required."),
  captcha: yup.string().required("Captcha is required."),
});
export const RegistrationSchema = yup?.object().shape({
  name: yup.string().required("Name is required."),
  username: yup.string().required("Username is required."),
  email: yup.string().email("Invalid email address.").required("Email is required."),
  password: yup.string().required("Password is required."),

});



