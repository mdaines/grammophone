export default function({ spec, specChanged }) {
  return (
    <div id="edit">
      <div className="spec-wrap">
        <textarea className="spec" onInput={(e) => { specChanged(e.target.value); }} defaultValue={spec} />
      </div>
    </div>
  );
}
