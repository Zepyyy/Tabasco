# Issues Summary (React Learning Notes)

This list focuses on correctness and good React practices. File paths point to the current codebase.

## High Impact
- `src/hooks/useGuitarTab.ts`: `handleRemoveSection` checks `tab.length !== NOTES_PER_SECTION`, but `tab.length` is number of strings (6). This allows section deletion even when only one section exists. Use `tab[0]?.length` to guard against removing the last section.
- `src/hooks/useCapo.ts`: The capo value `0` (valid: “no capo”) is treated as falsy. Two spots break `0`:
  - `const capo = currentTab?.capo || ""` turns `0` into `""`.
  - `if (position && capo && ...)` skips saving when `capo` is `0`.
  Use `??` and avoid truthy checks so `0` is preserved (e.g., `const capo = currentTab?.capo ?? -1` and `if (position && capo >= -1 && capo <= MAX_FRET)`).
- `src/components/guitar-tab-creator.tsx` + `src/hooks/useGuitarTab.ts`: `onMouseUpCapture` always calls `handleSwitchNotes`, which throws when the same cell is clicked (`Invalid data format for import`). This can surface on normal clicks. Early-return when positions match; fix error message.

## Medium Impact
- `src/hooks/useTabOperations.ts`: `deleteTabById` already renumbers positions, but `handleDelete` renumbers again. This is redundant and may cause extra writes or race conditions. Also `if (newPosition)` skips navigation when the new position is `"0"`.
- `src/components/TabsDropdownMenu.tsx`: renaming stays in edit mode because `setEditingTab(null)` is never called after rename. Close edit state after `onRename`.

## Low Impact / Polish
- `src/components/TabsDropdownMenu.tsx`: `tabs.sort(...)` mutates the array from `useLiveQuery`. Prefer `tabs.slice().sort(...)` to avoid in-place mutation.
