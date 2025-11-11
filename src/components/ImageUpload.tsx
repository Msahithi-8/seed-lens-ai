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
    <section className="py-12 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 shadow-elevated hover:shadow-glow transition-all duration-300 border-2">
          <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-primary bg-clip-text text-transparent">Upload Seed Images</h2>
          <p className="text-muted-foreground text-center mb-8">Drag and drop or click to select images for AI analysis</p>
          
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer bg-gradient-to-br from-muted/20 to-transparent group"
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
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-300" />
                <Upload className="w-20 h-20 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Drop seed images here or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG • Max 10MB per file
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-8 space-y-6 animate-slide-up">
              <h3 className="font-semibold text-xl flex items-center gap-2 text-primary">
                <ImageIcon className="w-6 h-6" />
                Selected Images ({selectedFiles.length})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group animate-scale-pulse">
                    <div className="relative overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-glow">
                      <img
                        src={preview}
                        alt={`Seed ${index + 1}`}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-destructive/90 backdrop-blur-sm text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                      disabled={isAnalyzing}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-center mt-2 truncate font-medium">
                      {selectedFiles[index].name}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-primary hover:scale-105 hover:shadow-glow transition-all duration-300 text-lg font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing Seeds...
                  </>
                ) : (
                  <>✨ Analyze {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}</>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
