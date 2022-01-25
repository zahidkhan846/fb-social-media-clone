const isEmpty = (value) => {
  if (value.trim() === "") return true;
  else return false;
};

const isEqual = (value1, value2) => {
  if (value1 !== value2) return true;
  else return false;
};

const isMin = (value, compare) => {
  if (value.length < compare) return true;
  else return false;
};

const isEmail = (value) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value.match(re)) return true;
  else return false;
};

const isPhone = (value) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (!value.match(re)) return true;
  else return false;
};

const isWebsite = (value) => {
  const re =
    /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if (!value.match(re)) return true;
  else return false;
};

const userFormValidator = (bio, website, location, phone) => {
  let errors = {};

  if (isEmpty(bio)) errors.bio = `Bio must not be empty!`;

  if (isWebsite(website)) errors.website = `Website must be valid url!`;

  if (isEmpty(location)) errors.location = `Location must not be empty!`;

  if (isPhone(phone)) errors.phone = `Phone must be valid phone!`;

  return errors;
};

const registerUserErrors = (user) => {
  let errors = {};
  if (isEmpty(user.username)) errors.username = "Username must not be empty!";
  if (isEmpty(user.firstName))
    errors.firstName = "First Name must not be empty!";
  if (isEmpty(user.lastName)) errors.lastName = "Last Name must not be empty!";
  if (isEmail(user.email)) errors.email = "Email must a valid email!";
  if (isMin(user.password, 6))
    errors.password = "Password must have minimum 6 character in it!";
  if (isEqual(user.password, user.confirmPassword))
    errors.password = "Password does not match!";

  return errors;
};

module.exports = {
  isEmail,
  isEmpty,
  isEqual,
  isMin,
  userFormValidator,
  isPhone,
  isWebsite,
  registerUserErrors,
};
