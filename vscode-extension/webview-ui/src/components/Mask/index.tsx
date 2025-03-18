interface TProps {
  style?: React.CSSProperties;
}

function Mask (props:TProps) {
  const {style} = props;
  return (
    <div
      style={{
        position:"fixed",
        zIndex:-1,
        top:0,
        ...style
      }}
    >
      <div
        style={{
          overflowY: 'auto',
          fontFamily: 'monospace',
          lineHeight: 3,
        }}
      >
        <div>[INFO] your extension "fenbi-client" is now active!...</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] build started...</div>
        <div>[INFO] ✓ 2 modules transformed.</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] ../extension/dist/contentScripts/style.css            4.21 kB │ gzip:   1.22 kB</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] build started...</div>
        <div>[INFO] ✓ 2 modules transformed.</div>
        <div style={{ color: '#ff0' }}>[WARNING] Deprecated function used in file.js</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] Compilation started...</div>

        
        <div>[INFO] Changed...</div>
        <div>[INFO] Changed...</div>
        <div style={{ color: '#f00' }}>[ERROR] Syntax error in file.js</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] Compilation completed successfully.</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] build started...</div>
        <div>[INFO] ✓ 2 modules transformed.</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] ../extension/dist/contentScripts/style.css            4.21 kB │ gzip:   1.22 kB</div>
        <div>[INFO] Changed...</div>
        <div>[INFO] build started...</div>
        <div>[INFO] ✓ 2 modules transformed.</div>
        <div style={{ color: '#ff0' }}>[WARNING] Deprecated function used in file.js</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] Compilation started...</div>

        
        <div>[INFO] Changed...</div>
        <div>[INFO] Changed...</div>
        <div style={{ color: '#f00' }}>[ERROR] Syntax error in file.js</div>
        <div style={{ color: '#0f0' }}>[SUCCESS] Compilation completed successfully.</div>
      </div>
    </div>
  );
}

export default Mask;