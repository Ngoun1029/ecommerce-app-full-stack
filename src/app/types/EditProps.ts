export type EditProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number | null;
  onSuccess?: () => void;
};
