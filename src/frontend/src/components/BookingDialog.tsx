import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBookGig } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import type { UserProfile, Gig } from '../backend';
import { ExternalBlob, Variant_pending_completed_confirmed } from '../backend';
import { toast } from 'sonner';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  musician: UserProfile;
}

export default function BookingDialog({ open, onOpenChange, musician }: BookingDialogProps) {
  const { identity } = useInternetIdentity();
  const bookGig = useBookGig();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please log in first');
      return;
    }

    if (!formData.name || !formData.date || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    const gigDate = new Date(formData.date).getTime() * 1000000;
    const gigId = BigInt(Date.now());

    const gig: Gig = {
      id: gigId,
      name: formData.name,
      venueId: identity.getPrincipal(),
      musicianId: musician.id,
      date: BigInt(gigDate),
      price: BigInt(formData.price),
      status: Variant_pending_completed_confirmed.confirmed,
      contractUrl: '',
      blob: ExternalBlob.fromBytes(new Uint8Array()),
    };

    bookGig.mutate(gig, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ name: '', date: '', price: '' });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book {musician.name}</DialogTitle>
          <DialogDescription>Fill in the event details to book this musician</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              placeholder="e.g., Friday Night Jazz"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="eventDate"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Payment Amount (₹) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="5000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min="0"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-chart-1 hover:bg-chart-1/90" disabled={bookGig.isPending}>
              {bookGig.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
