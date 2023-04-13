import React, { useRef } from 'react';
import "./styles.css";

interface Props {
  task: string,
  setTask: React.Dispatch<React.SetStateAction<string>>
  addToImportantList: (e: React.FormEvent) => void;
  addToGeneralList: (e: React.FormEvent) => void;
}

const Input = ({ task, setTask, addToImportantList, addToGeneralList }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form className='input' onSubmit={(e) => {
      addToGeneralList(e);
      inputRef.current?.blur();
    }}>
      <textarea
        ref={inputRef}
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
        }}
        placeholder='Task content'
        className='input_box'
        wrap='soft'
        maxLength={500}
        style={{ resize: "none" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addToGeneralList(e);
          }
        }}
      >
      </textarea>

      <button className='input_button_to_general'
        onClick={(e) => {
          addToGeneralList(e);
        }}>
        Add to general
      </button>

      <button className='input_button_to_important'
        onClick={(e) => {
          addToImportantList(e);
        }}>
        Add to important
      </button>

    </form>
  )
}

export default Input;