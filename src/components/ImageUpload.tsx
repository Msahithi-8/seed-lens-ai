import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  isAnalyzing: boolean;
}

export const ImageUpload = ({ onImagesSelected, isAnalyzing }: ImageUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [toast]);

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleAnalyze = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one seed image",
        variant: "destructive",
      });
      return;
    }
    onImagesSelected(selectedFiles);
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 shadow-card">
          <h2 className="text-2xl font-bold mb-6 text-center">Upload Seed Images</h2>
          
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20"
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              disabled={isAnalyzing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drop seed images here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG (max 10MB per file)
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Selected Images ({selectedFiles.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Seed ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isAnalyzing}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-center mt-1 truncate">
                      {selectedFiles[index].name}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing Seeds...
                  </>
                ) : (
                  <>Analyze {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}</>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
