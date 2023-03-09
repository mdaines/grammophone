export default function({ spec, specChanged }) {
  return (
    <section id="edit">
      <div className="spec-wrap">
        <textarea className="spec" onInput={(e) => { specChanged(e.target.value); }} defaultValue={spec} />
      </div>
    </section>
  );
}
