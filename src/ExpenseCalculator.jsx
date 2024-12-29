import React, { useState, useEffect } from 'react';
import {
  Line as LineChart
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiSun, FiMoon } from 'react-icons/fi';
import 'tailwindcss/tailwind.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExpenseCalculator = () => {
  const [theme, setTheme] = useState('dark'); // Default theme is dark
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState({}); // Expenses by month
  const [selectedMonth, setSelectedMonth] = useState('January');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleIncomeChange = (e) => {
    setIncome(Number(e.target.value));
  };

  const handleExpenseAdd = (e) => {
    e.preventDefault();
    const expenseName = e.target.expenseName.value;
    const expenseAmount = Number(e.target.expenseAmount.value);

    setExpenses((prev) => {
      const monthExpenses = prev[selectedMonth] || [];
      const updatedMonthExpenses = [...monthExpenses, { name: expenseName, amount: expenseAmount }];

      return {
        ...prev,
        [selectedMonth]: updatedMonthExpenses,
      };
    });

    e.target.reset();
  };

  const calculateMonthlyTotal = (month) => {
    return (expenses[month] || []).reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateYearlyTotal = () => {
    const totalExpenses = months.reduce((sum, month) => sum + calculateMonthlyTotal(month), 0);
    const totalSavings = income * 12 - totalExpenses;
    return { totalExpenses, totalSavings };
  };

  const yearlyTotals = calculateYearlyTotal();
  const totalExpenses = calculateMonthlyTotal(selectedMonth);
  const savings = income - totalExpenses;

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Expenses',
        data: months.map((month) => calculateMonthlyTotal(month)),
        borderColor: theme === 'dark' ? '#f87171' : '#ef4444',
        backgroundColor: theme === 'dark' ? '#f87171' : '#ef4444',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Income',
        data: Array(12).fill(income),
        borderColor: theme === 'dark' ? '#22c55e' : '#16a34a',
        backgroundColor: theme === 'dark' ? '#22c55e' : '#16a34a',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Savings',
        data: months.map((month) => income - calculateMonthlyTotal(month)),
        borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        backgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      title: {
        display: true,
        text: 'Monthly Financial Overview',
        color: theme === 'dark' ? '#fff' : '#000',
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
  };

  return (
    <div className={`min-h-screen px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Expense Calculator</h1>
        <button
          className="p-2 rounded-full focus:outline-none"
          onClick={handleThemeSwitch}
        >
          {theme === 'dark' ? (
            <FiSun className="text-yellow-400 text-xl" />
          ) : (
            <FiMoon className="text-gray-800 text-xl" />
          )}
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-xl font-semibold mb-4">Add Income & Expenses</h2>
          <div className="mb-4">
            <label htmlFor="income" className="block text-sm font-medium mb-1">
              Monthly Income
            </label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={handleIncomeChange}
              className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>

          <form onSubmit={handleExpenseAdd}>
            <div className="mb-4">
              <label htmlFor="month" className="block text-sm font-medium mb-1">
                Select Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="expenseName" className="block text-sm font-medium mb-1">
                Expense Name
              </label>
              <input
                type="text"
                id="expenseName"
                name="expenseName"
                required
                className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="expenseAmount" className="block text-sm font-medium mb-1">
                Expense Amount
              </label>
              <input
                type="number"
                id="expenseAmount"
                name="expenseAmount"
                required
                className={`w-full px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-semibold rounded-md ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Add Expense
            </button>
          </form>
        </section>

        <section className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="mb-4">
            <p className="text-sm">Selected Month: <strong>{selectedMonth}</strong></p>
            <p className="text-sm">Total Monthly Expenses: <strong>${totalExpenses.toFixed(2)}</strong></p>
            <p className="text-sm">Savings for {selectedMonth}: <strong>${savings.toFixed(2)}</strong></p>
          </div>
          <div className="mb-4">
            <p className="text-sm">Yearly Total Expenses: <strong>${yearlyTotals.totalExpenses.toFixed(2)}</strong></p>
            <p className="text-sm">Yearly Total Savings: <strong>${yearlyTotals.totalSavings.toFixed(2)}</strong></p>
          </div>
          <LineChart data={chartData} options={chartOptions} />
        </section>
      </main>
    </div>
  );
};

export default ExpenseCalculator;
