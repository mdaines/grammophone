const DEFAULT_SPEC = "# Type a grammar here:\n\n";

export function getURLSearchParamSpec() {
  const spec = new URLSearchParams(window.location.search).get("s");

  if (spec) {
    try {
      return atob(spec);
    } catch (error) {
      console.error(error);

      return DEFAULT_SPEC;
    }
  } else {
    return DEFAULT_SPEC;
  }
}

export function copySpecLink(spec) {
  const url = `${window.location.origin}${window.location.pathname}?s=${btoa(spec)}`;

  return navigator.clipboard.writeText(url);
}
