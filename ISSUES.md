# Issues Summary (React Learning Notes)

Status as of 2026-10-28, checked against the running app. Each entry lists what was found and where it stands.

## Open
- Low: React dev warning "Function components cannot be given refs" when the delete dialog opens (`AlertDialogOverlay` in `src/components/ui/alert-dialog.tsx`). The dialog works, only the dev console is noisy. Likely cause (inferred): the shadcn-style components pass `ref` as a plain prop, which React 19 supports, but the app is on React 18.3, where a function component needs `React.forwardRef`.

## Fixed
- Capo 0 was saved as -1 on import, add, and export (`src/db/crud/Import.ts`, `src/db/crud/AddTab.ts`, `src/hooks/useGuitarTab.ts`). `0` is a valid capo value ("no capo" is -1), but the code used `||`. Now uses `??`. Verified: importing a JSON with `"capo": 0` stores `0`, and a new tab still gets `-1`.
- Delete tab renumbered positions twice (`src/hooks/useTabOperations.ts`). `deleteTabById` already renumbers, so the second pass wrote to the deleted row and logged `No tab found with id`. The second pass is removed. Verified: deleting at position 1 and at position 0 leaves positions 0, 1, 2 with no console error.

## Resolved or stale (checked, no change needed)
- `handleRemoveSection` could delete the last section. It now clears the last section instead of removing it (`src/hooks/useGuitarTab.ts`).
- `useCapo.ts` dropped capo 0. The file no longer exists and no capo UI is present. The live case was the import/add/export one above.
- `handleSwitchNotes` threw on a same-cell click. It now returns early when the two cells match, and the error message is gone. A same-cell click produces no error.
- Delete navigation skipped position `"0"`. `"0"` is a truthy string, and deleting the active tab navigates to `/sheet/0`. The check is now `!== null` to make that explicit.
- `TabsDropdownMenu` rename stayed in edit mode. The file no longer exists. Rename in `src/components/Page/TabName.tsx` exits edit mode on Enter.
- `tabs.sort` mutated live-query data. The file no longer exists, and the only `.sort` is on a local array in `src/db/crud/DeleteTab.ts`.
