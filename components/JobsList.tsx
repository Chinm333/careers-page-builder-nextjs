type Job = {
    id: string;
    title: string;
    location: string;
    jobType: string;
    description: string | null;
};

export function JobsList({ jobs }: { jobs: Job[] }) {
    if (!jobs.length) {
        return <p className="text-sm text-gray-500">No jobs match your filters.</p>;
    }

    return (
        <ul className="space-y-3" role="list">
            {jobs.map((job) => (
                <li key={job.id} className="rounded border bg-white p-4" role="listitem">
                    <article>
                        <h3 className="text-base font-semibold">{job.title}</h3>
                        <p className="mt-1 text-xs text-gray-500" aria-label="Job location and type">
                            {job.location} • {job.jobType}
                        </p>
                        {job.description && (
                            <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                                {job.description}
                            </p>
                        )}
                    </article>
                </li>
            ))}
        </ul>
    );
}