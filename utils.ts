import * as ImageManipulator from "expo-image-manipulator";

export const colors = [
  "#EA2027", // A
  "#eb2f06", // B
  "#e84118", // C
  "#EE5A24", // D
  "#fa8231", // E
  "#fd9644", // F
  "#ffa801", // G
  "#ffd32a", // H
  "#ffdd59", // I
  "#009432", // J
  "#44bd32", // K
  "#4cd137", // L
  "#0652DD", // M
  "#1e90ff", // N
  "#2d98da", // O
  "#45aaf2", // P
  "#1B1464", // Q
  "#192a56", // R
  "#273c75", // S
  "#4a69bd", // T
  "#5f27cd", // U
  "#4834d4", // V
  "#5758BB", // W
  "#1e272e", // X
  "#485460", // Y
  "#808e9b", // Z
];

export const hostForDev = (port: number, param = ""): string => {
  return `http://172.30.1.52:${port}${param}`;
};

export const inputValidator = (
  name: string | undefined,
  caption: string | undefined
): void => {
  const engValidation = (term: string): boolean => {
    const enRegex = new RegExp("^[a-zA-Z]*$");
    return enRegex.test(term);
  };

  if (name === "") {
    throw new Error("단어 이름을 입력해주세요.");
  } else if (caption !== undefined && caption.length > 8) {
    throw new Error("단어 의미는 8글자까지 입력할 수 있습니다.");
  } else if (name !== undefined && engValidation(name) === false) {
    throw new Error("띄어쓰기 없이 영어로만 입력해주세요.");
  }
};

export const userNameValidator = (userName: string | undefined) => {
  const nameValidation = (term: string): boolean => {
    const nameRegex = /^(([^\s!@#$%^&*._\-,;:"'+=()<>\[\]])|([a-zA-Z0-9][._]*))*(?!\s)([^\s!@#$%^&*._\-,;:"'=+()<>\[\]])$/g;
    return nameRegex.test(term);
  };
  if (userName === "") {
    throw new Error("닉네임을 입력해주세요.");
  } else if (userName !== undefined && userName.length > 15) {
    throw new Error("닉네임은 15글자까지 입력할 수 있습니다.");
  } else if (userName !== undefined && nameValidation(userName) === false) {
    throw new Error("닉네임 작성 조건을 확인해주세요.");
  }
};
