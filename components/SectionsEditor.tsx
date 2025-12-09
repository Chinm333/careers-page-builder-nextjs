"use client";
import { useState } from "react";

export type EditableSection = {
    type: string;
    title: string;
    content: string;
    order: number;
};

type Props = {
    initial: EditableSection[];
    onChange: (value: EditableSection[]) => void;
};

const sectionType = [
    { value: "about", label: "About Us" },
    { value: "life", label: "Life at Company" },
    { value: "custom", label: "Custom" }
];

export function SectionsEditor({ initial, onChange }: Props) {
    const [sections, setSections] = useState<EditableSection[]>([...initial]);
    function updateSections(next: EditableSection[]) {
        const withOrder = next.map((s, idx) => ({ ...s, order: idx }));
        setSections(withOrder);
        onChange(withOrder);
    }
    function addSection() {
        updateSections([...sections, { type: "custom", title: "New Section", content: "", order: sections.length }]);
    }
    function removeSection(index: number) {
        updateSections(sections.filter((_, idx) => idx !== index));
    }
    function moveSection(index: number, dir: -1 | 1) {
        const target = index + dir;
        if (target < 0 || target >= sections.length) return;
        const temp = [...sections];
        [temp[index], temp[target]] = [temp[target], temp[index]];
        updateSections(temp);
    }
    function updateField(index: number, field: keyof EditableSection, value: string) {
        const temp: any = [...sections];
        temp[index][field] = value;
        updateSections(temp);
    }

    return (
        <div className="space-y-3 rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Content Sections</h2>
                <button
                    type="button"
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                    onClick={addSection}
                >
                    Add Section
                </button>
            </div>

            {sections.length === 0 && (
                <p className="text-sm text-gray-500">No sections yet. Add one.</p>
            )}

            <div className="space-y-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2 rounded border p-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <select
                                    className="rounded border px-2 py-1 text-sm"
                                    value={section.type}
                                    onChange={(e) => updateField(idx, "type", e.target.value)}
                                    aria-label={`Section ${idx + 1} type`}
                                >
                                    {sectionType.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="rounded border px-2 py-1 text-sm"
                                    value={section.title}
                                    onChange={(e) => updateField(idx, "title", e.target.value)}
                                    placeholder="Section title"
                                    aria-label={`Section ${idx + 1} title`}
                                />
                            </div>
                            <div className="flex gap-1 text-xs">
                                <button
                                    type="button"
                                    className="rounded border px-2 py-1"
                                    onClick={() => moveSection(idx, -1)}
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    className="rounded border px-2 py-1"
                                    onClick={() => moveSection(idx, 1)}
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    className="rounded border px-2 py-1 text-red-600"
                                    onClick={() => removeSection(idx)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <textarea
                            className="h-24 w-full rounded border px-2 py-1 text-sm"
                            value={section.content}
                            onChange={(e) => updateField(idx, "content", e.target.value)}
                            placeholder="Section content"
                            aria-label={`Section ${idx + 1} content`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}   
