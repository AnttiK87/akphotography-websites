import type { Type, Category } from "../types/types";

export const TYPE_VALUES: Type[] = [
  "monthly",
  "birds",
  "nature",
  "mammals",
  "landscapes",
];

export const CATEGORY_VALUES: Category[] = [
  "monthly",
  "birds",
  "nature",
  "mammals",
  "landscapes",
  undefined,
];

const isValidType = (value: string): value is Type => {
  return TYPE_VALUES.includes(value as Type);
};

const isValidCategory = (value: string | undefined): value is Category => {
  return CATEGORY_VALUES.includes(value as Category);
};

export const typeCheck = (value: string) => {
  if (isValidType(value)) {
    return value;
  } else {
    throw new Error(`Invalid type: ${value}`);
  }
};

export const categoryCheck = (value: string | undefined) => {
  if (isValidCategory(value)) {
    return value;
  } else {
    throw new Error(`Invalid category: ${value}`);
  }
};
