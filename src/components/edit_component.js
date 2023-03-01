module.exports = function({ spec, specChanged }) {
  return (
    <section id="edit">
      <div class="spec-wrap">
        <textarea class="spec" value={spec} onInput={(e) => { specChanged(e.target.value); }} />
      </div>
    </section>
  );
}
