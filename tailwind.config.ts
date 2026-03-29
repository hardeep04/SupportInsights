/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-50': '#f8fafc',
        'slate-100': '#f1f5f9',
        'slate-200': '#e2e8f0',
        'slate-300': '#cbd5e1',
        'slate-400': '#94a3b8',
        'slate-500': '#64748b',
        'slate-600': '#475569',
        'slate-700': '#334155',
        'slate-800': '#1e293b',
        'slate-900': '#0f172a',
        'amber-50': '#fffbeb',
        'amber-100': '#fef3c7',
        'amber-500': '#f59e0b',
        'amber-600': '#d97706',
        'red-50': '#fef2f2',
        'red-100': '#fee2e2',
        'red-500': '#ef4444',
        'red-600': '#dc2626',
        'green-50': '#f0fdf4',
        'green-100': '#dcfce7',
        'green-500': '#22c55e',
        'green-600': '#16a34a',
        'blue-50': '#eff6ff',
        'blue-100': '#dbeafe',
        'blue-500': '#3b82f6',
        'blue-600': '#2563eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
