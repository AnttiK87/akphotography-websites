import type { Type } from "../types/types";

export const TYPE_VALUES: Type[] = [
  "monthly",
  "birds",
  "nature",
  "mammals",
  "landscapes",
];

const isValidType = (value: string): value is Type => {
  return TYPE_VALUES.includes(value as Type);
};

export const typeCheck = (value: string) => {
  if (isValidType(value)) {
    return value;
  } else {
    throw new Error(`Invalid type: ${value}`);
  }
};
