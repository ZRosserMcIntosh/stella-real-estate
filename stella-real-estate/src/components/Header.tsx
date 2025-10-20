import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container-padded py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900">Stella Real Estate</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#listings" className="text-slate-600 hover:text-brand-600">Listings</a>
            </li>
            <li>
              <a href="#about" className="text-slate-600 hover:text-brand-600">About</a>
            </li>
            <li>
              <a href="#contact" className="text-slate-600 hover:text-brand-600">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;