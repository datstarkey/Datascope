import React, { useState, useContext } from "react";
import Cookies from "universal-cookie";
import { SuccessToast, DangerToast } from "../../Utilities/ToastMessage";
import { Form, Input, Modal, Button } from "antd";
import { IUser } from "../../Interfaces/IUser";
import { Login, Register } from "../../Utilities/LoginApi";
import { AppContext } from "../Context/Context";

interface props {
  title: string;
}

export const LoginModal = (props: props) => {
  const cookies = new Cookies();
  const [form] = Form.useForm();
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>({} as any);
  const context = useContext(AppContext);

  const registerUser = () => {
    form
      .validateFields()
      .then(() => {
        setLoading(true);
        console.log(user);
        Register(user).then((success) => {
          if (success) {
            SuccessToast("Success", "Registration successfull");
            setLoading(false);
          } else {
            DangerToast("Error", "Username already exists or error connecting to server");
            setLoading(false);
          }
        });
      })
      .catch(() => {});
  };

  const submitForm = () => {
    form
      .validateFields()
      .then(() => {
        setLoading(true);
        Login(user)
          .then((response) => response.json())
          .then((result) => {
            SuccessToast("Success", "Login successful");
            if (context.setAuthenticated) context.setAuthenticated(true);
            if (context.setBearer) context.setBearer(result);
            cookies.set("token", result);
            setLoading(false);
            setModal(false);
          })
          .catch((err) => {
            console.log(err);
            DangerToast("Error", "error connecting to server");
            setLoading(false);
          });
      })
      .catch(() => {});
  };

  const onFormChange = (values: any) => {
    var newUser: IUser = { ...user, ...values };
    setUser(newUser);
  };
  return (
    <>
      <Button
        type="primary"
        style={{ float: "right", marginTop: "1rem" }}
        className="button-success"
        onClick={() => setModal(true)}
        id="login-modal-button"
      >
        {props.title}
      </Button>

      <Modal
        title="Login"
        visible={modal}
        onOk={submitForm}
        confirmLoading={loading}
        onCancel={() => setModal(false)}
        footer={[
          <Button danger onClick={registerUser}>
            Register
          </Button>,
          <Button key="back" onClick={() => setModal(false)}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={submitForm}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} layout="horizontal" onValuesChange={onFormChange}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username cannot be blank" }]}>
            <Input id="username-input" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password cannot be blank" }]}>
            <Input.Password id="password-input" />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </>
  );
};
