"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TagInput, type Tag } from "@/components/common/tag-input";

interface FormState {
  positions: Tag[];
  skills: Tag[];
  experienceYears: number;
  salaryMin: string;
  salaryMax: string;
  preferredRegions: string[];
  regionInput: string;
  workTypes: string[];
  currentCompany: string;
  currentPosition: string;
  positionSuggestions: Tag[];
  skillSuggestions: Tag[];
  saving: boolean;
  loaded: boolean;
}

type Action =
  | { type: "SET_POSITIONS"; tags: Tag[] }
  | { type: "SET_SKILLS"; tags: Tag[] }
  | { type: "SET_FIELD"; field: string; value: string | number }
  | { type: "SET_REGIONS"; regions: string[] }
  | { type: "TOGGLE_WORK_TYPE"; workType: string }
  | {
      type: "SET_SUGGESTIONS";
      field: "positionSuggestions" | "skillSuggestions";
      tags: Tag[];
    }
  | { type: "SET_SAVING"; saving: boolean }
  | { type: "LOAD"; state: Partial<FormState> };

const INITIAL_STATE: FormState = {
  positions: [],
  skills: [],
  experienceYears: 0,
  salaryMin: "",
  salaryMax: "",
  preferredRegions: [],
  regionInput: "",
  workTypes: [],
  currentCompany: "",
  currentPosition: "",
  positionSuggestions: [],
  skillSuggestions: [],
  saving: false,
  loaded: false,
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_POSITIONS":
      return { ...state, positions: action.tags };
    case "SET_SKILLS":
      return { ...state, skills: action.tags };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_REGIONS":
      return {
        ...state,
        preferredRegions: action.regions,
      };
    case "TOGGLE_WORK_TYPE": {
      const has = state.workTypes.includes(action.workType);
      const next = has
        ? state.workTypes.filter((w) => w !== action.workType)
        : [...state.workTypes, action.workType];
      return { ...state, workTypes: next };
    }
    case "SET_SUGGESTIONS":
      return { ...state, [action.field]: action.tags };
    case "SET_SAVING":
      return { ...state, saving: action.saving };
    case "LOAD":
      return { ...state, ...action.state, loaded: true };
  }
}

const WORK_TYPE_OPTIONS = ["remote", "hybrid", "onsite"] as const;

