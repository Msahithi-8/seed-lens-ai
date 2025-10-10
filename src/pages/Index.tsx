import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { ResultsDisplay, SeedAnalysis } from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [results, setResults] = useState<SeedAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeImages = async (files: File[]) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis - in production, this would call Lovable AI Edge Function
      const mockResults: SeedAnalysis[] = await Promise.all(
        files.map(async (file) => {
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Generate mock analysis data
          const score = Math.floor(Math.random() * 40) + 60; // 60-100
          const quality = score >= 85 ? "High" : score >= 70 ? "Medium" : "Low";
          const grade = score >= 85 ? "A" : score >= 70 ? "B" : "C";
          
          return {
            fileName: file.name,
            imageUrl: URL.createObjectURL(file),
            quality,
            score,
            grade,
            parameters: [
              {
                name: "Color Uniformity",
                value: Math.floor(Math.random() * 30) + 70,
                interpretation: "Consistent color distribution across seed surface",
                status: "good" as const,
              },
              {
                name: "Shape Ratio",
                value: Math.floor(Math.random() * 35) + 65,
                interpretation: "Length-to-width ratio within optimal range",
                status: "good" as const,
              },
              {
                name: "Size Consistency",
                value: Math.floor(Math.random() * 25) + 60,
                interpretation: "Size variation within acceptable limits",
                status: "moderate" as const,
              },
              {
                name: "Texture Smoothness",
                value: Math.floor(Math.random() * 30) + 70,
                interpretation: "Surface texture appears smooth and healthy",
                status: "good" as const,
              },
              {
                name: "Edge Sharpness",
                value: Math.floor(Math.random() * 35) + 65,
                interpretation: "Well-defined edges indicate proper development",
                status: "good" as const,
              },
              {
                name: "Defect Detection",
                value: Math.floor(Math.random() * 40) + 60,
                interpretation: "Minimal visible defects detected",
                status: score >= 80 ? "good" as const : "moderate" as const,
              },
              {
                name: "Brightness/Luster",
                value: Math.floor(Math.random() * 30) + 70,
                interpretation: "Good luster indicating seed vitality",
                status: "good" as const,
              },
            ],
          };
        })
      );

      setResults(mockResults);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${files.length} seed image${files.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during seed analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    scrollToUpload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onGetStarted={scrollToUpload} />
      
      <div ref={uploadRef}>
        {results.length === 0 ? (
          <ImageUpload 
            onImagesSelected={analyzeImages} 
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <ResultsDisplay 
            results={results} 
            onReset={handleReset}
          />
        )}
      </div>
      
      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Seed Quality Classifier. Powered by AI and Computer Vision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
