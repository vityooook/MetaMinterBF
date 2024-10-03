import { useEffect, useRef } from "react";

import SocialLogo from "./socia-logo";
import { PlusIcon } from "lucide-react";

const LinkConstructor = ({
  index,
  url,
  remove,
  placeholder,
  inputField,
  onRemoveItem,
  onInputFieldChange,
}: any) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      (inputRef.current as any).focus();
    }
  }, []);

  return (
    <div className="link-constructor">
      <SocialLogo className="link-constructor__logo" url={url} />
      <input
        ref={inputRef}
        className="input input-text input-text__transparent"
        placeholder={placeholder}
        type="text"
        value={inputField}
        onChange={(e) => onInputFieldChange(index, e.target.value)}
      />
      {remove && (
        <PlusIcon
          className="link-constructor__delete"
          onClick={() => onRemoveItem(index)}
        />
      )}
    </div>
  );
};

export default LinkConstructor;
