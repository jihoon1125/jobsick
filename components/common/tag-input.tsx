"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Tag {
  id: string;
  label: string;
}

interface Props {
  suggestions: Tag[];
  selected: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

function TagInput({
  suggestions,
  selected,
  onChange,
  placeholder = "",
  allowCustom = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    // Use click (fires after mousedown/up)
    // so the DOM is still intact at check time
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const filtered = useMemo(() => {
    const selectedIds = new Set(selected.map((t) => t.id));
    const lower = query.toLowerCase();

    return suggestions
      .filter((t) => !selectedIds.has(t.id))
      .filter((t) => lower === "" || t.label.toLowerCase().includes(lower))
      .slice(0, 10);
  }, [suggestions, selected, query]);

  const showCustomOption = useMemo(() => {
    if (!allowCustom || query.trim() === "") return false;
    const lower = query.toLowerCase();
    const existsInSuggestions = suggestions.some(
      (t) => t.label.toLowerCase() === lower
    );
    const alreadySelected = selected.some(
      (t) => t.label.toLowerCase() === lower
    );
    return !existsInSuggestions && !alreadySelected;
  }, [allowCustom, query, suggestions, selected]);

  const totalItems = filtered.length + (showCustomOption ? 1 : 0);

  const addTag = useCallback(
    (tag: Tag) => {
      onChange([...selected, tag]);
      setQuery("");
      setActiveIndex(-1);
    },
    [selected, onChange]
  );

  const removeTag = useCallback(
    (tagId: string) => {
      onChange(selected.filter((t) => t.id !== tagId));
    },
    [selected, onChange]
  );

  const handleCustomAdd = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed === "") return;

    const customTag: Tag = {
      id: `custom-${trimmed.toLowerCase()}`,
      label: trimmed,
    };
    addTag(customTag);
  }, [query, addTag]);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-item]");
    const item = items[activeIndex];
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          addTag(filtered[activeIndex]);
        } else if (activeIndex === filtered.length && showCustomOption) {
          handleCustomAdd();
        } else if (filtered.length > 0) {
          addTag(filtered[0]);
        } else if (showCustomOption) {
          handleCustomAdd();
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    },
    [
      open,
      totalItems,
      activeIndex,
      filtered,
      showCustomOption,
      addTag,
      handleCustomAdd,
    ]
  );

  const selectedBadges = selected.map((tag) => (
    <Badge key={tag.id} variant="secondary" className="gap-1">
      {tag.label}
      <button
        onClick={() => removeTag(tag.id)}
        className="rounded-full p-0.5 hover:bg-muted"
      >
        <X className="size-3" />
      </button>
    </Badge>
  ));

  const suggestionItems = filtered.map((tag, i) => (
    <button
      key={tag.id}
      data-item
      onMouseDown={(e) => {
        e.preventDefault();
        addTag(tag);
      }}
      onMouseEnter={() => setActiveIndex(i)}
      className={`w-full rounded px-3 py-1.5 text-left text-sm ${
        i === activeIndex ? "bg-accent" : "hover:bg-accent"
      }`}
    >
      {tag.label}
    </button>
  ));

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
      )}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {open && (filtered.length > 0 || showCustomOption) && (
          <div
            ref={listRef}
            className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
          >
            {suggestionItems}
            {showCustomOption && (
              <button
                data-item
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCustomAdd();
                }}
                onMouseEnter={() => setActiveIndex(filtered.length)}
                className={`w-full rounded px-3 py-1.5 text-left text-sm text-muted-foreground ${
                  activeIndex === filtered.length
                    ? "bg-accent"
                    : "hover:bg-accent"
                }`}
              >
                &quot;{query.trim()}&quot; 추가
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { TagInput };
export type { Tag };
