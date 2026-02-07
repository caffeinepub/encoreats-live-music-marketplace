import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Lock, CheckCircle, DollarSign } from 'lucide-react';

interface WalletViewProps {
  walletState?: {
    locked: bigint;
    available: bigint;
    paid: bigint;
  };
}

export default function WalletView({ walletState }: WalletViewProps) {
  const locked = walletState ? Number(walletState.locked) : 0;
  const available = walletState ? Number(walletState.available) : 0;
  const paid = walletState ? Number(walletState.paid) : 0;
  const total = locked + available + paid;

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Wallet className="h-6 w-6 text-chart-1" />
            Your Wallet
          </CardTitle>
          <CardDescription>Track your earnings across all payment states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-6 rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-4/20 border border-chart-1/30">
            <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
            <p className="text-4xl font-bold text-chart-1">₹{total}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/50 bg-background/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Lock className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Locked</CardTitle>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">₹{locked}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Funds locked until event completion
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-chart-2 mb-2">
                  <DollarSign className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                </div>
                <div className="text-2xl font-bold text-chart-2">₹{available}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Ready to withdraw
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-chart-4 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">Paid</CardTitle>
                </div>
                <div className="text-2xl font-bold text-chart-4">₹{paid}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Successfully withdrawn
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <p className="font-medium mb-1">Locked</p>
              <p className="text-sm text-muted-foreground">
                When a venue books you, payment is locked in escrow until the event.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <p className="font-medium mb-1">Available</p>
              <p className="text-sm text-muted-foreground">
                After the event and QR verification, funds become available for withdrawal.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <p className="font-medium mb-1">Paid</p>
              <p className="text-sm text-muted-foreground">
                Once withdrawn, funds are marked as paid and transferred to your account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
