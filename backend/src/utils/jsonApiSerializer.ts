export function serializeJsonApi(type: string, data: any) {
  if (!data) return { data: null };

  if (Array.isArray(data)) {
    return {
      data: data.map((item) => formatResource(type, item)),
    };
  }

  return { data: formatResource(type, data) };
}

export function serializeError(status: number, title: string, detail?: string) {
  return {
    errors: [
      {
        status: status.toString(),
        title,
        detail,
      },
    ],
  };
}

function formatResource(type: string, item: any) {
  return {
    type,
    id: item._id?.toString() || item.id?.toString(),
    attributes: { ...item, _id: undefined, id: undefined },
  };
}
