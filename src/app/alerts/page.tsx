// 'use client';

// // import { api } from '@/lib/api';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { Alert } from '../../../types/app';
// // import { RequireAuth } from '../../components/RoleGate';

// export default function AlertsPage() {
//   const [alerts, setAlerts] = useState<Alert[]>([]);
//   const [patientId, setPatientId] = useState('');

//   const load = () => {
//     if (!patientId) return;
//     api
//       .get(`/alerts/patient/${patientId}`)
//       .then(r => setAlerts(r.data))
//       .catch(e =>
//         toast.error(e?.response?.data?.error || 'Failed to load alerts'),
//       );
//   };

//   useEffect(() => {
//     load();
//   }, [patientId]);

//   return (
//     <RequireAuth roles={['clinician', 'admin']}>
//       <div className="flex items-end gap-2 mb-4">
//         <div>
//           <label className="block text-sm">Patient ID</label>
//           <input
//             value={patientId}
//             onChange={e => setPatientId(e.target.value)}
//             className="border rounded p-2"
//             placeholder="UUID"
//           />
//         </div>
//         <button onClick={load} className="bg-black text-white rounded p-2">
//           Load
//         </button>
//       </div>

//       <div className="card">
//         <h1 className="font-semibold mb-2">Alerts</h1>
//         <ul className="space-y-2">
//           {alerts.map(a => (
//             <li
//               key={a.id}
//               className="border rounded p-2 flex items-center justify-between"
//             >
//               <div>
//                 <div className="text-sm">
//                   {a.type} · <span className="font-mono">{a.severity}</span>
//                 </div>
//                 <div className="text-xs text-gray-600">{a.message}</div>
//               </div>
//               {!a.is_read && (
//                 <button
//                   className="text-sm underline"
//                   onClick={async () => {
//                     await api.patch(`/alerts/${a.id}/read`, { is_read: true });
//                     toast.success('Marked as read');
//                     load();
//                   }}
//                 >
//                   Mark read
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </RequireAuth>
//   );
// }


export default function AlertsPage() {
  return <div>Alerts Page - Under Construction</div>;
}
