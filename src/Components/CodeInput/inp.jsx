import React, { useState, useRef } from "react";
import "./CodeInputStyle.scss";

const CodeInput = ({ length = 6, onChange, setMassage }) => {
    const [values, setValues] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const val = e.target.value;

        // Разрешаем только цифры
        if (!/^\d?$/.test(val)) return;

        const newValues = [...values];
        newValues[index] = val;
        setValues(newValues);

        if (onChange) onChange(newValues.join(""));

        // Автоматический переход вперёд
        if (val && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Назад
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }

        // Перемещение стрелками
        if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1].focus();
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    return (
        <div className="codeInput">
            {values.map((val, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={val}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => {handleChange(e, index), setMassage(false)}}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
};

export default CodeInput;
