import './ToggleTheme.css';

interface ToggleThemeProps {
  onToggle: () => void;
}

export default function ToggleTheme({ onToggle }: ToggleThemeProps) {
  return (
    <div className="switch">
      <input
        type="checkbox"
        id="theme-toggle"
        onChange={onToggle}
      />
      <label htmlFor="theme-toggle">
        <div className="bulb"></div>
      </label>
    </div>
  );
}
