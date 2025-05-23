const handleGraphQLError = (err: unknown) => ({
  success: false,
  message: err instanceof Error ? err.message : "Unknown error",
  payload: null,
});

export default handleGraphQLError;
