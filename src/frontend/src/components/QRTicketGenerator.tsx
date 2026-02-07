import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Calendar } from 'lucide-react';
import type { Gig } from '../backend';
import { Variant_pending_completed_confirmed } from '../backend';
import { toast } from 'sonner';

interface QRTicketGeneratorProps {
  gigs: Gig[];
}

// Simple QR code generator using canvas
function generateQRCodeDataURL(text: string): string {
  const canvas = document.createElement('canvas');
  const size = 400;
  const padding = 40;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  // Simple QR-like pattern (for demo purposes)
  // In production, use a proper QR library or generate server-side
  const qrSize = size - padding * 2;
  const moduleSize = qrSize / 25;
  
  ctx.fillStyle = '#A855F7';
  
  // Create a simple pattern based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Draw pattern
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      const seed = (hash + x * 31 + y * 17) & 0xFF;
      if (seed % 2 === 0) {
        ctx.fillRect(
          padding + x * moduleSize,
          padding + y * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
  
  // Draw corner markers
  const markerSize = moduleSize * 7;
  const drawMarker = (x: number, y: number) => {
    ctx.fillStyle = '#A855F7';
    ctx.fillRect(x, y, markerSize, markerSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + moduleSize, y + moduleSize, markerSize - moduleSize * 2, markerSize - moduleSize * 2);
    ctx.fillStyle = '#A855F7';
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, markerSize - moduleSize * 4, markerSize - moduleSize * 4);
  };
  
  drawMarker(padding, padding);
  drawMarker(size - padding - markerSize, padding);
  drawMarker(padding, size - padding - markerSize);
  
  return canvas.toDataURL('image/png');
}

export default function QRTicketGenerator({ gigs }: QRTicketGeneratorProps) {
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);

  const generateQRCode = async (gig: Gig) => {
    setGeneratingQR(gig.id.toString());
    try {
      const qrData = `gig-${gig.id.toString()}`;
      const qrCodeDataUrl = generateQRCodeDataURL(qrData);

      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `encoreats-ticket-${gig.name.replace(/\s+/g, '-')}.png`;
      link.click();

      toast.success('QR ticket downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error(error);
    } finally {
      setGeneratingQR(null);
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <QrCode className="h-6 w-6 text-chart-1" />
          QR Tickets
        </CardTitle>
        <CardDescription>Generate QR tickets for venue verification</CardDescription>
      </CardHeader>
      <CardContent>
        {gigs.length === 0 ? (
          <div className="text-center py-12">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No confirmed gigs yet</p>
            <p className="text-muted-foreground mt-2">QR tickets will appear here once you have confirmed bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gigs.map((gig) => (
              <Card key={Number(gig.id)} className="border-border/50 bg-background/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-chart-1/20 flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-chart-1" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{gig.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(Number(gig.date) / 1000000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-chart-1 text-chart-1">
                      {gig.status === Variant_pending_completed_confirmed.confirmed ? 'confirmed' : 
                       gig.status === Variant_pending_completed_confirmed.completed ? 'completed' : 'pending'}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => generateQRCode(gig)}
                      disabled={generatingQR === gig.id.toString()}
                      className="bg-chart-1 hover:bg-chart-1/90"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {generatingQR === gig.id.toString() ? 'Generating...' : 'Download'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm text-muted-foreground">
            <strong>How to use:</strong> Download your QR ticket and present it to the venue on the day of your performance. 
            The venue will scan it to verify your attendance and release your payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
