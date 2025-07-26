import { useEffect, useState } from 'react';

export default function Home() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch('/api/invoices')
      .then(res => res.json())
      .then(setInvoices);
  }, []);

  return (
    <div>
      <h1>Freelance Invoicing System</h1>
      <ul>
        {invoices.map(inv => (
          <li key={inv._id}>
            {inv.client}: ${inv.amount} - {inv.status}
          </li>
        ))}
      </ul>
    </div>
  );
} 