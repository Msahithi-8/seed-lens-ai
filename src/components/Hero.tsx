import { Sprout, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scene3D } from "./Scene3D";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
      <Scene3D />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-glow animate-scale-pulse">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>AI-Powered Seed Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Seed Quality Classifier
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload seed images and get instant AI-powered quality analysis with detailed reports on color, shape, texture, and defect detection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 hover:shadow-glow"
            >
              <Sprout className="mr-2 h-5 w-5" />
              Analyze Seeds Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View Demo Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="space-y-2 group animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:shadow-glow animate-float">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced computer vision algorithms analyze 7+ quality parameters
              </p>
            </div>
            
            <div className="space-y-2 group animate-fade-in [animation-delay:100ms]">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:shadow-glow-accent animate-float [animation-delay:1s]">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Instant Reports</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed quality scores, grades, and visual insights in seconds
              </p>
            </div>
            
            <div className="space-y-2 group animate-fade-in [animation-delay:200ms]">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:shadow-glow animate-float [animation-delay:2s]">
                <Sprout className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Batch Processing</h3>
              <p className="text-sm text-muted-foreground">
                Upload multiple seed images for comprehensive quality comparison
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
