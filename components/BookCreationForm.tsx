"use client";
import React, { useState } from "react";
import { ChevronDown, Upload, X, Plus } from "lucide-react";
const BookCreationForm = () => {
  const [newBook, setNewBook] = useState(false);
  return (
    <div>
      <button
        onClick={() => setNewBook(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#183a31] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#214a3f]"
      >
        <Plus size={17} /> Create new book
      </button>
      {newBook && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:justify-end bg-[#11251f]/35 backdrop-blur-[2px] sm:p-3"
          onMouseDown={() => setNewBook(false)}
        >
          <div
            className="h-[94vh] w-full max-w-120 overflow-y-auto rounded-t-3xl bg-[#fbf9f4] p-6 shadow-2xl sm:rounded-3xl md:p-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a45134]">
                  New project
                </p>
                <h2 className="mt-2 font-serif text-3xl text-[#183a31]">
                  Create a book
                </h2>
              </div>
              <button
                onClick={() => setNewBook(false)}
                className="grid size-10 place-items-center rounded-full border border-[#18382f]/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold">Book title</span>
                <input
                  placeholder="Untitled story"
                  className="h-12 w-full rounded-xl border border-[#18382f]/12 bg-white px-4 text-sm outline-none focus:border-[#a45134]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Short description
                </span>
                <textarea
                  rows={4}
                  placeholder="What is this story about?"
                  className="w-full resize-none rounded-xl border border-[#18382f]/12 bg-white p-4 text-sm outline-none focus:border-[#a45134]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold">Genre</span>
                <span className="flex h-12 items-center rounded-xl border border-[#18382f]/12 bg-white px-4">
                  <select className="w-full bg-transparent text-sm outline-none">
                    <option>Literary fiction</option>
                    <option>Short stories</option>
                    <option>Magical realism</option>
                    <option>Memoir</option>
                  </select>
                  {/* <ChevronDown size={16} /> */}
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold">
                  Cover image
                </span>
                <span className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#18382f]/20 bg-[#f5f1e8] text-center">
                  <Upload size={20} className="text-[#a45134]" />
                  <span className="mt-2 text-xs font-semibold">
                    Choose an image to upload
                  </span>
                  <span className="mt-1 text-[10px] text-[#8a918d]">
                    PNG or JPG, up to 8MB
                  </span>
                </span>
              </label>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setNewBook(false)}
                className="h-12 flex-1 rounded-xl border border-[#18382f]/12 text-sm font-semibold"
              >
                Save as draft
              </button>
              <button className="h-12 flex-1 rounded-xl bg-[#183a31] text-sm font-semibold text-white">
                Create & write
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCreationForm;
