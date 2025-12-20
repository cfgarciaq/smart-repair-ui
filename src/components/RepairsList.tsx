import { useEffect, useState } from 'react';
import { getRepairs } from '../services/repairsService';
import { type Repair } from '../models/Repair';

export default function RepairsList() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadRepairs() {
            try {
                const data = await getRepairs();
                setRepairs(data);
            } catch (err) {
                setError('Failed to load repairs.');
            } finally {
                setLoading(false);
            }
        }

        loadRepairs();
    }, []);

    if (loading) return <p>Loading repairs...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Repairs List</h2>

            {repairs.length === 0 && <p>No repairs found.</p>}

            <ul>
                {repairs.map((repair) => (
                    <li key={repair.id}>
                        <strong>{repair.device}</strong> 
                        – {repair.description} 
                        – € {repair.cost}
                    </li>
                ))}
            </ul>
        </div>
    );
}