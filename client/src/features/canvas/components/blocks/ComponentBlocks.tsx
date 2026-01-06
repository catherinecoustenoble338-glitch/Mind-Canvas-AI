import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- CYAN/LIGHT BLUE GROUP (Steps, Charts, Maps) ---

export const StepsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex justify-center gap-1 mt-2 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div className="w-3 h-3 rounded-full border border-block-stroke flex items-center justify-center bg-block-stroke/10">
                  <span className="text-[6px] text-block-stroke font-mono">{i}</span>
                </div>
                <Line w="w-full" h="h-px" className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const FaqBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="space-y-1 w-full overflow-hidden">
          <div className="flex justify-between items-center border border-block-stroke/30 rounded-md p-1">
            <Line w="w-2/3" h="h-1" />
            <div className="text-[6px] text-block-stroke/50">v</div>
          </div>
          <div className="flex justify-between items-center border border-block-stroke/30 rounded-md p-1">
            <Line w="w-2/3" h="h-1" />
            <div className="text-[6px] text-block-stroke/50">v</div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ChartBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex items-end gap-1 h-6 mt-1 w-full border-l border-b border-block-stroke/30 p-1">
          <div className="w-1/4 h-1/3 border border-block-stroke border-b-0"></div>
          <div className="w-1/4 h-2/3 border border-block-stroke border-b-0 bg-block-stroke/10"></div>
          <div className="w-1/4 h-1/2 border border-block-stroke border-b-0"></div>
          <div className="w-1/4 h-full border border-block-stroke border-b-0 bg-block-stroke/10"></div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TimelineBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex items-center gap-2 px-1 w-full mt-1 overflow-hidden h-full">
          <div className="flex flex-col items-center h-full">
            <div className="w-2 h-2 rounded-full border border-block-stroke"></div>
            <div className="w-px flex-1 bg-block-stroke/30 min-h-[20px]"></div>
            <div className="w-2 h-2 rounded-full border border-block-stroke"></div>
          </div>
          <div className="flex-1 space-y-3">
            <Line w="w-full" h="h-1" />
            <Line w="w-2/3" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const PaginationBlock = ({ baseClassName, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px]", className)}>
    {ContentWrapper && (
      <ContentWrapper className="mt-0">
        <div className="flex justify-center items-center gap-2 w-full h-full pt-1">
          <div className="text-[6px] text-block-stroke/50 border border-block-stroke/30 px-1 rounded-sm">{'<'}</div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-block-stroke"></div>
            <div className="w-1.5 h-1.5 rounded-sm border border-block-stroke/30"></div>
            <div className="w-1.5 h-1.5 rounded-sm border border-block-stroke/30"></div>
          </div>
          <div className="text-[6px] text-block-stroke/50 border border-block-stroke/30 px-1 rounded-sm">{'>'}</div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const MapContactsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <div className="w-10 h-full border border-block-stroke/30 flex items-center justify-center bg-block-stroke/5 relative overflow-hidden">
            <div className="w-3 h-4 border-2 border-block-stroke/40 rounded-full rounded-bl-none transform -rotate-45"></div>
          </div>
          <div className="flex-1 py-1 flex flex-col justify-center">
            <Line w="w-full" h="h-1" className="mt-1" />
            <Line w="w-2/3" h="h-1" className="mt-1" />
            <div className="flex gap-1 mt-2">
              <div className="w-3 h-3 border border-block-stroke/30 rounded-full"></div>
              <div className="w-3 h-3 border border-block-stroke/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TableOfContentsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-end items-start px-1 w-full">
          <div className="space-y-1">
            <div className="flex gap-1 justify-end">
              <Line w="w-4" h="h-px" />
              <div className="w-1 h-1 rounded-full border border-block-stroke"></div>
            </div>
            <div className="flex gap-1 justify-end">
              <Line w="w-4" h="h-px" />
              <div className="w-1 h-1 rounded-full border border-block-stroke"></div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const InvoiceBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-end items-center w-full border-b border-block-stroke/20 pb-1">
          <Line w="w-4" h="h-1" />
        </div>
        <div className="mt-1 w-full flex flex-col gap-1 h-full">
          <div className="flex gap-1 w-full">
            <div className="flex-1 border-b border-block-stroke/20 h-4"></div>
            <div className="flex-1 border-b border-block-stroke/20 h-4"></div>
            <div className="flex-1 border-b border-block-stroke/20 h-4"></div>
          </div>
          <div className="flex justify-end w-full">
            <Line w="w-1/3" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ChecklistBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex items-center gap-2 px-1 w-full border border-block-stroke/30 rounded-md p-1">
          <div className="w-3 h-3 border border-block-stroke rounded-sm flex items-center justify-center">
            <div className="text-[6px] text-block-stroke">✓</div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const PlansBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-1 h-full w-full">
          <div className="flex-1 border border-block-stroke/40 rounded-md flex flex-col items-center p-1">
            <div className="w-full h-2 bg-block-stroke/10 mb-1"></div>
            <Line w="w-1/2" h="h-1" />
          </div>
          <div className="flex-1 border border-block-stroke/40 rounded-md flex flex-col items-center p-1">
            <div className="w-full h-2 bg-block-stroke/10 mb-1"></div>
            <Line w="w-1/2" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const CatalogBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-1 items-center w-full h-full">
          <Box w="flex-1" h="h-6" />
          <Box w="flex-1" h="h-6" />
          <Box w="flex-1" h="h-6" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const CarouselBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex gap-1 items-center justify-between w-full h-full">
          <div className="w-4 h-full border border-block-stroke/20 flex items-center justify-center bg-block-stroke/5">
            <div className="text-[6px] text-block-stroke/50">{'<'}</div>
          </div>
          <div className="flex-1 h-full mx-1 border border-block-stroke/20 flex items-center justify-center">
          </div>
          <div className="w-4 h-full border border-block-stroke/20 flex items-center justify-center bg-block-stroke/5">
            <div className="text-[6px] text-block-stroke/50">{'>'}</div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
