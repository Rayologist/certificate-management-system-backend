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

export { mailer, parseCookie, cleanTitle };
