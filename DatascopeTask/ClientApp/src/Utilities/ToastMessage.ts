import { notification } from "antd";

export const SuccessToast = (title: string, description: string) => {
  notification.success({
    message: title,
    description: description,
    placement: "bottomRight",
  });
};

export const DangerToast = (title: string, description: string) => {
  notification.error({
    message: title,
    description: description,
    placement: "bottomRight",
  });
};
