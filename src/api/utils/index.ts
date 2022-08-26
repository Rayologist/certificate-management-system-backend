import mailer from "./email";
import { Text } from "types";

const parseCookie = <T>(text: string): T | false => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return false;
  }
};

const cleanTitle = (input: Text[]) => {
  return input.map((value) => {
    value.text = value.text.trim();
    return value;
  });
};

const isUUID = (text: string) => {
  const regex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return regex.test(text);
};

export { mailer, parseCookie, cleanTitle, isUUID };
