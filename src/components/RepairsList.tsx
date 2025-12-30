import { useEffect, useState } from 'react';
import { getRepairs } from '../services/repairsService';
import { type Repair } from '../models/Repair';

const PAGE_SIZE = 5;

export default function RepairsList() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Sort state - use lowercase to match backend
    const [sortBy, setSortBy] = useState<'createdat' | 'cost' | 'device'>('createdat');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Filter state
    const [search, setSearch] = useState<string>('');
    const [minCost, setMinCost] = useState<number | undefined>(undefined);
    const [maxCost, setMaxCost] = useState<number | undefined>(undefined);

    // draft filters
    const [searchInput, setSearchInput] = useState<string>('');
    const [minCostInput, setMinCostInput] = useState<number | ''>('');
    const [maxCostInput, setMaxCostInput] = useState<number | ''>('');

    // Reset filters
    const handleResetFilters = () => {
      // Clear applied filters
      setSearch('');
      setMinCost(undefined);
      setMaxCost(undefined);
    
      // Clear draft filters (UI)
      setSearchInput('');
      setMinCostInput('');
      setMaxCostInput('');
    
      // Reset pagination
      setPage(1);
    
      // Optional: reset sorting
      setSortBy('createdat');
      setSortDirection('desc');
    };

    useEffect(() => {
        const fetch = async () => {
          try {
            // Fetch repairs for the current page
            setLoading(true);

            // Call the service to get repairs
            const result = await getRepairs(
              page, 
              PAGE_SIZE, 
              sortBy, 
              sortDirection,
            {
              search: search || undefined,
              minCost: minCost !== undefined ? minCost : undefined,
              maxCost: maxCost !== undefined ? maxCost : undefined
            });

            // Update state with fetched data
            setRepairs(result.items ?? []);
            // Update pagination info
            setTotalPages(result.totalPages);
            // Update total items
            setTotalItems(result.totalItems);
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
    }, [page, sortBy, sortDirection, search, minCost, maxCost]); // Dependencies for re-fetching

    // Render loading, error, or repairs list
    if (loading) return <p>Loading repairs...</p>;

    // Render error message if any
    if (error) return <p>{error}</p>;

    return (
    <div>
      <h2>Repairs List</h2>

      <div style={{ marginBottom: "0.75rem" }}>

        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="number"
          placeholder="Min Cost"
          value={minCostInput !== undefined ? minCostInput : ''}
          onChange={(e) => {
            const value = e.target.value;
            setMinCostInput(value ? parseFloat(value) : '');
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        />

        <input
          type="number"
          placeholder="Max Cost"
          value={maxCostInput !== undefined ? maxCostInput : ''}
          onChange={(e) => {
            const value = e.target.value;
            setMaxCostInput(value ? parseFloat(value) : '');
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        />

        <button
          onClick={() => {
            setSearch(searchInput);
            setMinCost(minCostInput === '' ? undefined : minCostInput);
            setMaxCost(maxCostInput === '' ? undefined : maxCostInput);
            setPage(1);
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Search
        </button>

        <button
          onClick={handleResetFilters}
          style={{ marginLeft: '0.5rem' }}
        >
          Reset
        </button>

      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label>
          Sort by:{" "}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as 'createdat' | 'cost' | 'device');
              setPage(1);
            }}
          >
            <option value="createdat">Created Date</option>
            <option value="cost">Cost</option>
            <option value="device">Device</option>
          </select>
        </label>

        <label style={{ marginLeft: "0.75rem" }}>
          Direction:{" "}
          <select
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value as 'asc' | 'desc');
              setPage(1);
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

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