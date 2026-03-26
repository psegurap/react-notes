import { useEffect, useState, useContext } from "react";
import type { NoteType, FieldsType } from "../types";
import ThemeContext from "./ThemeContext";

export default function NoteDisplay({
    activeNote,
    onHandleNoteDispatch,
}: {
    activeNote: NoteType;
    onHandleNoteDispatch: (
        type: "add" | "update" | "delete",
        note: NoteType,
    ) => void;
}) {
    const [fieldValues, setFieldValue] = useState<FieldsType>({
        title: activeNote.title,
        details: activeNote.content,
    });

    function updateNote(title: string, details: string) {
        onHandleNoteDispatch("update", {
            id: activeNote.id,
            title: title,
            content: details,
            date: getDate(),
        });
    }
    useEffect(() => {
        setFieldValue({
            title: activeNote.title,
            details: activeNote.content,
        });
    }, [activeNote]);

    function handleChange(
        name: "title" | "details",
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        switch (name) {
            case "title":
                if (event.type == "change") {
                    setFieldValue({
                        title: event.target.value,
                        details: fieldValues.details,
                    });
                } else if (event.type == "blur") {
                    updateNote(event.target.value, fieldValues.details);
                }
                break;
            case "details":
                if (event.type == "change") {
                    setFieldValue({
                        title: fieldValues.title,
                        details: event.target.value,
                    });
                } else if (event.type == "blur") {
                    updateNote(fieldValues.title, event.target.value);
                }
                break;
            default:
                break;
        }
    }

    return (
        <div
            className={`flex flex-col h-full divide-y rounded-sm overflow-hidden border shadow-xs ${useContext(ThemeContext) == "light" ? "divide-gray-200 bg-white border-gray-200" : "divide-white/10 bg-gray-800/50 shadow-none outline -outline-offset-1 outline-white/10"}`}
        >
            <div className="flex space-between px-4 py-3 sm:px-6  items-center gap-5">
                <div className="relative mt-2 flex-1">
                    <input
                        id="note_name"
                        name="name"
                        type="text"
                        placeholder="Type title..."
                        value={fieldValues.title}
                        onChange={(event) => handleChange("title", event)}
                        onBlur={(event) => handleChange("title", event)}
                        className={`peer block w-full text-lg font-medium h-full py-1.5 focus:outline-none ${useContext(ThemeContext) == "light" ? "text-gray-800 placeholder:text-gray-400" : "text-white placeholder:text-gray-500"} `}
                    />
                    <div
                        aria-hidden="true"
                        className={`absolute inset-x-0 bottom-0 border-t peer-focus:border-t-2  ${useContext(ThemeContext) == "light" ? "border-white peer-focus:border-cyan-600" : "border-gray-800/50 peer-focus:border-cyan-500"}`}
                    />
                </div>
                <div
                    aria-hidden="true"
                    className={`h-8 w-px ${useContext(ThemeContext) == "light" ? "bg-gray-200" : "bg-white/10"}`}
                ></div>
                <button
                    type="button"
                    onClick={() => onHandleNoteDispatch("delete", activeNote)}
                    className={`rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-xs inset-ring  ${useContext(ThemeContext) == "light" ? "bg-white text-gray-900 inset-ring-gray-300 hover:bg-gray-50" : "bg-white/10 text-white shadow-none inset-ring-white/5 hover:bg-white/20"}`}
                >
                    Delete
                </button>
            </div>
            <div className="px-4 py-5 sm:p-6 flex-1">
                <div
                    className={`border-b h-full pb-px focus-within:border-b-2  focus-within:pb-0 ${useContext(ThemeContext) == "light" ? "border-white focus-within:border-cyan-600" : "border-gray-800/50 focus-within:border-cyan-500"}`}
                >
                    <label htmlFor="note_details" className="sr-only">
                        Add your notes
                    </label>
                    <textarea
                        id="note_details"
                        name="details"
                        placeholder="Add your notes..."
                        onChange={(event) => handleChange("details", event)}
                        onBlur={(event) => handleChange("details", event)}
                        value={fieldValues.details}
                        className={`block w-full h-full resize-none focus:outline-none ${useContext(ThemeContext) == "light" ? "text-gray-700 placeholder:text-gray-400" : "text-white placeholder:text-gray-500"}`}
                    />
                </div>
            </div>
        </div>
    );
}

function getDate(): string {
    return (
        ("0" + (new Date().getUTCMonth() + 1)).slice(-2) +
        "/" +
        ("0" + new Date().getUTCDate()).slice(-2) +
        "/" +
        new Date().getFullYear()
    );
}
