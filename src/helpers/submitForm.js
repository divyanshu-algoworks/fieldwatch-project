export function isDisableMultipleSubmit(modelName) {
  // For the following forms we disable submit button once Request is in progress, to prevent user from creating duplicate entries.
  if (
    [
      'territory',
      'language',
      'risk_level',
      'status',
      'rep_status',
      'rep_rank',
      'category',
      'policy',
      'query',
      'compliance_action',
    ].includes(modelName)
  ) {
    return true;
  }

  return false;
}
