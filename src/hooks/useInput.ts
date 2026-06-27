import { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type UseInputResult = [
  string,
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  Dispatch<SetStateAction<string>>,
];

function useInput(defaultValue = ''): UseInputResult {
  const [value, setValue] = useState(defaultValue);

  function handleValueChange({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValue(target.value);
  }

  return [value, handleValueChange, setValue];
}

export default useInput;
