export default function({ spec, specChanged }) {
  return (
    <section id="edit">
      <div class="spec-wrap">
        <textarea class="spec" onInput={(e) => { specChanged(e.target.value); }}>{spec}</textarea>
      </div>
    </section>
  );
}
