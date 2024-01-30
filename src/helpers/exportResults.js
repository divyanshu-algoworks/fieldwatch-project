import getToken from "Helpers/getToken";
import API from "Helpers/api";

function exportResults(
  url,
  filter = {},
  system_generated = false,
  non_violant = false,
  archived = false
) {
  API.post(url, {
    body: {
      authenticity_token: getToken(),
      filter: {
        ...filter,
        archived: {
          direct_select: true,
          values: [archived],
        },
      },
      system_generated,
      non_violant,
    },
  });
}

export default exportResults;
