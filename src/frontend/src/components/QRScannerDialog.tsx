import { useQRScanner } from '../qr-code/useQRScanner';
import { useVerifyGig } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Camera } from 'lucide-react';
import type { Gig } from '../backend';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface QRScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gig: Gig;
}

export default function QRScannerDialog({ open, onOpenChange, gig }: QRScannerDialogProps) {
  const verifyGig = useVerifyGig();
  const {
    qrResults,
    isScanning,
    isActive,
    error,
    canStartScanning,
    startScanning,
    stopScanning,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  useEffect(() => {
    if (open && canStartScanning) {
      startScanning();
    }
    return () => {
      if (isActive) {
        stopScanning();
      }
    };
  }, [open]);

  useEffect(() => {
    if (qrResults.length > 0) {
      const scannedData = qrResults[0].data;
      const expectedData = `gig-${gig.id.toString()}`;

      if (scannedData === expectedData) {
        verifyGig.mutate(gig.id, {
          onSuccess: () => {
            stopScanning();
            onOpenChange(false);
            clearResults();
          },
        });
      } else {
        toast.error('Invalid QR code. Please scan the correct musician ticket.');
        clearResults();
      }
    }
  }, [qrResults]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl">Verify Musician Attendance</DialogTitle>
          <DialogDescription>Scan the musician's QR ticket to mark them as present</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isActive && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Camera not active</p>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 border-4 border-chart-1 animate-pulse pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-chart-1">Scanning...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {verifyGig.isPending && (
            <Alert className="border-chart-1 bg-chart-1/10">
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
              <AlertDescription className="text-chart-1">Verifying attendance...</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                stopScanning();
                onOpenChange(false);
                clearResults();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            {!isActive && !error && (
              <Button
                onClick={startScanning}
                disabled={!canStartScanning}
                className="flex-1 bg-chart-1 hover:bg-chart-1/90"
              >
                Start Camera
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
