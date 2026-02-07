import { useState } from 'react';
import { useCreateSlot, useUpdateSlotAvailability } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import type { Slot } from '../backend';
import { toast } from 'sonner';

interface AvailabilityCalendarProps {
  slots: Slot[];
  userId: string | null;
}

export default function AvailabilityCalendar({ slots, userId }: AvailabilityCalendarProps) {
  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlotAvailability();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSlot = () => {
    if (!userId) {
      toast.error('User ID not available');
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);

    const newSlot: Slot = {
      id: BigInt(Date.now()),
      userId: userId as any,
      startTime: BigInt(tomorrow.getTime() * 1000000),
      endTime: undefined,
      isAvailable: true,
    };

    createSlot.mutate(newSlot);
  };

  const handleToggleAvailability = (slot: Slot) => {
    updateSlot.mutate({
      slotId: slot.id,
      available: !slot.isAvailable,
    });
  };

  const sortedSlots = [...slots].sort((a, b) => Number(a.startTime) - Number(b.startTime));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Availability Calendar</CardTitle>
            <CardDescription>Manage your availability for bookings</CardDescription>
          </div>
          <Button onClick={handleCreateSlot} disabled={createSlot.isPending} className="bg-chart-1 hover:bg-chart-1/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedSlots.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">No availability slots yet</p>
            <Button onClick={handleCreateSlot} disabled={createSlot.isPending} className="bg-chart-1 hover:bg-chart-1/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Slot
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSlots.map((slot) => (
              <Card key={Number(slot.id)} className="border-border/50 bg-background/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <CalendarIcon className="h-5 w-5 text-chart-1" />
                    <div>
                      <p className="font-medium">
                        {new Date(Number(slot.startTime) / 1000000).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Number(slot.startTime) / 1000000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        slot.isAvailable
                          ? 'border-chart-2 text-chart-2'
                          : 'border-muted-foreground text-muted-foreground'
                      }
                    >
                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleAvailability(slot)}
                      disabled={updateSlot.isPending}
                    >
                      Toggle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
