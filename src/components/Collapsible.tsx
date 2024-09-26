import React, { useState } from "react";
import "./Collapsible.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./FavoriteList.css";

interface IProps {
  open?: boolean;
  title: string;
  children: React.ReactNode;
}

const Collapsible = ({ open = false, title, children }: IProps) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="card">
      <button
        type="button"
        className="collapsible-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        {title} <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

export default Collapsible;
