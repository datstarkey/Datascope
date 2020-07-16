import React, { useState, useContext } from "react";
import { UpdateGame } from "../Utilities/GamesListApi";
import { SuccessToast, DangerToast } from "../Utilities/ToastMessage";
import { Form, Input, Select, DatePicker, Modal, Button } from "antd";
import format from "moment";
import { IGame } from "../Interfaces/IGame";
import { AppContext } from "./Context/Context";

//Need to convert props to typescript
export const GameModal = (props: any) => {
  const context = useContext(AppContext);
  const token: string = context.bearer || "";
  const { TextArea } = Input;
  const freshGame: IGame = {} as any;
  const [form] = Form.useForm();
  const [modal, setModal] = useState<boolean>(false);
  const [currentGame, setCurrentGame] = useState<IGame>(freshGame);
  const [loading, setLoading] = useState<boolean>(false);

  const updateGame = () => {
    form
      .validateFields()
      .then(() => {
        setLoading(true);
        UpdateGame(currentGame, token).then((success) => {
          if (success) {
            if (props.update) {
              SuccessToast("Success", "Game updated successfully");
            } else {
              SuccessToast("Success", "Game added successfully");
            }
          } else {
            DangerToast("Error", "Could not connect to database, please check connection");
          }
          props.refreshList();
          setLoading(false);
          setModal(false);
        });
      })
      .catch(() => {});
  };

  const openModal = () => {
    if (!props.update) {
      form.resetFields();
      setCurrentGame(freshGame);
    } else {
      form.setFieldsValue(props.game);
      setCurrentGame(props.game);
    }
    setModal(true);
  };

  const setDate = (value: any) => {
    var newGame = { ...currentGame };
    newGame.releaseDate = value;
    setCurrentGame(newGame);
  };

  const onFormChange = (values: any) => {
    var newGame: IGame = { ...currentGame, ...values };
    setCurrentGame(newGame);
  };

  return (
    <>
      <Button type="primary" className="button-success" onClick={openModal} id="modal-open-button">
        {props.title ? props.title : "Add New Game"}
      </Button>

      <Modal title="Update or Add Game" visible={modal} onOk={updateGame} confirmLoading={loading} onCancel={() => setModal(false)}>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" onValuesChange={onFormChange}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Game name cannot be blank" }]}>
            <Input id="name-input" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description cannot be blank" }]}>
            <TextArea id="description-input" />
          </Form.Item>

          <Form.Item label="Rating" name="rating" rules={[{ required: true, message: "Must submit a rating" }]}>
            <Select id="rating-input">
              {[...Array(10)].map((x, i) => (
                <Select.Option key={i} value={10 - i}>
                  {10 - i}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Release Date" rules={[{ required: true, message: "Must submit a release date" }]}>
            <DatePicker id="release-input" value={format(currentGame.releaseDate)} onChange={setDate} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
