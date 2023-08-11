import utf8 from "utf8";

export const DEFAULT_SPEC = "# Type a grammar here:\n\n";

export function encode(stringToEncode) {
  return btoa(
    utf8.encode(
      stringToEncode
    )
  )
  .replaceAll("+", "-")
  .replaceAll("/", "_")
  .replaceAll("=", "~");
}

export function decode(stringToDecode) {
  return utf8.decode(
    atob(
      stringToDecode
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .replaceAll("~", "=")
      .replaceAll(" ", "+")
    )
  );
}

export function getURLSearchParamSpec(search) {
  const param = new URLSearchParams(search).get("s");

  if (param) {
    try {
      return decode(param);
    } catch (error) {
      console.error(error);

      return DEFAULT_SPEC;
    }
  } else {
    return DEFAULT_SPEC;
  }
}

export function copySpecLink(spec) {
  const url = `${window.location.origin}${window.location.pathname}?s=${encode(spec)}`;

  return navigator.clipboard.writeText(url);
}
