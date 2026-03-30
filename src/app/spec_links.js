import utf8 from "utf8";

export function encode(spec) {
  return btoa(utf8.encode(spec));
}

export function decode(spec) {
  return utf8.decode(atob(spec));
}

export function getURLSearchParamSpec(search) {
  const spec = new URLSearchParams(search).get("s")?.replaceAll(" ", "+");

  if (spec) {
    try {
      return decode(spec);
    } catch (error) {
      console.error(error);

      return "";
    }
  } else {
    return "";
  }
}

export function copySpecLink(spec) {
  const url = `${window.location.origin}${window.location.pathname}?s=${encode(spec)}`;

  return Promise.resolve()
    .then(() => navigator.clipboard.writeText(url))
    .catch(() => {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
}
