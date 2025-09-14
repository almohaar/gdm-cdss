import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingForm } from '@/components/ReadingForm';

export default function NewReadingPage() {
  // In a real app, derive patientId from auth user mapping
  const mockPatientId = 'self';
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Log blood glucose</CardTitle>
        </CardHeader>
        <CardContent>
          <ReadingForm patientId={mockPatientId} />
        </CardContent>
      </Card>
    </div>
  );
}
