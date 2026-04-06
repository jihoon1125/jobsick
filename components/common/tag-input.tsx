"use client";

import { useCallback, useMemo, useState } from "react";
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

  const filtered = useMemo(() => {
    const selectedIds = new Set(selected.map((t) => t.id));
    const lower = query.toLowerCase();

    return suggestions
      .filter((t) => !selectedIds.has(t.id))
      .filter((t) => t.label.toLowerCase().includes(lower))
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

  const addTag = useCallback(
    (tag: Tag) => {
      onChange([...selected, tag]);
      setQuery("");
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered.length > 0) {
          addTag(filtered[0]);
        } else if (showCustomOption) {
          handleCustomAdd();
        }
      }
    },
    [filtered, showCustomOption, addTag, handleCustomAdd]
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

  const suggestionItems = filtered.map((tag) => (
    <button
      key={tag.id}
      onClick={() => addTag(tag)}
      className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-accent"
    >
      {tag.label}
    </button>
  ));

  return (
    <div className="flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">{selectedBadges}</div>
      )}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        {query.length > 0 && (filtered.length > 0 || showCustomOption) && (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
            {suggestionItems}
            {showCustomOption && (
              <button
                onClick={handleCustomAdd}
                className="w-full rounded px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent"
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
