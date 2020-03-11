import React, { useState } from "react";
import { Flex, Box, Button, Text } from "rebass";
import { Input } from "@rebass/forms";
import * as Icon from "react-feather";
import Dialog, { showDialog } from "./dialog";
import { showSignUpDialog } from "./signupdialog";
import { db } from "../../common";

const LoginDialog = props => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();

  return (
    <Dialog
      isOpen={true}
      title={"Login"}
      icon={Icon.LogIn}
      onCloseClick={props.onClose}
      negativeButton={{ onClick: props.onClose }}
      positiveButton={{
        text: "Login",
        onClick: () => {
          setErrorMessage();
          if (username === "" || username === undefined) {
            setErrorMessage("Please enter your username.");
            return;
          }

          if (password === "" || password === undefined) {
            setErrorMessage("Please enter your password.");
            return;
          }

          db.user.login(username, password);
        }
      }}
      content={
        <Box my={1}>
          <Input
            variant="default"
            placeholder="Username"
            onChange={e => {
              setUsername(e.target.value);
            }}
          ></Input>
          <Input
            type="password"
            variant="default"
            placeholder="Password"
            sx={{ marginTop: 2 }}
            onChange={e => {
              setPassword(e.target.value);
            }}
          ></Input>
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            sx={{ marginTop: 2 }}
          >
            <Button
              variant="links"
              onClick={() => {
                showSignUpDialog();
              }}
            >
              Create a New Account
            </Button>
          </Flex>
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            sx={{ marginTop: errorMessage ? 2 : 0 }}
          >
            <Text
              fontSize="subBody"
              color="red"
              sx={{ display: errorMessage ? "flex" : "none" }}
            >
              {errorMessage}
            </Text>
          </Flex>
        </Box>
      }
    />
  );
};

export const showLogInDialog = () => {
  return showDialog(perform => <LoginDialog onClose={() => perform(false)} />);
};
