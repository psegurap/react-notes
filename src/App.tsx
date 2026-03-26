"use client";
import "./App.css";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";

import { useEffect, useReducer, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import NoteDisplay from "./NoteDisplay";
import type { NoteType } from "../types";
import ThemeContext from "./ThemeContext";

const temp_notes: NoteType[] = [
    {
        id: 2,
        date: "03/18/2026",
        title: "React Hooks Practice",
        content:
            "Started working on my Smart Notes App today.\n\nFocused on using useEffect for saving and loading notes, useRef for handling input focus, and useContext for managing global state.\n\nStill getting used to when to use each hook, but it's starting to make more sense as I build.",
    },
    {
        id: 1,
        date: "03/05/2026",
        title: "Improving Component Structure",
        content:
            "Refactored parts of my app to make components smaller and easier to manage.\n\nMoved logic into custom hooks and cleaned up large components.\n\nRealizing how important it is to keep UI and logic separate for better readability and scalability.",
    },
];

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNote, setActiveNote] = useState<NoteType>({
        id: 0,
        title: "",
        date: "",
        content: "",
    });

    const ids_count = useRef(0);

    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const saved_theme = localStorage.getItem("note_theme");
        if (saved_theme == "light" || saved_theme == "dark") {
            return saved_theme;
        }

        return "light";
    });

    useEffect(() => {
        localStorage.setItem("note_theme", theme);
    }, [theme]);

    function notesReducer(
        prevNotes: NoteType[],
        action: { type: "add" | "update" | "delete"; note: NoteType },
    ): NoteType[] {
        switch (action.type) {
            case "add":
                return [action.note, ...prevNotes];

            case "update":
                return prevNotes.map((note) => {
                    if (note.id == action.note.id) {
                        note = action.note;
                    }
                    return note;
                });
            case "delete":
                return prevNotes.filter((note) => note.id !== action.note.id);
            default:
                return prevNotes;
        }
    }

    const [notes, noteDispatch] = useReducer(notesReducer, [], () => {
        let saved_notes = localStorage.getItem("notes");

        if (saved_notes) {
            if (JSON.parse(saved_notes).length > 0) {
                ids_count.current = JSON.parse(saved_notes)[0].id;
                setActiveNote(JSON.parse(saved_notes)[0]);
            } else {
                ids_count.current = 0;
            }

            return JSON.parse(saved_notes);
        }
        ids_count.current = 2;
        setActiveNote(temp_notes[0]);
        return temp_notes;
    });

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    function handleReducerChanges(
        type: "add" | "update" | "delete",
        note: NoteType,
    ) {
        switch (type) {
            case "add":
                ids_count.current += 1;
                note.id = ids_count.current;
                setActiveNote(note);

                noteDispatch({
                    type: "add",
                    note: note,
                });
                break;
            case "update":
                noteDispatch({
                    type: "update",
                    note: note,
                });
                break;
            case "delete":
                noteDispatch({
                    type: "delete",
                    note: note,
                });
                setActiveNote({
                    id: 0,
                    title: "",
                    date: "",
                    content: "",
                });
                break;
            default:
                break;
        }
    }

    function handleNoteChange(note: NoteType) {
        setActiveNote(note);
    }

    return (
        <>
            <ThemeContext value={theme}>
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    onHandleNoteDispatch={handleReducerChanges}
                    notes={notes}
                    activeNote={activeNote}
                    onHandleNoteChange={handleNoteChange}
                />
                <div className="md:pl-72 h-full flex flex-col">
                    <div
                        className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b  px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 ${theme == "light" ? "border-gray-200 bg-white" : "border-white/10 bg-gray-900 shadow-none"}`}
                    >
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className={`-m-2.5 p-2.5 md:hidden ${theme == "light" ? "text-gray-700 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Separator */}
                        <div
                            aria-hidden="true"
                            className={`h-6 w-px  md:hidden ${theme == "light" ? "bg-gray-200" : "bg-white/10"}`}
                        />

                        <div className="flex flex-1 gap-x-4 justify-end lg:gap-x-6">
                            <div>
                                <div
                                    className={`group relative inline-flex w-12 shrink-0 rounded-full p-0.5 inset-ring outline-offset-2 transition-colors duration-200 ease-in-out  has-focus-visible:outline-2 ${theme == "light" ? "bg-gray-200 inset-ring-gray-900/5 outline-cyan-600 has-checked:bg-cyan-600" : "bg-white/5 inset-ring-gray-500/70 outline-cyan-500 has-checked:bg-gray-800"} `}
                                >
                                    <span
                                        className={`relative size-6 rounded-full shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5 ${theme == "light" ? "bg-white" : "bg-gray-300"}`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 flex size-full items-center justify-center opacity-100 transition-opacity duration-200 ease-in group-has-checked:opacity-0 group-has-checked:duration-100 group-has-checked:ease-out"
                                        >
                                            <SunIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-has-checked:opacity-100 group-has-checked:duration-200 group-has-checked:ease-in"
                                        >
                                            <MoonIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </span>
                                    </span>
                                    <input
                                        name="setting"
                                        type="checkbox"
                                        aria-label="Use setting"
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setTheme(
                                                !event.target.checked
                                                    ? "light"
                                                    : "dark",
                                            )
                                        }
                                        checked={theme == "dark"}
                                        className="absolute inset-0 size-full appearance-none focus:outline-hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <main
                        className={`flex-1 ${theme == "light" ? "" : "bg-gray-900"}`}
                    >
                        <div className="p-4 sm:p-6 lg:p-8 h-full">
                            {activeNote.id !== 0 && (
                                <NoteDisplay
                                    activeNote={activeNote}
                                    onHandleNoteDispatch={handleReducerChanges}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </ThemeContext>
        </>
    );
}
