import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../../lib/constants/fetcher';
import { Patient } from '../../../types/app';
import { headers } from 'next/headers';

export default async function PatientsPage() {
  const patients = await api<Patient[]>('/patients', {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNjJhZDY4My0yM2VhLTQ5ODUtYTQ2NC1jNWFlZDJmMzY2ZjgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYwNTUxMDMsImV4cCI6MTc1NjE0MTUwM30.rH6U_woVpdYWGVUKX75OBpahRGQD6wWDEpW6K9aLjB0`,
    },
  } as any);
  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Patients</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">
                {p.user?.name || p.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                GA: {p.gestationalAgeWeeks} wks
              </div>
              <Button asChild size="sm">
                <a href={`/patients/${p.id}`}>Open</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
