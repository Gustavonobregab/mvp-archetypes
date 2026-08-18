'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Card } from '@mvp/kernel/ui/card';
import { Button } from '@mvp/kernel/ui/button';
import { Badge } from '@mvp/kernel/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@mvp/kernel/ui/alert-dialog';
import { CURRENT_ORG_ID, MEMBERS, ORG_BY_ID, PLANS, PLAN_BY_ID, formatDate, money } from '@/lib/domain';

/* Self-serve billing is the boundary that separates this archetype from the
   internal Console: the customer picks and pays for their own plan. */
export function BillingView() {
  const org = ORG_BY_ID[CURRENT_ORG_ID];
  const [planId, setPlanId] = React.useState(org?.planId ?? 'crew');
  const [pending, setPending] = React.useState<string | null>(null);

  const current = PLAN_BY_ID[planId];
  const seatsUsed = MEMBERS.filter((m) => m.orgId === CURRENT_ORG_ID).length;

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Billing" description="Your plan, your seats and your next invoice." />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Current plan" value={current?.name ?? ''} sub={`${money(current?.pricePerMonth ?? 0)} per month`} />
        <StatCard label="Seats" value={`${seatsUsed} of ${current?.seats ?? 0}`} sub="in use on this plan" />
        <StatCard label="Renews" value={formatDate(org?.renewsOn ?? null) ?? ''} sub="billed monthly, cancel anytime" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const active = plan.id === planId;
          const tooSmall = plan.seats < seatsUsed;
          return (
            <Card key={plan.id} className="gap-0 p-5 shadow-none">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                {active ? (
                  <Badge variant="secondary" className="border-0 bg-primary/10 font-medium text-primary">
                    Current
                  </Badge>
                ) : null}
              </div>

              <p className="mt-3">
                <span className="nv-num text-2xl font-semibold text-foreground">{money(plan.pricePerMonth)}</span>
                <span className="text-sm text-muted-foreground"> per month</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{plan.seats} seats included</p>

              <ul className="mt-4 flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {active ? (
                  <Button variant="outline" className="w-full border-border bg-card font-semibold" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full font-semibold"
                    variant={tooSmall ? 'outline' : 'default'}
                    disabled={tooSmall}
                    onClick={() => setPending(plan.id)}
                  >
                    {tooSmall ? `Needs ${seatsUsed} seats` : `Switch to ${plan.name}`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(open: boolean) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change your plan?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending
                ? `You will move to ${PLAN_BY_ID[pending]?.name} at ${money(PLAN_BY_ID[pending]?.pricePerMonth ?? 0)} per month. The change is prorated against your current period.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pending) return;
                setPlanId(pending);
                toast.success(`Moved to the ${PLAN_BY_ID[pending]?.name} plan`);
                setPending(null);
              }}
            >
              Confirm change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
