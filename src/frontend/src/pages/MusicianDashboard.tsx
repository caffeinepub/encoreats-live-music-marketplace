import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useFetchMusicianGigs, useGetWalletState, useFetchSlotsByMusician, useCreateSlot, useUpdateSlotAvailability } from '../hooks/useQueries';
import Header from '../components/Header';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import WalletView from '../components/WalletView';
import QRTicketGenerator from '../components/QRTicketGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Music, Wallet, QrCode } from 'lucide-react';
import { Variant_pending_completed_confirmed } from '../backend';

export default function MusicianDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const userId = identity?.getPrincipal().toString() || null;
  const { data: musicianGigs = [] } = useFetchMusicianGigs(userId);
  const { data: walletState } = useGetWalletState(userId);
  const { data: slots = [] } = useFetchSlotsByMusician(userId);

  const upcomingGigs = musicianGigs.filter((gig) => Number(gig.date) > Date.now() * 1000000);
  const confirmedGigs = musicianGigs.filter((gig) => gig.status === Variant_pending_completed_confirmed.confirmed);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">{userProfile?.name}</span>
          </h1>
          <p className="text-xl text-muted-foreground">Manage your gigs and availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Gigs</CardTitle>
              <Calendar className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-1">{upcomingGigs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Events scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Wallet className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">
                ₹{walletState ? Number(walletState.available) + Number(walletState.paid) : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available + Paid</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
              <Music className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">{musicianGigs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="gigs" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="gigs">My Gigs</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="qr">QR Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="gigs" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Your Gigs</CardTitle>
                <CardDescription>Track your upcoming and past performances</CardDescription>
              </CardHeader>
              <CardContent>
                {musicianGigs.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">No gigs booked yet</p>
                    <p className="text-muted-foreground mt-2">Update your availability to get discovered by venues</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {musicianGigs.map((gig) => (
                      <Card key={Number(gig.id)} className="border-border/50 bg-background/50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{gig.name}</CardTitle>
                              <CardDescription className="flex flex-col gap-2">
                                <span className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(Number(gig.date) / 1000000).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="text-lg font-semibold text-chart-2">₹{Number(gig.price)}</span>
                              </CardDescription>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                gig.status === Variant_pending_completed_confirmed.completed
                                  ? 'border-chart-2 text-chart-2'
                                  : gig.status === Variant_pending_completed_confirmed.confirmed
                                  ? 'border-chart-1 text-chart-1'
                                  : 'border-muted-foreground text-muted-foreground'
                              }
                            >
                              {gig.status === Variant_pending_completed_confirmed.confirmed ? 'confirmed' : 
                               gig.status === Variant_pending_completed_confirmed.completed ? 'completed' : 'pending'}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <AvailabilityCalendar slots={slots} userId={userId} />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <WalletView walletState={walletState} />
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <QRTicketGenerator gigs={confirmedGigs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
