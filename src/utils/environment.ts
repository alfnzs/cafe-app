export const getENV = (env: string) =>
  import.meta.env[`VITE_${env}`] as string | undefined;
