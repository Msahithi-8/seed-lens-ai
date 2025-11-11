import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface SeedAnalysis {
  fileName: string;
  imageUrl: string;
  quality: "High" | "Medium" | "Low";
  score: number;
  grade: "A" | "B" | "C";
  parameters: {
    name: string;
    value: number;
    interpretation: string;
    status: "good" | "moderate" | "poor";
  }[];
}

interface ResultsDisplayProps {
  results: SeedAnalysis[];
  onReset: () => void;
}

export const ResultsDisplay = ({ results, onReset }: ResultsDisplayProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(34, 139, 34);
    doc.text("Seed Quality Analysis Report", 105, 20, { align: "center" });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
    
    let yPosition = 40;
    
    results.forEach((result, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Seed header
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`Seed ${index + 1}: ${result.fileName}`, 14, yPosition);
      yPosition += 8;
      
      // Quality info
      doc.setFontSize(11);
      doc.text(`Quality: ${result.quality} | Grade: ${result.grade} | Score: ${result.score}/100`, 14, yPosition);
      yPosition += 10;
      
      // Parameters table
      autoTable(doc, {
        startY: yPosition,
        head: [['Parameter', 'Value', 'Status', 'Interpretation']],
        body: result.parameters.map(param => [
          param.name,
          `${param.value}%`,
          param.status,
          param.interpretation
        ]),
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34] },
        margin: { left: 14, right: 14 },
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });
    
    // Save the PDF
    doc.save(`seed-quality-report-${new Date().getTime()}.pdf`);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "High": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-success";
      case "B": return "text-warning";
      case "C": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4 text-success" />;
      case "moderate": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "poor": return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <section className="py-12 px-4 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Analysis Results</h2>
            <p className="text-muted-foreground mt-1">Detailed quality assessment of your seeds</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onReset} className="hover:scale-105 transition-transform border-2">
              Analyze More Seeds
            </Button>
            <Button className="bg-gradient-accent hover:scale-105 hover:shadow-glow-accent transition-all" onClick={generatePDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {results.map((result, index) => (
            <Card key={index} className="p-8 shadow-elevated hover:shadow-glow transition-all duration-500 border-2 group animate-slide-up">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image and Basic Info */}
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-xl border-2 border-border group-hover:border-primary transition-all duration-300">
                    <img
                      src={result.imageUrl}
                      alt={result.fileName}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground font-medium">{result.fileName}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className={`${getQualityColor(result.quality)} px-4 py-2 text-sm font-semibold`}>
                        {result.quality} Quality
                      </Badge>
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium">Grade:</span>
                        <span className={`text-3xl font-bold ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Score Chart */}
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-muted-foreground mb-4">Overall Quality Score</p>
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse-glow" />
                      <svg className="transform -rotate-90 w-40 h-40">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted/30"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.score / 100)}`}
                          className="transition-all duration-1000 drop-shadow-glow"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(142 76% 46%)" />
                            <stop offset="100%" stopColor="hsl(142 86% 56%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">{result.score}</span>
                        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
                      </div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={result.parameters}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Quality"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Parameters Table */}
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Quality Parameters
                </h3>
                <div className="overflow-x-auto rounded-xl border-2 border-border">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-muted to-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold">Parameter</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Value</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.parameters.map((param, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4 font-semibold">{param.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-primary transition-all duration-500 group-hover:shadow-glow"
                                  style={{ width: `${param.value}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold min-w-[3rem]">{param.value}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusIcon(param.status)}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {param.interpretation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Chart for Multiple Seeds */}
        {results.length > 1 && (
          <Card className="p-8 mt-10 shadow-elevated hover:shadow-glow transition-all duration-300 border-2">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Quality Score Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.map(r => ({ name: r.fileName, score: r.score }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="hsl(var(--primary))" name="Quality Score" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </section>
  );
};
