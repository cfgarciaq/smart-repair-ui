import { useEffect, useState } from 'react';
import { getRepairs } from '../services/repairsService';
import { type Repair } from '../models/Repair';

const PAGE_SIZE = 5;

export default function RepairsList() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetch = async () => {
          try {
            // Fetch repairs for the current page
            setLoading(true);

            // Fetch repairs
            const result = await getRepairs(page, PAGE_SIZE);

            // Update state with fetched data
            setRepairs(result.items ?? []); // Handle case where items might be undefined
            setTotalPages(result.totalPages); // Update total pages
            setTotalItems(result.totalItems); // Update total count

            // Clear any previous errors
            setError(null);

          } catch (e) {
            // Handle errors
            console.error(e);
            // Set error message
            setError("Failed to load repairs.");

          } finally {
            // Always set loading to false after fetch attempt
            setLoading(false);
          }
        };

        // Initial fetch on component mount
        fetch();

    }, [page]);

    // Render loading, error, or repairs list
    if (loading) return <p>Loading repairs...</p>;

    // Render error message if any
    if (error) return <p>{error}</p>;

    return (
        <div>
      <h2>Repairs List</h2>

      {repairs.length === 0 && <p>No repairs found.</p>}

      <ul>
        {repairs.map(repair => (
          <li key={repair.id}>
            <strong>{repair.device}</strong> – {repair.description} – € {repair.cost}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <p>
          Page {page} of {totalPages} ({totalItems} total repairs)
        </p>

        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
          style={{ marginLeft: "0.5rem" }}
        >
          Next
        </button>
      </div>
    </div>
    );
}