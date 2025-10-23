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
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Analysis Results</h2>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onReset}>
              Analyze More Seeds
            </Button>
            <Button className="bg-gradient-accent" onClick={generatePDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {results.map((result, index) => (
            <Card key={index} className="p-6 shadow-elevated">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image and Basic Info */}
                <div className="space-y-4">
                  <img
                    src={result.imageUrl}
                    alt={result.fileName}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{result.fileName}</p>
                    <div className="flex items-center gap-4">
                      <Badge className={getQualityColor(result.quality)}>
                        {result.quality} Quality
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Grade:</span>
                        <span className={`text-2xl font-bold ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Score Chart */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Overall Quality Score</p>
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.score / 100)}`}
                          className="text-primary transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold">{result.score}</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
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
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quality Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Parameter</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.parameters.map((param, i) => (
                        <tr key={i} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{param.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${param.value}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{param.value}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{getStatusIcon(param.status)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
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
          <Card className="p-6 mt-8 shadow-elevated">
            <h3 className="text-xl font-semibold mb-6">Quality Score Comparison</h3>
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
