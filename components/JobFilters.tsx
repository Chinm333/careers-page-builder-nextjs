"use client";

type JobFiltersProps = {
    search?: string;
    location?: string;
    job_type?: string;
    uniqueLocations: string[];
    uniqueTypes: string[];
};

export function JobFilters({ search, location, job_type, uniqueLocations, uniqueTypes }: JobFiltersProps) {
    return (
        <form
            method="GET"
            className="mt-3 grid gap-2 rounded bg-white p-3 text-sm shadow-sm sm:grid-cols-3"
        >
            <label htmlFor="search" className="sr-only">
                Search by job title
            </label>
            <input
                id="search"
                name="search"
                type="search"
                placeholder="Search by job title"
                defaultValue={search ?? ""}
                className="w-full rounded border px-2 py-1"
                aria-label="Search by job title"
            />
            <label htmlFor="location" className="sr-only">
                Filter by location
            </label>
            <select
                id="location"
                name="location"
                defaultValue={location ?? ""}
                className="w-full rounded border px-2 py-1"
                aria-label="Filter by location"
                onChange={(e) => {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                }}
            >
                <option value="">All locations</option>
                {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                        {loc}
                    </option>
                ))}
            </select>
            <label htmlFor="job_type" className="sr-only">
                Filter by job type
            </label>
            <select
                id="job_type"
                name="job_type"
                defaultValue={job_type ?? ""}
                className="w-full rounded border px-2 py-1"
                aria-label="Filter by job type"
                onChange={(e) => {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                }}
            >
                <option value="">All job types</option>
                {uniqueTypes.map((t) => (
                    <option key={t} value={t}>
                        {t}
                    </option>
                ))}
            </select>
        </form>
    );
}


