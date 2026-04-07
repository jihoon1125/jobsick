"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput, type Tag } from "@/components/common/tag-input";

interface FormState {
  positions: Tag[];
  skills: Tag[];
  regions: Tag[];
  experienceYears: number;
  salaryMin: string;
  salaryMax: string;
  workTypes: string[];
  currentCompany: string;
  currentPosition: string;
  positionSuggestions: Tag[];
  skillSuggestions: Tag[];
  saving: boolean;
}

type Action =
  | { type: "SET_POSITIONS"; tags: Tag[] }
  | { type: "SET_SKILLS"; tags: Tag[] }
  | { type: "SET_REGIONS"; tags: Tag[] }
  | {
      type: "SET_FIELD";
      field: string;
      value: string | number;
    }
  | { type: "TOGGLE_WORK_TYPE"; workType: string }
  | { type: "SET_SKILL_SUGGESTIONS"; tags: Tag[] }
  | { type: "SET_SAVING"; saving: boolean };

const REGION_SUGGESTIONS: Tag[] = [
  { id: "region-서울", label: "서울" },
  { id: "region-판교", label: "판교" },
  { id: "region-강남", label: "강남" },
  { id: "region-성남", label: "성남" },
  { id: "region-인천", label: "인천" },
  { id: "region-부산", label: "부산" },
  { id: "region-대전", label: "대전" },
  { id: "region-대구", label: "대구" },
  { id: "region-광주", label: "광주" },
  { id: "region-제주", label: "제주" },
  { id: "region-원격 근무", label: "원격 근무" },
];

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_POSITIONS":
      return { ...state, positions: action.tags };
    case "SET_SKILLS":
      return { ...state, skills: action.tags };
    case "SET_REGIONS":
      return { ...state, regions: action.tags };
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "TOGGLE_WORK_TYPE": {
      const has = state.workTypes.includes(action.workType);
      const next = has
        ? state.workTypes.filter((w) => w !== action.workType)
        : [...state.workTypes, action.workType];
      return { ...state, workTypes: next };
    }
    case "SET_SKILL_SUGGESTIONS":
      return {
        ...state,
        skillSuggestions: action.tags,
      };
    case "SET_SAVING":
      return { ...state, saving: action.saving };
  }
}

const WORK_TYPE_OPTIONS = ["remote", "hybrid", "onsite"] as const;

interface Props {
  initialPositions: Tag[];
  initialSkills: Tag[];
  initialRegions: Tag[];
  initialExperienceYears: number;
  initialSalaryMin: string;
  initialSalaryMax: string;
  initialWorkTypes: string[];
  initialCurrentCompany: string;
  initialCurrentPosition: string;
  positionSuggestions: Tag[];
  skillSuggestions: Tag[];
}

function ProfileForm({
  initialPositions,
  initialSkills,
  initialRegions,
  initialExperienceYears,
  initialSalaryMin,
  initialSalaryMax,
  initialWorkTypes,
  initialCurrentCompany,
  initialCurrentPosition,
  positionSuggestions,
  skillSuggestions,
}: Props) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, {
    positions: initialPositions,
    skills: initialSkills,
    regions: initialRegions,
    experienceYears: initialExperienceYears,
    salaryMin: initialSalaryMin,
    salaryMax: initialSalaryMax,
    workTypes: initialWorkTypes,
    currentCompany: initialCurrentCompany,
    currentPosition: initialCurrentPosition,
    positionSuggestions,
    skillSuggestions,
    saving: false,
  });

  // Update skill suggestions when position changes
  useEffect(() => {
    if (state.positions.length === 0) return;

    async function loadPositionSkills() {
      const positionId = state.positions[0].id;
      const res = await fetch(`/api/tags/skills?positionId=${positionId}`);
      const data = await res.json();

      if (data.skills.length > 0) {
        dispatch({
          type: "SET_SKILL_SUGGESTIONS",
          tags: data.skills,
        });
      }
    }
    loadPositionSkills();
  }, [state.positions]);

  const handleSave = useCallback(async () => {
    dispatch({ type: "SET_SAVING", saving: true });

    const tagIds = [
      ...state.positions.map((tag) => tag.id),
      ...state.skills.map((tag) => tag.id),
    ];

    const preferredRegions = state.regions.map((tag) => tag.label);

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        experienceYears: state.experienceYears,
        salaryMin: state.salaryMin ? Number(state.salaryMin) : null,
        salaryMax: state.salaryMax ? Number(state.salaryMax) : null,
        preferredRegions,
        workTypes: state.workTypes,
        currentCompany: state.currentCompany || null,
        currentPosition: state.currentPosition || null,
        tagIds,
      }),
    });

    dispatch({ type: "SET_SAVING", saving: false });
    router.push("/dashboard");
  }, [state, router]);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>{t("position")}</Label>
        <TagInput
          suggestions={state.positionSuggestions}
          selected={state.positions}
          onChange={(tags) =>
            dispatch({
              type: "SET_POSITIONS",
              tags,
            })
          }
          placeholder={t("positionPlaceholder")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("skills")}</Label>
        <TagInput
          suggestions={state.skillSuggestions}
          selected={state.skills}
          onChange={(tags) => dispatch({ type: "SET_SKILLS", tags })}
          placeholder={t("skillsPlaceholder")}
        />
      </div>

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

      <div className="flex flex-col gap-2">
        <Label>{t("region")}</Label>
        <TagInput
          suggestions={REGION_SUGGESTIONS}
          selected={state.regions}
          onChange={(tags) => dispatch({ type: "SET_REGIONS", tags })}
          placeholder={t("regionPlaceholder")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("workType")}</Label>
        <div className="flex gap-2">{workTypeButtons}</div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("currentCompany")}</Label>
        <Input
          value={state.currentCompany}
          autoComplete="off"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "currentCompany",
              value: e.target.value,
            })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("currentPosition")}</Label>
        <Input
          value={state.currentPosition}
          autoComplete="off"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "currentPosition",
              value: e.target.value,
            })
          }
        />
      </div>

      <Button onClick={handleSave} disabled={state.saving} className="w-full">
        {state.saving ? tc("loading") : tc("save")}
      </Button>
    </div>
  );
}

export { ProfileForm };
