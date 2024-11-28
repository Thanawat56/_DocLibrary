
import { useState, useCallback } from "react";

export default function useOpenController(initialState) {
    const [isOpen, setIsOpen] = useState(initialState);

    const toggle = useCallback(() => {
        setIsOpen((state)=>!state);
    }, [setIsOpen]);

    return { isOpen, toggle };
}