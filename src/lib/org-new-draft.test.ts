import { afterEach, describe, expect, it } from "vitest";
import {
  ORG_NEW_DRAFT_KEY,
  clearDraft,
  isDraftDirty,
  loadStepDraft,
  readDraft,
  saveStepDraft,
} from "./org-new-draft";

afterEach(() => localStorage.removeItem(ORG_NEW_DRAFT_KEY));

describe("readDraft", () => {
  it("returns {} when nothing is stored", () => {
    expect(readDraft()).toEqual({});
  });

  it("returns {} for corrupt JSON", () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, "{not json");
    expect(readDraft()).toEqual({});
  });

  it("returns {} when the stored value is not an object", () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, JSON.stringify(["nope"]));
    expect(readDraft()).toEqual({});
  });
});

describe("saveStepDraft / loadStepDraft", () => {
  it("round-trips a step and leaves other steps untouched", () => {
    saveStepDraft("Contact", { email: "a@b.in", phone_number: "+91 1" });
    saveStepDraft("Bank", { ifsc_code: "SBIN0001234" });
    expect(loadStepDraft("Contact", { email: "", phone_number: "" })).toEqual({
      email: "a@b.in",
      phone_number: "+91 1",
    });
    expect(Object.keys(readDraft())).toEqual(["Contact", "Bank"]);
  });

  it("merges saved keys over defaults", () => {
    saveStepDraft("PF", { pf_limit: "15000" });
    expect(loadStepDraft("PF", { pf_limit: "", extension_code: "" })).toEqual({
      pf_limit: "15000",
      extension_code: "",
    });
  });

  it("falls back to defaults when a step value is corrupt", () => {
    localStorage.setItem(ORG_NEW_DRAFT_KEY, JSON.stringify({ Payroll: "corrupt" }));
    expect(loadStepDraft("Payroll", { bonus_percent: "" })).toEqual({ bonus_percent: "" });
  });
});

describe("clearDraft", () => {
  it("removes the stored draft", () => {
    saveStepDraft("ESI", { esi_number: "3100452198" });
    clearDraft();
    expect(localStorage.getItem(ORG_NEW_DRAFT_KEY)).toBeNull();
  });
});

describe("isDraftDirty", () => {
  const defaults = {
    Company: { company_name: "", status: "active" },
    ESI: { esi_number: "", esi_calculated_on: "gross" },
  };

  it("is clean when no draft exists", () => {
    expect(isDraftDirty(defaults)).toBe(false);
  });

  it("is clean when every saved value equals its default", () => {
    saveStepDraft("ESI", { esi_number: "", esi_calculated_on: "gross" });
    expect(isDraftDirty(defaults)).toBe(false);
  });

  it("is dirty when any value differs from its default", () => {
    saveStepDraft("Company", { company_name: "Acme" });
    expect(isDraftDirty(defaults)).toBe(true);
  });

  it("ignores keys that are not in the defaults", () => {
    saveStepDraft("Company", { legacy_field: "x" });
    expect(isDraftDirty(defaults)).toBe(false);
  });
});