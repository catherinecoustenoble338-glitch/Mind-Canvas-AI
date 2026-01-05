import React, { useState, useEffect } from 'react';
import { useAppStore, BlockData } from '@/store/useAppStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Paperclip, Send, FileText, Check, X, Target, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageDetailsDialogProps {
  nodeId: string;
  data: BlockData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageDetailsDialog({ nodeId, data, open, onOpenChange }: PageDetailsDialogProps) {
  const { updateNodeData, updatePageVFP, updatePageFeatures } = useAppStore();
  
  // Local state for editing
  const [tempLabel, setTempLabel] = useState(data.label || '');
  const [tempDescription, setTempDescription] = useState(data.description || '');
  const [tempVFP, setTempVFP] = useState(data.vfp || '');
  const [tempFeatures, setTempFeatures] = useState(data.features || '');

  // Sync state when dialog opens or data changes
  useEffect(() => {
      if (open) {
          setTempLabel(data.label || '');
          setTempDescription(data.description || '');
          setTempVFP(data.vfp || '');
          setTempFeatures(data.features || '');
      }
  }, [open, data]);

  const handleSave = () => {
      // Update label and description via generic updateNodeData (or specific if created)
      updateNodeData(nodeId, { label: tempLabel, description: tempDescription });
      
      // Update VFP and Features using specific actions for history logging
      updatePageVFP(nodeId, tempVFP);
      updatePageFeatures(nodeId, tempFeatures);
      
      onOpenChange(false);
  };

  const handleBulletListKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          
          const textarea = e.currentTarget;
          const { selectionStart, selectionEnd } = textarea;
          
          // Find the current line
          const lastNewline = value.lastIndexOf('\n', selectionStart - 1);
          const currentLineStart = lastNewline === -1 ? 0 : lastNewline + 1;
          const currentLine = value.substring(currentLineStart, selectionStart);
          
          // Check if current line starts with a bullet
          const bulletMatch = currentLine.match(/^(\s*)([-*•]\s?)(.*)/);
          
          let newValue = value;
          let newCursorPos = selectionStart + 1;

          if (bulletMatch) {
              const [_, indent, bullet, content] = bulletMatch;
              
              if (content.trim() === '') {
                  // Empty bullet line -> remove bullet
                  const lineEnd = value.indexOf('\n', selectionStart);
                  const afterCursor = lineEnd === -1 ? '' : value.substring(lineEnd);
                  
                  newValue = value.substring(0, currentLineStart) + afterCursor.replace(/^\n/, '');
                  newCursorPos = currentLineStart;
              } else {
                  // Content exists -> continue list
                  const nextBullet = `\n${indent}${bullet}`;
                  newValue = value.substring(0, selectionStart) + nextBullet + value.substring(selectionEnd);
                  newCursorPos = selectionStart + nextBullet.length;
              }
          } else {
              newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
          }

          setter(newValue);
          
          setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = newCursorPos;
          }, 0);
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full sm:h-[700px] sm:max-w-[500px] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-lg rounded-none border-none sm:border">
        <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-1">
                 <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold shrink-0">PAGE</span>
             </div>
             <Input 
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                className="h-8 font-semibold text-slate-700 border-transparent hover:border-slate-200 focus:border-blue-500 px-1 -ml-1 text-base bg-transparent shadow-none"
                placeholder="Page Name"
             />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="sm:hidden -mr-2 text-slate-400">
             <X size={20} />
          </Button>
        </DialogHeader>

        <div className="flex-1 p-0 m-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* Valuable Final Product Section */}
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <Target size={14} className="text-emerald-600" />
                           <label className="text-sm font-semibold text-slate-800">Page VFP (Valuable Final Product)</label>
                       </div>
                       <p className="text-xs text-slate-500 mb-2">What is the specific outcome or value this entire page delivers?</p>
                       <Textarea 
                           placeholder="e.g. User completes the checkout process"
                           className="resize-none text-sm p-3 focus-visible:ring-1 bg-emerald-50/30 border-emerald-100 focus:bg-white focus:border-emerald-500 transition-colors min-h-[60px]"
                           value={tempVFP}
                           onChange={(e) => setTempVFP(e.target.value)}
                       />
                    </div>

                    {/* Features List Section */}
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <List size={14} className="text-blue-600" />
                           <label className="text-sm font-semibold text-slate-800">Page Features</label>
                       </div>
                       <div className="flex justify-between items-center mb-1">
                           <p className="text-xs text-slate-500">Key functional requirements for this page.</p>
                           <span className="text-[10px] text-slate-400">Enter for new bullet</span>
                       </div>
                       <Textarea 
                           placeholder="- Feature 1
- Feature 2"
                           className="resize-none text-sm p-3 focus-visible:ring-1 bg-blue-50/30 border-blue-100 focus:bg-white focus:border-blue-500 transition-colors min-h-[120px]"
                           value={tempFeatures}
                           onChange={(e) => setTempFeatures(e.target.value)}
                           onKeyDown={(e) => handleBulletListKeyDown(e, setTempFeatures, tempFeatures)}
                       />
                    </div>

                    {/* Description / Notes Section */}
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                           <FileText size={14} className="text-slate-600" />
                           <label className="text-sm font-semibold text-slate-800">General Notes</label>
                       </div>
                       <Textarea 
                           placeholder="Any general notes about this page..."
                           className="resize-none text-sm p-3 focus-visible:ring-1 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors min-h-[80px]"
                           value={tempDescription}
                           onChange={(e) => setTempDescription(e.target.value)}
                           onKeyDown={(e) => handleBulletListKeyDown(e, setTempDescription, tempDescription)}
                       />
                    </div>
                </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-slate-100 bg-white">
                <Button onClick={handleSave} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                    <Check size={16} />
                    Save Page Specs
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}