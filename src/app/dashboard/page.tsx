import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  User as UserIcon,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';
import RoleGate from '@/components/RoleGate';

export default async function DashboardPage() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>Stream of readings, alerts, appointments...</CardContent>
      </Card>
      <RoleGate allow={['patient']}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon />
              My GDM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">Quick actions</p>
              <div className="flex gap-2">
                <Button asChild>
                  <a href="/readings/new">Log reading</a>
                </Button>
                <Button variant="secondary" asChild>
                  <a href="/appointments/new">Book appointment</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </RoleGate>
      <RoleGate allow={['clinician', 'admin']}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope />
              Clinician Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button asChild>
                <a href="/patients">Patients</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/rules">Rules</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </RoleGate>
      <RoleGate allow={['admin']}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck />
              Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button asChild>
                <a href="/users">Users</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/audit-logs">Audit Logs</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </RoleGate>
    </div>
  );
}
