"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button } from "@/components/ui";
import { ShieldCheck } from "lucide-react";
import { getSupporterState, SUPPORTER_CHANGE_EVENT } from "@/lib/supporterStore";
import SupporterStoreView from "./SupporterStoreView";

export default function SupporterStoreModal({ isOpen, onClose }) {
  const [storeState, setStoreState] = useState(getSupporterState());

  useEffect(() => {
    const handleStoreChange = (e) => {
      setStoreState(e.detail || getSupporterState());
    };
    window.addEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
    return () => window.removeEventListener(SUPPORTER_CHANGE_EVENT, handleStoreChange);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supporter Store & Vault (100 Tech Items & Effects)"
      description="Support the developer to maintain the project and unlock custom AGMon virtual office decorations"
      size="full"
      footer={
        <div className="flex items-center justify-between w-full text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {storeState.isSupporter ? (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Status: VIP Supporter Activated (All 100 items unlocked)</span>
              </span>
            ) : (
              <span>100% of AGMon core engineering features remain completely free</span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="h-[80vh] -mx-4 -mt-2 -mb-4 overflow-hidden rounded-md border border-[#333333]">
        <SupporterStoreView hideHeader={true} onClose={onClose} />
      </div>
    </Modal>
  );
}
