import mailer from "./email";

const parseCookie = <T,>(text: string): T | false => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return false;
  }
};

export { mailer, parseCookie };
