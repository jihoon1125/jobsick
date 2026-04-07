"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

interface Props {
  children: React.ReactNode;
}

function ScrollArea({ children }: Props) {
  return (
    <OverlayScrollbarsComponent
      defer
      element="div"
      className="scroll-area-root min-h-0 flex-1"
      options={{
        scrollbars: {
          theme: "os-theme-custom",
          autoHide: "leave",
        },
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}

export { ScrollArea };
