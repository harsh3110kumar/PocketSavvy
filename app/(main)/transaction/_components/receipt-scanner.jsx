"use client";

import { useRef, useEffect, useCallback } from "react";
import { Camera, Loader2, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt, scanPDFReceipt } from "@/actions/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
    setData: setScannedData,
  } = useFetch(scanReceipt);

  const {
    loading: scanPDFLoading,
    fn: scanPDFFn,
    data: scannedPDFData,
    setData: setScannedPDFData,
  } = useFetch(scanPDFReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    await scanReceiptFn(file);
  };

  const handlePDFScan = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      return;
    }

    if (!file.type.includes('pdf')) {
      toast.error("Please select a valid PDF file");
      return;
    }

    await scanPDFFn(file);
  };

  // Memoize the callback to prevent infinite loops
  const handleScanComplete = useCallback((data) => {
    if (onScanComplete) {
      onScanComplete(data);
    }
  }, [onScanComplete]);

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      handleScanComplete(scannedData);
      toast.success("Receipt scanned successfully! 🎉", {
        description: "AI has extracted the transaction details for you.",
      });
      // Clear the data to prevent re-triggering
      setScannedData(undefined);
    }
  }, [scannedData, scanReceiptLoading, handleScanComplete, setScannedData]);

  useEffect(() => {
    if (scannedPDFData && !scanPDFLoading) {
      handleScanComplete(scannedPDFData);
      toast.success("PDF receipt scanned successfully! 🎉", {
        description: "AI has extracted the transaction details for you.",
      });
      // Clear the data to prevent re-triggering
      setScannedPDFData(undefined);
    }
  }, [scannedPDFData, scanPDFLoading, handleScanComplete, setScannedPDFData]);

  return (
    <Card className="dark-card border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Receipt Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a receipt image or PDF to automatically extract transaction details
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Receipt Scanner */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Scan Receipt Image
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReceiptScan(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-all duration-200 text-white hover:text-white shadow-lg hover:shadow-xl border-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanReceiptLoading || scanPDFLoading}
          >
            {scanReceiptLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Scanning Receipt...</span>
              </>
            ) : (
              <>
                <Camera className="mr-2 h-5 w-5" />
                <span>📸 Scan Receipt with AI</span>
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* PDF Receipt Scanner */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Upload PDF Receipt
          </label>
          <input
            type="file"
            ref={pdfInputRef}
            className="hidden"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePDFScan(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 animate-gradient hover:opacity-90 transition-all duration-200 text-white hover:text-white shadow-lg hover:shadow-xl border-0"
            onClick={() => pdfInputRef.current?.click()}
            disabled={scanReceiptLoading || scanPDFLoading}
          >
            {scanPDFLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Scanning PDF...</span>
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                <span>📄 Scan PDF Receipt</span>
              </>
            )}
          </Button>
        </div>

        {/* Info Text */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          <p>✨ AI will automatically extract amount, date, and category</p>
          <p>📱 Use camera for instant scanning or upload existing files</p>
        </div>
      </CardContent>
    </Card>
  );
}