function ProfileForm() {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load suggestions
  useEffect(() => {
    async function loadSuggestions() {
      const [posRes, skillRes] = await Promise.all([
        fetch("/api/tags?category=position"),
        fetch("/api/tags?category=skill"),
      ]);
      const posData = await posRes.json();
      const skillData = await skillRes.json();

      dispatch({
        type: "SET_SUGGESTIONS",
        field: "positionSuggestions",
        tags: posData.tags,
      });
      dispatch({
        type: "SET_SUGGESTIONS",
        field: "skillSuggestions",
        tags: skillData.tags,
      });
    }
    loadSuggestions();
  }, []);

  // Load existing profile
  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      if (!res.ok) return;

      const { profile, tags } = await res.json();
      if (!profile) return;

      const positions = tags.filter(
        (t: Tag & { category: string }) => t.category === "position"
      );
      const skills = tags.filter(
        (t: Tag & { category: string }) => t.category === "skill"
      );

      dispatch({
        type: "LOAD",
        state: {
          positions,
          skills,
          experienceYears: profile.experience_years ?? 0,
          salaryMin: profile.salary_min?.toString() ?? "",
          salaryMax: profile.salary_max?.toString() ?? "",
          preferredRegions: profile.preferred_regions ?? [],
          workTypes: profile.work_types ?? [],
          currentCompany: profile.current_company ?? "",
          currentPosition: profile.current_position ?? "",
        },
      });
    }
    loadProfile();
  }, []);

  // Update skill suggestions when position changes
  useEffect(() => {
    if (state.positions.length === 0) return;

    async function loadPositionSkills() {
      const positionId = state.positions[0].id;
      const res = await fetch(`/api/tags/skills?positionId=${positionId}`);
      const data = await res.json();

      if (data.skills.length > 0) {
        dispatch({
          type: "SET_SUGGESTIONS",
          field: "skillSuggestions",
          tags: data.skills,
        });
      }
    }
    loadPositionSkills();
  }, [state.positions]);

  const handleSave = useCallback(async () => {
    dispatch({ type: "SET_SAVING", saving: true });

    const tagIds = [
      ...state.positions.map((t) => t.id),
      ...state.skills.map((t) => t.id),
    ];

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        experienceYears: state.experienceYears,
        salaryMin: state.salaryMin ? Number(state.salaryMin) : null,
        salaryMax: state.salaryMax ? Number(state.salaryMax) : null,
        preferredRegions: state.preferredRegions,
        workTypes: state.workTypes,
        currentCompany: state.currentCompany || null,
        currentPosition: state.currentPosition || null,
        tagIds,
      }),
    });

    dispatch({ type: "SET_SAVING", saving: false });
  }, [state]);

  const handleAddRegion = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const value = state.regionInput.trim();
      if (value === "" || state.preferredRegions.includes(value)) return;
      dispatch({
        type: "SET_REGIONS",
        regions: [...state.preferredRegions, value],
      });
      dispatch({
        type: "SET_FIELD",
        field: "regionInput",
        value: "",
      });
    },
    [state.regionInput, state.preferredRegions]
  );

  const handleRemoveRegion = useCallback(
    (region: string) => {
      dispatch({
        type: "SET_REGIONS",
        regions: state.preferredRegions.filter((r) => r !== region),
      });
    },
    [state.preferredRegions]
  );

  const workTypeButtons = WORK_TYPE_OPTIONS.map((wt) => {
    const isActive = state.workTypes.includes(wt);
    return (
      <Button
        key={wt}
        type="button"
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={() =>
          dispatch({
            type: "TOGGLE_WORK_TYPE",
            workType: wt,
          })
        }
      >
        {t(wt)}
      </Button>
    );
  });

  const regionBadges = state.preferredRegions.map((region) => (
    <Badge key={region} variant="secondary" className="gap-1">
      {region}
      <button
        onClick={() => handleRemoveRegion(region)}
        className="rounded-full p-0.5 hover:bg-muted"
      >
        ×
      </button>
    </Badge>
  ));

  return (
    <div className="flex flex-col gap-6">
      {/* Position */}
      <div className="flex flex-col gap-2">
        <Label>{t("position")}</Label>
        <TagInput
          suggestions={state.positionSuggestions}
          selected={state.positions}
          onChange={(tags) => dispatch({ type: "SET_POSITIONS", tags })}
          placeholder={t("positionPlaceholder")}
        />
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-2">
        <Label>{t("skills")}</Label>
        <TagInput
          suggestions={state.skillSuggestions}
          selected={state.skills}
          onChange={(tags) => dispatch({ type: "SET_SKILLS", tags })}
          placeholder={t("skillsPlaceholder")}
        />
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-2">
        <Label>{t("experience")}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            className="w-24"
            value={state.experienceYears}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "experienceYears",
                value: Number(e.target.value),
              })
            }
          />
          <span className="text-sm text-muted-foreground">
            {t("experienceYears")}
          </span>
        </div>
      </div>

      {/* Salary */}
      <div className="flex flex-col gap-2">
        <Label>{t("salaryRange")}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("salaryMin")}
            className="w-32"
            value={state.salaryMin}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "salaryMin",
                value: e.target.value,
              })
            }
          />
          <span>~</span>
          <Input
            type="number"
            placeholder={t("salaryMax")}
            className="w-32"
            value={state.salaryMax}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "salaryMax",
                value: e.target.value,
              })
            }
          />
          <span className="text-sm text-muted-foreground">
            {t("salaryUnit")}
          </span>
        </div>
      </div>

      {/* Region */}
      <div className="flex flex-col gap-2">
        <Label>{t("region")}</Label>
        {state.preferredRegions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">{regionBadges}</div>
        )}
        <Input
          value={state.regionInput}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "regionInput",
              value: e.target.value,
            })
          }
          onKeyDown={handleAddRegion}
          placeholder={t("regionPlaceholder")}
        />
      </div>

      {/* Work Type */}
      <div className="flex flex-col gap-2">
        <Label>{t("workType")}</Label>
        <div className="flex gap-2">{workTypeButtons}</div>
      </div>

      {/* Current Company */}
      <div className="flex flex-col gap-2">
        <Label>{t("currentCompany")}</Label>
        <Input
          value={state.currentCompany}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "currentCompany",
              value: e.target.value,
            })
          }
        />
      </div>

      {/* Current Position */}
      <div className="flex flex-col gap-2">
        <Label>{t("currentPosition")}</Label>
        <Input
          value={state.currentPosition}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "currentPosition",
              value: e.target.value,
            })
          }
        />
      </div>

      {/* Save */}
      <Button onClick={handleSave} disabled={state.saving} className="w-full">
        {state.saving ? tc("loading") : tc("save")}
      </Button>
    </div>
  );
}

export { ProfileForm };
