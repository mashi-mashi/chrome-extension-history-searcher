import { useEffect, useState } from 'react';

import { AnyType } from '../util/util';

export const useKeyPress = (keyCode: number): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const downHandler = (event: AnyType) => {
    if (event.keyCode === keyCode) {
      setKeyPressed(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const upHandler = (event: AnyType) => {
    if (event.keyCode === keyCode) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);

    return () => {
      document.removeEventListener('keydown', downHandler);
      document.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);
  return keyPressed;
};
