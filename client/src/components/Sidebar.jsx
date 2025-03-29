import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Dine In', path: '/dinein', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { name: 'Take Away', path: '/takeaway', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { name: 'Tables', path: '/tables', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { name: 'Categories', path: '/categories', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
        { name: 'Dishes', path: '/dishes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { name: 'Taxes', path: '/taxes', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' }
    ];

    return (
        <div className="h-screen w-64 bg-cultured border-r border-separator">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-16 border-b border-separator">
                    <span className="font-inter text-h4 font-semibold text-dark">Menu</span>
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 font-inter text-p2 rounded-lg ${
                                        location.pathname === item.path
                                            ? 'bg-highlight text-dark font-medium'
                                            : 'text-spanish hover:bg-highlight hover:text-dark'
                                    }`}
                                >
                                    <svg
                                        className={`w-5 h-5 mr-3 ${
                                            location.pathname === item.path ? 'text-amber' : 'text-spanish'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={item.icon}
                                        />
                                    </svg>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar; 