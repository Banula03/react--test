import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, LayoutGrid, FileText } from 'lucide-react';

interface LetterTypeSelectorProps {
  letterType: 'with-facility' | 'without-facility' | null;
  onSelect: (type: 'with-facility' | 'without-facility') => void;
  onNext: () => void;
  isValid: boolean;
}

export const LetterTypeSelector: React.FC<LetterTypeSelectorProps> = ({
  letterType,
  onSelect,
  onNext,
  isValid,
}) => {
  return (
    <Card className="animated-step">
      <CardContent className="p-10">
        {/* Header */}
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Choose Letter Type</h2>
          <p className="text-sm text-muted-foreground">Select the type of letter you want to create</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          {/* Option 1: With Facility Breakdown */}
          <div
            className={cn(
              'rounded-xl border-[1.5px] p-6 cursor-pointer text-left transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col gap-4 relative outline-none',
              'hover:border-slate-400 hover:-translate-y-0.5 hover:shadow-lg',
              letterType === 'with-facility'
                ? 'border-primary bg-slate-50 shadow-[0_0_0_1px_hsl(var(--primary)),0_8px_24px_rgba(37,99,235,0.06)]'
                : 'border-slate-300 bg-white'
            )}
            onClick={() => onSelect('with-facility')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect('with-facility')}
          >
            <div className="flex justify-between items-center w-full">
              <div className={cn(
                'w-11 h-11 rounded-lg flex items-center justify-center transition-colors',
                letterType === 'with-facility' ? 'bg-blue-100 text-primary' : 'bg-blue-50 text-primary'
              )}>
                <LayoutGrid className="h-5 w-5" />
              </div>
              <Badge variant="comprehensive">comprehensive</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-foreground">With Facility Breakdown</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Include a detailed breakdown of deposit accounts, leasing facilities, and trading facilities associated with the customer.
              </p>
            </div>
          </div>

          {/* Option 2: Without Facility Breakdown */}
          <div
            className={cn(
              'rounded-xl border-[1.5px] p-6 cursor-pointer text-left transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col gap-4 relative outline-none',
              'hover:border-slate-400 hover:-translate-y-0.5 hover:shadow-lg',
              letterType === 'without-facility'
                ? 'border-primary bg-slate-50 shadow-[0_0_0_1px_hsl(var(--primary)),0_8px_24px_rgba(37,99,235,0.06)]'
                : 'border-slate-300 bg-white'
            )}
            onClick={() => onSelect('without-facility')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect('without-facility')}
          >
            <div className="flex justify-between items-center w-full">
              <div className={cn(
                'w-11 h-11 rounded-lg flex items-center justify-center transition-colors',
                letterType === 'without-facility' ? 'bg-blue-100 text-primary' : 'bg-blue-50 text-primary'
              )}>
                <FileText className="h-5 w-5" />
              </div>
              <Badge variant="standard">standard</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold text-foreground">Without Facility Breakdown</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create a standard letter without the facility breakdown tables. Suitable for general correspondence.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end border-t border-slate-100 pt-6 mt-8">
          <Button disabled={!isValid} onClick={onNext}>
            Next Step
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
