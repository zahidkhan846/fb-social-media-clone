import { useState, useEffect, Fragment, FormEvent } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  FormControl,
  FormLabel,
  LinearProgress,
  Link,
  Radio,
  RadioGroup,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router";

import { User } from "../../models/user";
import { useDispatch, useSelector } from "react-redux";
import { authStart } from "../../store/auth/auth.actions";
import { RootState } from "../../store";
import CustomAlert from "../user-interface/CustomAlert";
import { Error } from "../../models/auth";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  const [firstName, setFisrtName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("female");
  const [isValid, setIsValid] = useState(true);

  const history = useHistory();

  const dispatch = useDispatch();
  let error = useSelector((state: RootState) => state.auth.error);
  let loading = useSelector((state: RootState) => state.auth.loading);

  const [errors, setErrors] = useState<Error>({});
  useEffect(() => {
    if (error) {
      setErrors(error);
    }
  }, [error]);

  useEffect(() => {
    if (history.location.pathname === "/signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [isSignup, history.location.pathname]);

  useEffect(() => {
    if (isSignup) {
      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        username.trim() === "" ||
        email.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === ""
      ) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      if (email.trim() === "" || password.trim() === "") {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  }, [
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    username,
    isSignup,
  ]);

  const clearState = () => {
    setFisrtName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setGender("female");
    setIsValid(true);
    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsValid(false);

    if (isSignup) {
      const newUser = new User(
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
        gender
      );
      dispatch(authStart("register-user", newUser, history));
    } else {
      dispatch(authStart("login", { email, password }, history));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {errors?.message && <CustomAlert message={errors.message} />}
      <Box
        sx={{
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "15px",
          paddingTop: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 0 .25rem 0 rgba(0, 0, 0, .1)",
        }}
      >
        <Typography component="h1" variant="h5" className="colorful-text">
          {isSignup ? "Create Account" : "Login"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 0.5 }}
        >
          <Box sx={{ padding: "0 1rem" }}>
            {isSignup && (
              <Fragment>
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <TextField
                    error={!!errors?.firstName}
                    helperText={errors?.firstName}
                    onBlur={() => {
                      setErrors((prevErrors) => {
                        return {
                          ...prevErrors,
                          firstName: null,
                          message: null,
                        };
                      });
                    }}
                    margin="normal"
                    required
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="firstName"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFisrtName(e.target.value)}
                  />
                  <TextField
                    error={!!errors?.lastName}
                    helperText={errors?.lastName}
                    onBlur={() => {
                      setErrors((prevErrors) => {
                        return { ...prevErrors, lastName: null, message: null };
                      });
                    }}
                    margin="normal"
                    required
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    autoFocus
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Box>
                <TextField
                  error={!!errors?.username}
                  helperText={errors?.username}
                  onBlur={() => {
                    setErrors((prevErrors) => {
                      return { ...prevErrors, username: null, message: null };
                    });
                  }}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Fragment>
            )}
            <TextField
              error={!!errors?.email}
              helperText={errors?.email}
              onBlur={() => {
                setErrors((prevErrors) => {
                  return { ...prevErrors, email: null, message: null };
                });
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              error={!!errors?.password}
              helperText={errors?.password}
              onBlur={() => {
                setErrors((prevErrors) => {
                  return { ...prevErrors, password: null, message: null };
                });
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignup && (
              <Fragment>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender"
                    onChange={(e) => setGender(e.target.value)}
                    value={gender}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>
              </Fragment>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "1rem",
                mt: 2,
                mb: 3,
              }}
            >
              <Button
                type="button"
                variant="text"
                color="secondary"
                onClick={() => {
                  history.goBack();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!isValid}>
                {isSignup ? "Sign Up" : "Sign in"}
              </Button>
            </Box>
          </Box>
          {loading && <LinearProgress />}
        </Box>
      </Box>
      {!isSignup && (
        <Grid
          container
          sx={{
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          <Grid item xs>
            <Link
              component={RouterLink}
              to="/forgot-cred"
              sx={{
                color: "#0bc084",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <span
              onClick={() => {
                clearState();
              }}
            >
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign Up
              </Link>
            </span>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
