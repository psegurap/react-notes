import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon } from "@heroicons/react/20/solid";
import { useState, useContext } from "react";
import type { NoteType } from "../types";
import ThemeContext from "./ThemeContext";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    notes,
    activeNote,
    onHandleNoteDispatch,
    onHandleNoteChange,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (is_open: boolean) => void;
    notes: NoteType[];
    activeNote: NoteType;
    onHandleNoteDispatch: (
        type: "add" | "update" | "delete",
        note: NoteType,
    ) => void;
    onHandleNoteChange: (note: NoteType) => void;
}) {
    const [search, setSearch] = useState<string>("");

    function createNewNote() {
        onHandleNoteDispatch("add", {
            id: 0,
            date: getDate(),
            title: "",
            content: "",
        });
        setSidebarOpen(false);
    }

    const note_rows: React.ReactNode[] = [];

    notes.forEach((note) => {
        if (
            note.title.toLowerCase().indexOf(search.trim().toLowerCase()) !==
                -1 ||
            note.content.toLowerCase().indexOf(search.trim().toLowerCase()) !==
                -1
        ) {
            note_rows.push(
                <Note
                    key={note.id}
                    note={note}
                    onHandleNoteChange={onHandleNoteChange}
                    isActive={activeNote.id == note.id}
                    onSetSidebarOpen={setSidebarOpen}
                />,
            );
        }
    });

    return (
        <>
            <Dialog
                open={sidebarOpen}
                onClose={setSidebarOpen}
                className="relative z-50 md:hidden"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 p-2.5"
                                >
                                    <span className="sr-only">
                                        Close sidebar
                                    </span>
                                    <XMarkIcon
                                        aria-hidden="true"
                                        className="size-6 text-white"
                                    />
                                </button>
                            </div>
                        </TransitionChild>

                        {/* Sidebar component, swap this element with another sidebar if you like */}
                        <div
                            className={`relative flex grow flex-col gap-y-5 overflow-hidden p-6 ${useContext(ThemeContext) == "light" ? "bg-white" : "bg-black ring ring-white/10 before:pointer-events-none before:absolute before:inset-0 before:bg-black/10"}`}
                        >
                            <div className="flex shrink-0 items-center gap-1.5">
                                <ClipboardDocumentListIcon
                                    aria-hidden="true"
                                    className="size-7 text-cyan-700"
                                />
                                <h1
                                    className={`text-3xl font-bold italic text-center ${useContext(ThemeContext) == "light" ? "text-gray-700" : "text-gray-100"}`}
                                >
                                    Smart Notes
                                </h1>
                            </div>
                            <div className="-mr-px grid grid-cols-1 focus-within:relative">
                                <input
                                    id="search_input_mobile"
                                    name="search"
                                    type="text"
                                    value={search}
                                    placeholder="Search..."
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) => setSearch(event.target.value)}
                                    className={`col-start-1 row-start-1 block w-full rounded-md py-1.5 pr-3 pl-10 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2  sm:pl-9 sm:text-sm/6 ${useContext(ThemeContext) == "light" ? "bg-white text-gray-900 focus:outline-cyan-600 outline-gray-300 placeholder:text-gray-400" : "bg-white/5 text-white outline-gray-600 placeholder:text-gray-500 focus:outline-cyan-500"}`}
                                    //
                                />
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={createNewNote}
                                className={`rounded-md  px-2.5 py-2 text-sm font-medium  shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2  ${useContext(ThemeContext) == "light" ? "bg-cyan-500 text-white hover:bg-cyan-600 focus-visible:outline-cyan-600" : "bg-cyan-500 shadow-none text-gray-800 hover:bg-cyan-400 focus-visible:outline-cyan-500"} `}
                            >
                                New Note
                            </button>
                            <div className="relative flex-1 overflow-y-auto no-scrollbar rounded-lg">
                                <ul
                                    role="list"
                                    className={`divide-y overflow-hidden shadow-xs outline-1 rounded-lg ${useContext(ThemeContext) == "light" ? " divide-gray-100 bg-white outline-gray-900/5" : "divide-white/5 bg-gray-800/50 shadow-none outline-white/10 sm:-outline-offset-1"} `}
                                >
                                    {note_rows}
                                </ul>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <div className="hidden bg-gray-900 md:fixed md:inset-y-0 lg:z-50 md:flex md:w-72 md:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div
                    className={`flex grow flex-col border-r gap-y-5 overflow-hidden p-6 ${useContext(ThemeContext) == "light" ? "bg-gray-50 border-gray-100" : "border-white/10 bg-black/10"}`}
                >
                    <div className="flex shrink-0 items-center gap-1.5">
                        <ClipboardDocumentListIcon
                            aria-hidden="true"
                            className="size-7 text-cyan-700"
                        />
                        <h1
                            className={`text-3xl font-bold italic text-center ${useContext(ThemeContext) == "light" ? "text-gray-700" : "text-gray-100"}`}
                        >
                            Smart Notes
                        </h1>
                    </div>
                    <div className="flex flex-col gap-y-5">
                        <div className="-mr-px grid grid-cols-1 focus-within:relative">
                            <input
                                id="search_input"
                                name="search"
                                type="text"
                                value={search}
                                placeholder="Search..."
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => setSearch(event.target.value)}
                                className={`col-start-1 row-start-1 block w-full rounded-md py-1.5 pr-3 pl-10 text-base outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:pl-9 sm:text-sm/6 ${useContext(ThemeContext) == "light" ? "bg-white text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-cyan-600" : "bg-white/5 text-white outline-gray-700 placeholder:text-gray-500 focus:outline-cyan-500"}`}
                            />
                            <MagnifyingGlassIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={createNewNote}
                            className={`rounded-md px-2.5 py-2 text-sm font-medium shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ${useContext(ThemeContext) == "light" ? "bg-cyan-700 text-white hover:bg-cyan-600 focus-visible:outline-cyan-600" : "bg-cyan-500 shadow-none hover:bg-cyan-400 focus-visible:outline-cyan-500"}`}
                        >
                            New Note
                        </button>
                    </div>

                    <div className="relative flex-1 overflow-y-auto no-scrollbar rounded-lg">
                        <ul
                            role="list"
                            className={`divide-y overflow-hidden shadow-xs outline-1 rounded-lg ${useContext(ThemeContext) == "light" ? "divide-gray-100 bg-white outline-gray-900/5" : "divide-white/10 bg-gray-800/50 shadow-none outline-white/10 sm:-outline-offset-1"}`}
                        >
                            {note_rows}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

