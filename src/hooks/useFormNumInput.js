import { useState, useEffect } from 'react';

const useFormNumInput = init => {
  const [value, setValue] = useState();
  useEffect(() => {
    if (value !== init) {
      setValue(init);
    }
  }, [init]);
  const handleChange = e => {
    setValue(e);
  };
  const resetValue = () => {
    setValue();
  };

  return { value, onChange: handleChange, reset: resetValue };
};

export default useFormNumInput;
