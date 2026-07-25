import Image from 'next/image';

// A terminal window whose body is a real screenshot of the CLI running,
// rather than a reconstruction. The chrome (traffic lights, title) stays
// live markup; the content is the actual captured output.
export default function TerminalShot({ title, src, width, height, alt, priority = false }) {
  return (
    <div className="demo-window">
      <div className="demo-bar">
        <span className="demo-dot close" />
        <span className="demo-dot min" />
        <span className="demo-dot max" />
        <span className="demo-title">{title}</span>
      </div>
      <div className="demo-shot">
        <Image src={src} width={width} height={height} alt={alt} priority={priority} draggable={false} sizes="(max-width: 820px) 90vw, 620px" />
      </div>
    </div>
  );
}