function Note({
    note,
    isActive,
    onHandleNoteChange,
    onSetSidebarOpen,
}: {
    note: NoteType;
    isActive: boolean;
    onHandleNoteChange: (note: NoteType) => void;
    onSetSidebarOpen: (open: boolean) => void;
}) {
    let classes: string = "";

    if (useContext(ThemeContext) == "light") {
        if (isActive) {
            classes += "bg-gray-200/70 hover:bg-gray-200/70";
        } else {
            classes += "hover:bg-gray-100/70";
        }
    } else if (useContext(ThemeContext) == "dark") {
        if (isActive) {
            classes += "bg-gray-700/70 hover:bg-gray-700/70";
        } else {
            classes += "hover:bg-gray-600/70";
        }
    }

    return (
        <li className={`${classes} relative flex justify-between`}>
            <button
                className="text-start flex-auto px-4 py-4"
                onClick={() => {
                    !isActive ? onHandleNoteChange(note) : null;
                    onSetSidebarOpen(false);
                }}
            >
                <div className="flex items-baseline justify-between gap-x-4">
                    <p
                        className={`text-sm/6 line-clamp-1 font-medium  ${useContext(ThemeContext) == "light" ? "text-gray-900" : "text-white"} `}
                    >
                        {note.title}
                    </p>
                    <p
                        className={`flex-none text-xs  ${useContext(ThemeContext) == "light" ? "text-gray-600" : "text-gray-400"} `}
                    >
                        <time dateTime={note.date}>{note.date}</time>
                    </p>
                </div>
                <p
                    className={`mt-1 line-clamp-3 text-xs ${useContext(ThemeContext) == "light" ? "text-gray-500" : "text-gray-400"} `}
                >
                    {note.content}
                </p>
            </button>
        </li>
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
