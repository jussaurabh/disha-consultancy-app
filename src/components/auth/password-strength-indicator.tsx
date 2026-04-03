import { CheckCircle2, Circle } from "lucide-react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary as commonDictionary, adjacencyGraphs } from "@zxcvbn-ts/language-common";
import { dictionary, translations } from "@zxcvbn-ts/language-en";

interface PasswordStrengthIndicatorProps {
  password: string;
}

let zxcvbnConfigured = false;

function configureZxcvbn() {
  if (zxcvbnConfigured) return;

  zxcvbnOptions.setOptions({
    dictionary: {
      ...commonDictionary,
      ...dictionary,
    },
    graphs: adjacencyGraphs,
    translations,
  });

  zxcvbnConfigured = true;
}

function getStrengthScore(password: string) {
  if (!password) return 0;
  configureZxcvbn();
  return zxcvbn(password).score;
}

function getFilledSegments(score: number) {
  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

function getStrengthColor(score: number) {
  if (score <= 1) return "bg-red-600";
  if (score === 2) return "bg-orange-500";
  if (score === 3) return "bg-yellow-500";
  return "bg-green-600";
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const score = getStrengthScore(password);
  const filledSegments = password ? getFilledSegments(score) : 0;
  const strengthColor = getStrengthColor(score);

  const requirements = [
    {
      label: "At least 8 characters",
      isMet: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      isMet: /[A-Z]/.test(password),
    },
    {
      label: "Contains number",
      isMet: /\d/.test(password),
    },
    {
      label: "Contains special character",
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div role="status" aria-live="polite" aria-label={`Password strength: ${score} out of 4`} className="space-y-2">
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full ${index < filledSegments ? strengthColor : "bg-zinc-200"}`}
          />
        ))}
      </div>

      <ul className="space-y-1">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            aria-label={`${requirement.label}: ${requirement.isMet ? "met" : "not met"}`}
            className={`flex items-center gap-2 text-xs ${requirement.isMet ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {requirement.isMet ? (
              <CheckCircle2 className="size-3.5 text-green-600" />
            ) : (
              <Circle className="size-3.5 text-zinc-300" />
            )}
            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
