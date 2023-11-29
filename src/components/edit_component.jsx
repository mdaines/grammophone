export default function({ spec, specChanged }) {
  return (
    <div id="edit">
      <div className="spec-wrap">
        <textarea className="spec" onChange={(e) => { specChanged(e.target.value); }} value={spec} placeholder="Type a grammar here..." />
      </div>
    </div>
  );
}
