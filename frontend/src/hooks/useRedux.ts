// src/hooks/useRedux.ts
import { useSelector } from "react-redux";

import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../reducers/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../reducers/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
