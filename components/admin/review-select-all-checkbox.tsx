"use client";

import { useEffect, useRef, useState } from "react";

type ReviewSelectAllCheckboxProps = {
  formId: string;
  inputName?: string;
};

function getReviewCheckboxes(formId: string, inputName: string) {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][name="${inputName}"][form="${formId}"]`
    )
  );
}

export function ReviewSelectAllCheckbox({
  formId,
  inputName = "reviewIds"
}: ReviewSelectAllCheckboxProps) {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const syncState = () => {
      const checkboxes = getReviewCheckboxes(formId, inputName);
      const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
      const allChecked = checkboxes.length > 0 && selectedCount === checkboxes.length;
      const partiallyChecked = selectedCount > 0 && selectedCount < checkboxes.length;

      setChecked(allChecked);
      setIndeterminate(partiallyChecked);
    };

    syncState();

    const checkboxes = getReviewCheckboxes(formId, inputName);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", syncState);
    });

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener("change", syncState);
      });
    };
  }, [formId, inputName]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(nextChecked: boolean) {
    const checkboxes = getReviewCheckboxes(formId, inputName);

    checkboxes.forEach((checkbox) => {
      checkbox.checked = nextChecked;
    });

    setChecked(nextChecked);
    setIndeterminate(false);
  }

  return (
    <label className="admin-table__checkbox-label admin-table__checkbox-label--compact">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        aria-label={checked ? "Deselect all reviews" : "Select all reviews"}
        onChange={(event) => handleChange(event.currentTarget.checked)}
      />
      <span>All</span>
    </label>
  );
}
