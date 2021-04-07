import { useState, useEffect } from 'react';

const useFormInput = init => {
  const [value, setValue] = useState();
  useEffect(() => {
    if (value !== init) {
      setValue(init);
    }
  }, [init]);
  const handleChange = e => {
    if (e) {
      setValue(e.target.value);
    } else {
      setValue('');
    }
  };

  return { value, onChange: handleChange };
};

export default useFormInput;
